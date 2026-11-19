'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EllipsisVertical, Lock, TriangleAlert, User, UserMinus, UserPlus, X } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/CompanyUsers.module.css';
import extra from '@/_styles/cssUserPanelPage/Brand.module.css';
import { request } from '@/lib/request';
import { AddBrandUserModal } from '@/_components/userPanelComponents/AddBrandUserModal';

type Role = 'EDITOR' | 'VIEWER';

export type BrandMember = {
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  brandRole: Role;
};

const ROLE_LABEL: Record<Role, string> = { EDITOR: 'Editor', VIEWER: 'Viewer' };
const ROLE_HINT: Record<Role, string> = {
  EDITOR: 'Can create and edit products, manuals and brand content.',
  VIEWER: "Can only view this brand's products and content.",
};

type Props = {
  brandId: number;
  brandName: string;
  members: BrandMember[];
};

type Panel = null | 'menu' | 'details' | 'role' | 'remove';

function MemberRow({
  member,
  brandId,
  brandName,
}: {
  member: BrandMember;
  brandId: number;
  brandName: string;
}) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [role, setRole] = useState<Role>(member.brandRole);
  const [busy, setBusy] = useState(false);
  const [coords, setCoords] = useState<{ top: number; right: number }>({ top: 0, right: 0 });

  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const fullName = `${member.firstName} ${member.lastName}`;
  const url = `/api/brands/${brandId}/members/${member.userId}`;

  function toggleMenu() {
    if (panel) {
      setPanel(null);
      return;
    }
    setRole(member.brandRole);
    setPanel('menu');
  }

  // Recalcula a posição exata sempre que o painel abre, muda de aba ou a tela rola/redimensiona
  useLayoutEffect(() => {
    if (!panel) return;

    function updatePosition() {
      if (!btnRef.current || !panelRef.current) return;
      const btn = btnRef.current.getBoundingClientRect();
      const pop = panelRef.current.getBoundingClientRect();

      let top = btn.bottom + 6;
      const right = Math.max(12, window.innerWidth - btn.right);

      if (top + pop.height > window.innerHeight - 12) {
        top = Math.max(12, btn.top - pop.height - 6);
      }

      setCoords({ top, right });
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [panel]);

  // Fecha ao clicar fora do painel
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
    toast.success(method === 'PATCH' ? 'Role updated.' : 'User removed from the brand.');
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
        <span
          className={`${styles.role} ${member.brandRole === 'EDITOR' ? styles.roleMember : extra.roleViewer}`}
        >
          {ROLE_LABEL[member.brandRole]}
        </span>
        <button
          ref={btnRef}
          type="button"
          className={styles.kebab}
          aria-label={`Actions for ${fullName}`}
          aria-expanded={panel !== null}
          onClick={toggleMenu}
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
              >
                <UserMinus size={14} aria-hidden /> Remove from brand
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
                <dt>Role</dt><dd>{ROLE_LABEL[member.brandRole]}</dd>
              </dl>
            </>
          )}

          {panel === 'role' && (
            <>
              <div className={styles.panelHeader}>
                <p className={styles.panelTitle}>Change user role</p>
                <button
                  type="button"
                  className={styles.closeMini}
                  onClick={() => setPanel(null)}
                  disabled={busy}
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
              {(['EDITOR', 'VIEWER'] as const).map((r) => (
                <label key={r} className={styles.roleOption}>
                  <input
                    type="radio"
                    name={`role-${member.userId}`}
                    checked={role === r}
                    onChange={() => setRole(r)}
                  />
                  <span>{ROLE_LABEL[r]}</span>
                  <small>{ROLE_HINT[r]}</small>
                </label>
              ))}
              <hr className={styles.panelDivider} />
              <div className={styles.panelActions}>
                <button
                  type="button"
                  className={styles.pillBtn}
                  disabled={busy || role === member.brandRole}
                  onClick={() => run('PATCH', { brandRole: role })}
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
                Are you sure you want to remove {fullName} from the <strong>{brandName}</strong> brand?
              </p>
              <p className={styles.panelSmall}>
                The user account will not be deleted. Only their access to this brand will be removed.
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

export function BrandUsers({ brandId, brandName, members }: Props) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <section className={styles.section} aria-label="Brand users">
      <header className={styles.head}>
        <div>
          <h2 className={styles.headTitle}>Brand Users</h2>
          <p className={styles.headSub}>Manage users and their access permissions.</p>
        </div>
        <span className={styles.count}>
          {members.length} {members.length === 1 ? 'user' : 'users'}
        </span>
      </header>

      {members.length === 0 ? (
        <p className={extra.empty}>
          No users added yet. Company owners always have access to every brand.
        </p>
      ) : (
        <ul className={styles.list}>
          {members.map((m) => (
            <MemberRow key={m.userId} member={m} brandId={brandId} brandName={brandName} />
          ))}
        </ul>
      )}

      <div className={extra.singleAction}>
        <button type="button" className={styles.actionBtn} onClick={() => setAddOpen(true)}>
          <UserPlus size={14} aria-hidden /> Add user
        </button>
      </div>

     {addOpen && (
        <AddBrandUserModal
          brandId={brandId}
          onClose={() => setAddOpen(false)}
          onAdded={() => {
            setAddOpen(false);
            router.refresh();
          }}
        />
      )}
    </section>
  );
}