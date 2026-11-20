'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EllipsisVertical, Lock, Plus, TriangleAlert, User, UserMinus, UserPlus, X } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/CompanyUsers.module.css';
import { request } from '@/lib/request';
import { AddExistingUserModal } from '@/_components/userPanelComponents/AddExistingUserModal';
import { CreateUserModal } from '@/_components/userPanelComponents/CreateUserModal';

type Role = 'OWNER' | 'MANAGER' | 'MEMBER';

const ROLE_CONFIG: Record<
  Role,
  { label: string; description: string; badgeClass: string }
> = {
  OWNER: {
    label: 'Owner',
    description: 'Full access to company management.',
    badgeClass: styles.roleOwner,
  },
  MANAGER: {
    label: 'Manager',
    description: 'Can manage and edit the company’s brands.',
    badgeClass: styles.roleManager,
  },
  MEMBER: {
    label: 'Member',
    description: "Can access the company's brands.",
    badgeClass: styles.roleMember,
  },
};

const ROLES_LIST: Role[] = ['OWNER', 'MANAGER', 'MEMBER'];

export type Member = {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  companyRole: Role;
};

type Props = {
  companyId: number;
  companyName: string;
  currentUserId: number;
  members: Member[];
};

type Panel = null | 'menu' | 'details' | 'role' | 'remove';

