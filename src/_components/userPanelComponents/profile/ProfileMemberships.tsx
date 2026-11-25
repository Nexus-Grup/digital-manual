import { Building2, Tags } from 'lucide-react';
import styles from '@/_styles/cssUserPanelPage/CompanyUsers.module.css';
import extra from '@/_styles/cssUserPanelPage/Brand.module.css';
import page from '@/_styles/cssUserPanelPage/Profile.module.css';
import { ProfileMembershipRow } from '@/_components/userPanelComponents/profile/ProfileMembershipRow';

export type ProfileCompany = {
  companyId: number;
  name: string;
  role: 'OWNER' | 'MANAGER' | 'MEMBER';
  /** O servidor decide se o usuário pode abrir a tela de edição */
  canEdit: boolean;
  /** Ex.: "You are the only owner of this company." (null = pode sair) */
  leaveBlockedReason: string | null;
};

export type ProfileBrand = {
  brandId: number;
  name: string;
  companyName: string;
  /** OWNER e MANAGER = acesso implícito pela empresa */
  role: 'OWNER' | 'MANAGER' | 'EDITOR' | 'VIEWER';
  canEdit: boolean;
  leaveBlockedReason: string | null;
};

const COMPANY_ROLE = {
  OWNER: { label: 'Owner', className: styles.roleOwner },
  MANAGER: { label: 'Manager', className: styles.roleManager },
  MEMBER: { label: 'Member', className: styles.roleMember },
} as const;

const BRAND_ROLE = {
  OWNER: { label: 'Owner', className: styles.roleOwner },
  MANAGER: { label: 'Manager', className: styles.roleManager },
  EDITOR: { label: 'Editor', className: styles.roleMember },
  VIEWER: { label: 'Viewer', className: extra.roleViewer },
} as const;

function SectionHead({ title, subtitle, count }: { title: string; subtitle: string; count: string }) {
  return (
    <header className={page.cardHead}>
      <div>
        <h2 className={page.cardTitle}>{title}</h2>
        <p className={page.cardSub}>{subtitle}</p>
      </div>
      <span className={styles.count}>{count}</span>
    </header>
  );
}

export function ProfileCompanies({ userId, companies }: { userId: number; companies: ProfileCompany[] }) {
  return (
    <section className={page.card} aria-label="Companies">
      <SectionHead
        title="Companies"
        subtitle="The companies you are part of."
        count={`${companies.length} ${companies.length === 1 ? 'company' : 'companies'}`}
      />

      {companies.length === 0 ? (
        <p className={page.empty}>You are not part of any company yet.</p>
      ) : (
        <ul className={page.list}>
          {companies.map((c) => (
            <ProfileMembershipRow
              key={c.companyId}
              icon={<Building2 size={20} aria-hidden />}
              title={c.name}
              roleLabel={COMPANY_ROLE[c.role].label}
              roleClassName={COMPANY_ROLE[c.role].className}
              entity="company"
              details={[
                { label: 'Company', value: c.name },
                { label: 'Your role', value: COMPANY_ROLE[c.role].label },
              ]}
              editHref={c.canEdit ? `/user-panel/companies/${c.companyId}/edit` : null}
              leaveUrl={`/api/companies/${c.companyId}/members/${userId}`}
              leaveBlockedReason={c.leaveBlockedReason}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export function ProfileBrands({ userId, brands }: { userId: number; brands: ProfileBrand[] }) {
  return (
    <section className={page.card} aria-label="Brands">
      <SectionHead
        title="Brands"
        subtitle="The brands you have access to and your role in each."
        count={`${brands.length} ${brands.length === 1 ? 'brand' : 'brands'}`}
      />

      {brands.length === 0 ? (
        <p className={page.empty}>You do not have access to any brand yet.</p>
      ) : (
        <ul className={page.list}>
          {brands.map((b) => (
            <ProfileMembershipRow
              key={b.brandId}
              icon={<Tags size={20} aria-hidden />}
              title={b.name}
              subtitle={b.companyName}
              roleLabel={BRAND_ROLE[b.role].label}
              roleClassName={BRAND_ROLE[b.role].className}
              entity="brand"
              details={[
                { label: 'Brand', value: b.name },
                { label: 'Company', value: b.companyName },
                { label: 'Your role', value: BRAND_ROLE[b.role].label },
              ]}
              editHref={b.canEdit ? `/user-panel/brands/${b.brandId}/edit` : null}
              leaveUrl={`/api/brands/${b.brandId}/members/${userId}`}
              leaveBlockedReason={b.leaveBlockedReason}
            />
          ))}
        </ul>
      )}
    </section>
  );
}