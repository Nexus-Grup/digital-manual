'use client'
import styles from '@/_styles/cssProductPage/Pheader.module.css'
import headerLogo from '@/_assets/image/header_logo.svg';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import ContrastToggle from '@/_components/productComponents/ContrastToggle';
import SiteMenu from '@/_components/productComponents/SiteMenu';

export default function Pheader() {
    const router = useRouter();
    return (
        <header className={styles.container}>
            <div className={styles.o_minimal_header__supergraphic}></div>
            <div className={styles.container__menu}>
                <Image src={headerLogo} alt="logo" className={styles.header_logo} onClick={() => router.push('/products')}/>
                <div className={styles.container__actions}>
                    <ContrastToggle />
                    {/* botão de idioma entra aqui depois */}
                    <SiteMenu />
                </div>
            </div>
        </header>
    )
}