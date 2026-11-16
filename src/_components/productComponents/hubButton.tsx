'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/_styles/cssProductPage/PhubButon.module.css';
import { useVideos } from '@/_components/productComponents/VideosContext';
import { PlayCircleIcon, WaveIcon } from '@/_components/productComponents/TabIcons';
import IconHome from '@/_assets/image/hub icon/icone-inicio-black.svg';
import IconManual from '@/_assets/image/hub icon/icone-manual-black.svg';
import IconInformation from '@/_assets/image/hub icon/icone-informacao-black.svg';
import IconMontagem from '@/_assets/image/hub icon/icone-montagem-black.svg';

export default function HubButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { productId } = useParams<{ productId: string }>();
  const { tab, toggleTab, close } = useVideos();

  const base = `/products/${productId}`;

  const items = [
    { label: 'Início', href: base, icon: IconHome },
    { label: 'Manual', href: `${base}/manual`, icon: IconManual },
    { label: 'Informações', href: `${base}/information`, icon: IconInformation },
    { label: 'Montagem', href: `${base}/assembly`, icon: IconMontagem },
  ];

  const goTo = (href: string) => {
    // no mobile a sheet cobre a página: fecha ao navegar. No PC a barra lateral fica.
    if (window.matchMedia('(max-width: 640px)').matches) close();
    router.push(href);
  };

  return (
    <div className={styles.container}>
      <section className={styles.container__HUB_button}>
        {/* abas em cima do Hub: só no mobile */}
        <div className={styles.handles}>
          <button
            type="button"
            className={styles.handle}
            data-active={tab === 'video'}
            aria-label={tab === 'video' ? 'Fechar vídeos' : 'Abrir vídeos'}
            aria-expanded={tab === 'video'}
            aria-controls="video-panel"
            onClick={() => toggleTab('video')}
          >
            <PlayCircleIcon size={20} />
          </button>
          <button
            type="button"
            className={styles.handle}
            data-active={tab === 'sound'}
            aria-label={tab === 'sound' ? 'Fechar som' : 'Abrir som'}
            aria-expanded={tab === 'sound'}
            aria-controls="video-panel"
            onClick={() => toggleTab('sound')}
          >
            <WaveIcon size={20} />
          </button>
        </div>

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