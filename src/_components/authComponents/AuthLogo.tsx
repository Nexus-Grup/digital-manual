import Image from 'next/image';
import styles from '@/_styles/cssAuthPage/Auth.module.css';
// Ajuste para o caminho real do mascote Lucca
import Lucca from '@/_assets/image/lucca.svg';

export default function AuthLogo() {
  return (
    <div className={styles.logo}>
      <Image src={Lucca} alt="" width={286} priority />
      {/* <span className={styles.logoText}>Manual digital</span> */}
    </div>
  );
}