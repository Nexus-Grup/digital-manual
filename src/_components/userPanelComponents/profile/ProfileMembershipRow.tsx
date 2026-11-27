'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EllipsisVertical, LogOut, Pencil, TriangleAlert, User, X } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/CompanyUsers.module.css';
import page from '@/_styles/cssUserPanelPage/Profile.module.css';
import { request } from '@/lib/request';

type Panel = null | 'menu' | 'details' | 'leave';

export type MembershipRowProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  roleLabel: string;
  roleClassName: string;
  entity: 'company' | 'brand';
  details: { label: string; value: string }[];
  /** Link da tela de edição. Se vier vazio, o item "Editar" não aparece. */
  editHref?: string | null;
  /** DELETE .../members/[meuUserId] */
  leaveUrl: string;
  /** Se vier preenchido, "Sair" fica desabilitado e o texto é mostrado ao usuário. */
  leaveBlockedReason?: string | null;
};

export function ProfileMembershipRow({
  icon,
  title,
  subtitle,
  roleLabel,
  roleClassName,
  entity,
  details,
  editHref,
  leaveUrl,
  leaveBlockedReason,
}: MembershipRowProps) {
  const router = useRouter();
  // pt-BR words for the entity: "a empresa" / "a marca" (both feminine)
  const entityName = entity === 'company' ? 'empresa' : 'marca';
  const [panel, setPanel] = useState<Panel>(null);
  const [busy, setBusy] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });

  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Posiciona o painel flutuante junto do botão (mesma lógica do BrandUsers)
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

  // Fecha ao clicar fora ou apertar Esc
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

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !busy) {
        setPanel(null);
        btnRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [panel, busy]);

  async function leave() {
    setBusy(true);
    const err = await request(leaveUrl, 'DELETE');
    setBusy(false);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success(`Você saiu de ${title}.`);
    setPanel(null);
    router.refresh();
  }

  return (
    <li>
      <div className={page.row}>
        <span className={page.rowIcon}>{icon}</span>
        <div className={styles.who}>
          <span className={styles.whoName}>{title}</span>
          {subtitle && <span className={styles.whoEmail}>{subtitle}</span>}
        </div>
        <span className={`${styles.role} ${roleClassName}`}>{roleLabel}</span>
        <button
          ref={btnRef}
          type="button"
          className={styles.kebab}
          aria-label={`Ações de ${title}`}
          aria-expanded={panel !== null}
          onClick={() => setPanel(panel ? null : 'menu')}
        >
          <EllipsisVertical size={18} aria-hidden />
        </button>
      </div>

      {panel !== null && (
        <div ref={panelRef} className={styles.floatingPanel} style={{ top: coords.top, right: coords.right }}>
          {panel === 'menu' && (
            <>
              <button type="button" className={styles.panelItem} onClick={() => setPanel('details')}>
                <User size={14} aria-hidden /> Ver detalhes
              </button>

              {editHref && (
                <Link
                  href={editHref}
                  className={`${styles.panelItem} ${page.menuLink}`}
                  onClick={() => setPanel(null)}
                >
                  <Pencil size={14} aria-hidden /> Editar {entityName}
                </Link>
              )}

              <hr className={styles.panelDivider} />

              <button
                type="button"
                className={`${styles.panelItem} ${styles.danger}`}
                disabled={!!leaveBlockedReason}
                onClick={() => setPanel('leave')}
              >
                <LogOut size={14} aria-hidden /> Sair da {entityName}
              </button>
              {leaveBlockedReason && <p className={styles.panelSmall}>{leaveBlockedReason}</p>}
            </>
          )}

          {panel === 'details' && (
            <>
              <div className={styles.panelHeader}>
                <p className={styles.panelTitle}>Detalhes</p>
                <button type="button" className={styles.closeMini} onClick={() => setPanel(null)} aria-label="Fechar">
                  <X size={14} />
                </button>
              </div>
              <dl className={styles.details}>
                {details.map((d) => (
                  <div key={d.label} style={{ display: 'contents' }}>
                    <dt>{d.label}</dt>
                    <dd>{d.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}

          {panel === 'leave' && (
            <>
              <p className={styles.panelTitle}>
                <TriangleAlert size={15} className={styles.warn} aria-hidden /> Sair da {entityName}?
              </p>
              <p className={styles.panelText}>
                Tem certeza de que deseja sair de <strong>{title}</strong>?
              </p>
              <p className={styles.panelSmall}>
                Sua conta não será excluída. Você só perderá o acesso a esta {entityName}.
              </p>
              <div className={styles.panelActions}>
                <button type="button" className={styles.pillBtn} onClick={() => setPanel(null)} disabled={busy}>
                  Cancelar
                </button>
                <button type="button" className={styles.dangerBtn} onClick={leave} disabled={busy}>
                  {busy ? 'Saindo...' : `Sair da ${entityName}`}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </li>
  );
}
