'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EllipsisVertical, Lock, Plus, TriangleAlert, User, UserMinus, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/CompanyUsers.module.css';
import { request } from '@/lib/request';
import { AddExistingUserModal } from '@/_components/userPanelComponents/AddExistingUserModal';
import { CreateUserModal } from '@/_components/userPanelComponents/CreateUserModal';

type Role = 'OWNER' | 'MEMBER';

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

  const fullName = `${member.firstName} ${member.lastName}`;
  const url = `/api/companies/${companyId}/members/${member.userId}`;

  async function run(method: 'PATCH' | 'DELETE', body?: unknown) {
    setBusy(true);
    const err = await request(url, method, body);
    setBusy(false);
    if (err) {
      toast.error(err);
      return; // o painel continua aberto para tentar de novo
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
        <span className={`${styles.role} ${member.companyRole === 'OWNER' ? styles.roleOwner : styles.roleMember}`}>
          {member.companyRole === 'OWNER' ? 'Owner' : 'Member'}
        </span>
        <button
          type="button"
          className={styles.kebab}
          aria-label={`Actions for ${fullName}`}
          aria-expanded={panel !== null}
          onClick={() => {
            setRole(member.companyRole);
            setPanel((p) => (p ? null : 'menu'));
          }}
        >
          <EllipsisVertical size={18} aria-hidden />
        </button>
      </div>

      {panel === 'menu' && (
        <div className={styles.panel}>
          <button type="button" className={styles.panelItem} onClick={() => setPanel('role')}>
            <Lock size={13} aria-hidden /> Change role
          </button>
          <button type="button" className={styles.panelItem} onClick={() => setPanel('details')}>
            <User size={13} aria-hidden /> View details
          </button>
          <hr className={styles.panelDivider} />
          <button
            type="button"
            className={`${styles.panelItem} ${styles.danger}`}
            onClick={() => setPanel('remove')}
            disabled={isSelf}
            title={isSelf ? "You can't remove yourself" : undefined}
          >
            <UserMinus size={13} aria-hidden /> Remove from company
          </button>
        </div>
      )}

      {panel === 'details' && (
        <div className={styles.panel}>
          <dl className={styles.details}>
            <dt>Name</dt><dd>{fullName}</dd>
            <dt>Username</dt><dd>{member.userName}</dd>
            <dt>Email</dt><dd>{member.email}</dd>
            <dt>Role</dt><dd>{member.companyRole === 'OWNER' ? 'Owner' : 'Member'}</dd>
          </dl>
        </div>
      )}

      {panel === 'role' && (
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Change user role</p>
          {(['OWNER', 'MEMBER'] as const).map((r) => (
            <label key={r} className={styles.roleOption}>
              <input type="radio" name={`role-${member.userId}`} checked={role === r} onChange={() => setRole(r)} />
              <span>{r === 'OWNER' ? 'Owner' : 'Member'}</span>
              <small>{r === 'OWNER' ? 'Full access to company management.' : "Can access the company's brands."}</small>
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
        </div>
      )}

      {panel === 'remove' && (
        <div className={styles.panel}>
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
        <CreateUserModal
          companyId={companyId}
          companyName={companyName}
          onClose={() => setModal(null)}
          onCreated={() => {
            toast.success('User created and added to the company.');
            done();
          }}
        />
      )}
    </section>
  );
}