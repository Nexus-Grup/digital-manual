'use client'
import styles from '@/_styles/cssUserPanelPage/Uheader.module.css'
import headerLogo from '@/_assets/image/header_logo.svg';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import ContrastToggle from '@/_components/productComponents/ContrastToggle';
import NotificationBell, { type NotificationItem } from './NotificationBell';
import UserMenu from './UserMenu';

interface UheaderProps {
    user: { firstName: string; lastName: string; email: string };
    notifications: NotificationItem[];
    unreadCount: number;
}

export default function Uheader({ user, notifications, unreadCount }: UheaderProps) {
    const router = useRouter();
    return (
        <header className={styles.container}>
            <div className={styles.o_minimal_header__supergraphic}></div>
            <div className={styles.container__menu}>
                <Image src={headerLogo} alt="logo" className={styles.header_logo} onClick={() => router.push('/landing-page')}/>
                <div className={styles.container__actions}>
                    
                    {/* botão de idioma entra aqui depois */}
                    <NotificationBell notifications={notifications} unreadCount={unreadCount} />
                    {/* <ContrastToggle /> */}
                    <UserMenu name={`${user.firstName} ${user.lastName}`} email={user.email} />
                </div>
            </div>
        </header>
    )
}