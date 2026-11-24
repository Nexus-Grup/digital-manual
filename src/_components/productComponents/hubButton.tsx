'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/_styles/cssProductPage/PhubButon.module.css';
import { useVideos } from '@/_components/productComponents/VideosContext';
import IconHome from '@/_assets/image/hub icon/icone-inicio-black.svg';
import IconManual from '@/_assets/image/hub icon/icone-manual-black.svg';
import IconInformation from '@/_assets/image/hub icon/icone-informacao-black.svg';
import IconMontagem from '@/_assets/image/hub icon/icone-montagem-black.svg';

export default function HubButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { productId } = useParams<{ productId: string }>();
  const { close } = useVideos();

  const base = `/products/${productId}`;

  const items = [
    { label: 'Início', href: base, icon: IconHome },
    { label: 'Manual', href: `${base}/manual`, icon: IconManual },
    // manual and assembly side by side (same task: putting the product together), information last
    { label: 'Montagem', href: `${base}/assembly`, icon: IconMontagem },
    { label: 'Informações', href: `${base}/information`, icon: IconInformation },
  ];

  const goTo = (href: string) => {
    // no mobile a sheet cobre a página: fecha ao navegar. No PC a barra lateral fica.
    if (window.matchMedia('(max-width: 640px)').matches) close();
    router.push(href);
  };

  return (
    <div className={styles.container}>
      <section className={styles.container__HUB_button}>
        {items.map(({ label, href, icon }) => (
          <button
            key={label}
            type="button"
            className={styles.container__button}
            aria-label={label}
            aria-current={pathname === href ? 'page' : undefined}
            onClick={() => goTo(href)}
          >
            <Image src={icon} alt="" width={24} height={24} />
            <span className={styles.container__label}>{label}</span>
          </button>
        ))}
      </section>
    </div>
  );
}