function MemberRow({
  member,
  companyId,
  companyName,
  isSelf,
}: {
  member: Member;
  companyId: number;
  companyName: string;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [role, setRole] = useState<Role>(member.companyRole);
  const [busy, setBusy] = useState(false);
  const [coords, setCoords] = useState<{ top: number; right: number }>({ top: 0, right: 0 });

  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const fullName = `${member.firstName} ${member.lastName}`;
  const url = `/api/companies/${companyId}/members/${member.userId}`;
  const currentRoleInfo = ROLE_CONFIG[member.companyRole] || ROLE_CONFIG.MEMBER;

  function openMenu() {
    if (panel) {
      setPanel(null);
      return;
    }
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow < 220 ? Math.max(12, rect.top - 160) : rect.bottom + 6;
      const right = Math.max(12, window.innerWidth - rect.right);
      setCoords({ top, right });
    }
    setRole(member.companyRole);
    setPanel('menu');
  }

  useEffect(() => {
    if (!panel) return;
    function handleOutside(e: MouseEvent) {
      if (busy) return;
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setPanel(null);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [panel, busy]);

  async function run(method: 'PATCH' | 'DELETE', body?: unknown) {
    setBusy(true);
    const err = await request(url, method, body);
    setBusy(false);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success(method === 'PATCH' ? 'Role updated.' : 'User removed from the company.');
    setPanel(null);
    router.refresh();
  }

  return (
    <li className={styles.member}>
      <div className={styles.memberRow}>
        <span className={styles.avatar}><User size={18} aria-hidden /></span>
        <div className={styles.who}>
          <span className={styles.whoName}>{fullName}</span>
          <span className={styles.whoEmail}>{member.email}</span>
        </div>
        <span className={`${styles.role} ${currentRoleInfo.badgeClass}`}>
          {currentRoleInfo.label}
        </span>
        <button
          ref={btnRef}
          type="button"
          className={styles.kebab}
          aria-label={`Actions for ${fullName}`}
          aria-expanded={panel !== null}
          onClick={openMenu}
        >
          <EllipsisVertical size={18} aria-hidden />
        </button>
      </div>

      {panel !== null && (
        <div
          ref={panelRef}
          className={styles.floatingPanel}
          style={{ top: coords.top, right: coords.right }}
        >
          {panel === 'menu' && (
            <>
              <button type="button" className={styles.panelItem} onClick={() => setPanel('role')}>
                <Lock size={14} aria-hidden /> Change role
              </button>
              <button type="button" className={styles.panelItem} onClick={() => setPanel('details')}>
                <User size={14} aria-hidden /> View details
              </button>
              <hr className={styles.panelDivider} />
              <button
                type="button"
                className={`${styles.panelItem} ${styles.danger}`}
                onClick={() => setPanel('remove')}
                disabled={isSelf}
                title={isSelf ? "You can't remove yourself" : undefined}
              >
                <UserMinus size={14} aria-hidden /> Remove from company
              </button>
            </>
          )}

          {panel === 'details' && (
            <>
              <div className={styles.panelHeader}>
                <p className={styles.panelTitle}>User details</p>
                <button type="button" className={styles.closeMini} onClick={() => setPanel(null)} aria-label="Close">
                  <X size={14} />
                </button>
              </div>
              <dl className={styles.details}>
                <dt>Name</dt><dd>{fullName}</dd>
                <dt>Username</dt><dd>{member.userName}</dd>
                <dt>Email</dt><dd>{member.email}</dd>
                <dt>Role</dt><dd>{currentRoleInfo.label}</dd>
              </dl>
            </>
          )}

          {panel === 'role' && (
            <>
              <div className={styles.panelHeader}>
                <p className={styles.panelTitle}>Change user role</p>
                <button type="button" className={styles.closeMini} onClick={() => setPanel(null)} disabled={busy} aria-label="Close">
                  <X size={14} />
                </button>
              </div>
              {ROLES_LIST.map((r) => (
                <label key={r} className={styles.roleOption}>
                  <input
                    type="radio"
                    name={`role-${member.userId}`}
                    checked={role === r}
                    onChange={() => setRole(r)}
                  />
                  <span>{ROLE_CONFIG[r].label}</span>
                  <small>{ROLE_CONFIG[r].description}</small>
                </label>
              ))}
              <hr className={styles.panelDivider} />
              <div className={styles.panelActions}>
                <button
                  type="button"
                  className={styles.pillBtn}
                  disabled={busy || role === member.companyRole}
                  onClick={() => run('PATCH', { companyRole: role })}
                >
                  {busy ? 'Saving...' : 'Save role'}
                </button>
              </div>
            </>
          )}

          {panel === 'remove' && (
            <>
              <p className={styles.panelTitle}>
                <TriangleAlert size={15} className={styles.warn} aria-hidden /> Remove user?
              </p>
              <p className={styles.panelText}>
                Are you sure you want to remove {fullName} from <strong>{companyName}</strong>?
              </p>
              <p className={styles.panelSmall}>
                The user account will not be deleted. Only their access to this company will be removed.
              </p>
              <div className={styles.panelActions}>
                <button type="button" className={styles.pillBtn} onClick={() => setPanel(null)} disabled={busy}>
                  Cancel
                </button>
                <button type="button" className={styles.dangerBtn} onClick={() => run('DELETE')} disabled={busy}>
                  {busy ? 'Removing...' : 'Remove user'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </li>
  );
}

export function CompanyUsers({ companyId, companyName, currentUserId, members }: Props) {
    const router = useRouter();
  const [modal, setModal] = useState<'add' | 'create' | null>(null);

  const done = () => {
    setModal(null);
    router.refresh();
  };

  return (
    <section className={styles.section} aria-label="Company users">
      <header className={styles.head}>
        <div>
          <h2 className={styles.headTitle}>Company Users</h2>
          <p className={styles.headSub}>Manage users and their access permissions.</p>
        </div>
        <span className={styles.count}>{members.length} {members.length === 1 ? 'user' : 'users'}</span>
      </header>

      <ul className={styles.list}>
        {members.map((m) => (
          <MemberRow
            key={m.userId}
            member={m}
            companyId={companyId}
            companyName={companyName}
            isSelf={m.userId === currentUserId}
          />
        ))}
      </ul>

      <div className={styles.actions}>
        <button type="button" className={styles.actionBtn} onClick={() => setModal('add')}>
          <UserPlus size={14} aria-hidden /> Add existing user
        </button>
        <button type="button" className={styles.actionBtn} onClick={() => setModal('create')}>
          <Plus size={14} aria-hidden /> Create user
        </button>
      </div>

      {modal === 'add' && (
        <AddExistingUserModal companyId={companyId} onClose={() => setModal(null)} onAdded={done} />
      )}

      {modal === 'create' && (
        <CreateUserModal companyId={companyId} companyName={companyName} onClose={() => setModal(null)} onCreated={done} />
      )}

    </section>
  );
}
