import Image from 'next/image';
import Link from 'next/link';
import styles from '@/_styles/landingPage/LpHeader.module.css';
import headerLogo from '@/_assets/image/header_logo.svg';
import NotificationBell, { type NotificationItem } from '@/_components/userPanelComponents/utils_panel/NotificationBell';
import UserMenu from '@/_components/userPanelComponents/managen/UserMenu';
import { PanelHelp } from '@/_components/userPanelComponents/utils_panel/PanelHelp';

interface UheaderProps {
    user: { firstName: string; lastName: string; email: string };
    notifications: NotificationItem[];
    unreadCount: number;
}

// User panel header: same structure and styles as the landing and product headers
// (container 4% / 6% / 1140px, brand bar on top, 44px actions).
export default function Uheader({ user, notifications, unreadCount }: UheaderProps) {
    return (
        <header className={styles['lp-header']}>
            <div className={styles['lp-header__bar']} aria-hidden="true"></div>
            <div className={styles['lp-header__container']}>
                <Link className={styles['lp-header__brand']} href="/inicio" aria-label="Manual digital, ir para a página inicial">
                    <Image className={styles['lp-header__logo']} src={headerLogo} alt="Manual digital" width={150} height={25} />
                </Link>
                <div className={styles['lp-header__actions']}>
                    <NotificationBell notifications={notifications} unreadCount={unreadCount} />
                    {/* step-by-step guide of the panel (company → brand → product → publish) */}
                    <PanelHelp />
                    <UserMenu name={`${user.firstName} ${user.lastName}`} email={user.email} />
                </div>
            </div>
        </header>
    );
}
