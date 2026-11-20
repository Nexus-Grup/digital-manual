import page from '@/_styles/cssUserPanelPage/Profile.module.css';
import { PersonalInfoForm } from '@/_components/userPanelComponents/profile/PersonalInfoForm';
import { PasswordForm } from '@/_components/userPanelComponents/profile/PasswordForm';
import {
  ProfileBrands,
  ProfileCompanies,
  type ProfileBrand,
  type ProfileCompany,
} from '@/_components/userPanelComponents/profile/ProfileMemberships';

export type ProfileUser = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  /** ISO string (user.createdAt.toISOString()) */
  memberSince: string;
};

function formatMemberSince(iso: string) {
  const d = new Date(iso);
  const month = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
  return `${month} ${d.getUTCFullYear()}`;
}

export function ProfileView({
  user,
  companies,
  brands,
}: {
  user: ProfileUser;
  companies: ProfileCompany[];
  brands: ProfileBrand[];
}) {
  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className={page.page}>
      <section className={page.banner} aria-label="Profile summary">
        <div className={page.bannerCover} />
        <div className={page.bannerBody}>
          <div className={page.avatarBig} aria-hidden>{initials}</div>
          <div className={page.bannerText}>
            <h1 className={page.bannerName}>{user.firstName} {user.lastName}</h1>
            <p className={page.bannerEmail}>{user.email}</p>
            <p className={page.bannerMeta}>Member since {formatMemberSince(user.memberSince)}</p>
          </div>
        </div>
      </section>

      <PersonalInfoForm
        user={{
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          email: user.email,
        }}
      />
      <PasswordForm />
      <ProfileCompanies userId={user.id} companies={companies} />
      <ProfileBrands userId={user.id} brands={brands} />
    </div>
  );
}
