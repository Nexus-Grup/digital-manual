'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import styles from '@/_styles/cssProductPage/VideoShell.module.css';
import { useVideos, type PanelTab } from './VideosContext';
import SoundPanel from './SoundPanel';
import { CameraIcon, WaveIcon } from './TabIcons';

export type VideoItem = { url: string; title: string };

type Props = {
  videos: VideoItem[];
  /** URL do áudio da "Experiência sonora" (null/undefined = sem aba de som) */
  audioUrl?: string | null;
  /** nome do produto, mostrado abaixo de "Experiência sonora" */
  productName?: string;
  children: ReactNode;
};

const MOBILE_QUERY = '(max-width: 640px)';

function subscribe(cb: () => void) {
  const m = window.matchMedia(MOBILE_QUERY);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

// Aceita youtube.com/watch?v=, youtu.be/, /shorts/ e /embed/
function getYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null;
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const match = u.pathname.match(/\/(shorts|embed)\/([^/?]+)/);
    return match ? match[2] : null;
  } catch {
    return null;
  }
}

// Clicks on these don't count as "outside": panel triggers (side tabs and hub buttons, which already
// toggle the panel) and the VLibras avatar, which lives in <body> outside the panel.
const OUTSIDE_IGNORE = '[aria-controls="video-panel"], #vlibras-app-root';

const thumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40%" height="40%" fill="#fff" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function VideoShell({ videos, audioUrl, productName, children }: Props) {
  const { tab, open, close, toggleTab } = useVideos();
  const isMobile = useIsMobile();
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const panelWrapRef = useRef<HTMLDivElement>(null);

  const hasVideo = videos.length > 0;
  const hasAudio = Boolean(audioUrl);

  // Guarda a última aba aberta: durante a animação de fechar o painel
  // continua mostrando o conteúdo certo em vez de piscar.
  const [shown, setShown] = useState<PanelTab>('video');
  if (tab && tab !== shown) setShown(tab);

  // Ao sair da aba de vídeos, para o vídeo (ajuste de estado durante o render)
  const videoActive = tab === 'video';
  const [prevVideoActive, setPrevVideoActive] = useState(videoActive);
  if (prevVideoActive !== videoActive) {
    setPrevVideoActive(videoActive);
    if (!videoActive) setPlaying(false);
  }

  // Só no mobile (sheet): ESC fecha e trava o scroll da página
  useEffect(() => {
    if (!isMobile || !open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isMobile, open, close]);

  // While open: a click outside the panel closes it (on mobile the backdrop already covers the page).
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target || panelWrapRef.current?.contains(target)) return;
      if (target.closest(OUTSIDE_IGNORE)) return;
      close();
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open, close]);

  if (!hasVideo && !hasAudio) return <>{children}</>;

  const main = videos[current] ?? videos[0];
  const mainId = main ? getYoutubeId(main.url) : null;

  const select = (index: number) => {
    setCurrent(index);
    setPlaying(true);
  };

  const panelTitle = shown === 'sound' ? 'Som' : 'Vídeos';

  return (
    <div className={styles.shell} data-open={open} data-tab={shown}>
      {/* fundo escuro (só aparece no mobile) */}
      <div className={styles.backdrop} onClick={close} aria-hidden="true" />

      <div className={styles.panelWrap} ref={panelWrapRef}>
        <div className={styles.clip}>
          <aside
            id="video-panel"
            className={styles.panel}
            aria-label={panelTitle}
            inert={!open}
          >
            <header className={styles.header}>
              <span className={styles.headerIcon}>
                {shown === 'sound' ? <WaveIcon /> : <CameraIcon />}
              </span>
              <h2 className={styles.heading}>{panelTitle}</h2>
              <button
                type="button"
                className={styles.close}
                aria-label={`Fechar ${panelTitle.toLowerCase()}`}
                onClick={close}
              >
                ✕
              </button>
            </header>

            {/* ===== ABA VÍDEOS ===== */}
            {hasVideo && (
              <div className={`${styles.body} ${shown !== 'video' ? styles.paneHidden : ''}`}>
                <div className={styles.player}>
                  {playing && mainId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${mainId}?autoplay=1&rel=0`}
                      title={main.title}
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      type="button"
                      className={styles.playerCover}
                      onClick={() => setPlaying(true)}
                      aria-label={`Reproduzir: ${main.title}`}
                    >
                      {mainId && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb(mainId)} alt="" />
                      )}
                      <span className={styles.playBtn}><PlayIcon /></span>
                    </button>
                  )}
                </div>

                <h3 className={styles.mainTitle}>{main.title}</h3>

                <p className={styles.label}>
                  <span className={styles.labelDesktop}>TODOS OS VÍDEOS</span>
                  <span className={styles.labelMobile}>MAIS VÍDEOS</span>
                </p>

                <ul className={styles.list}>
                  {videos.map((v, i) => {
                    const id = getYoutubeId(v.url);
                    const active = i === current;
                    return (
                      <li key={i} className={active ? styles.liActive : undefined}>
                        <button
                          type="button"
                          className={`${styles.item} ${active ? styles.itemActive : ''}`}
                          aria-current={active ? 'true' : undefined}
                          onClick={() => select(i)}
                        >
                          <span className={styles.itemThumb}>
                            {id && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={thumb(id)} alt="" />
                            )}
                            <span className={styles.playBtnSmall}><PlayIcon /></span>
                          </span>
                          <span className={styles.itemTitle}>{v.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* ===== ABA SOM ===== */}
            {hasAudio && (
              <div className={shown !== 'sound' ? styles.paneHidden : undefined}>
                <SoundPanel
                  src={audioUrl as string}
                  productName={productName}
                  active={tab === 'sound'}
                />
              </div>
            )}
          </aside>
        </div>

        {/* abas na borda do painel (só no PC) */}
        <div className={styles.tabs} role="group" aria-label="Painel lateral">
          {hasVideo && (
            <button
              type="button"
              className={styles.tab}
              data-active={tab === 'video'}
              onClick={() => toggleTab('video')}
              aria-expanded={tab === 'video'}
              aria-controls="video-panel"
              aria-label={tab === 'video' ? 'Recolher vídeos' : 'Abrir vídeos'}
            >
              <CameraIcon />
            </button>
          )}
          {hasAudio && (
            <button
              type="button"
              className={styles.tab}
              data-active={tab === 'sound'}
              onClick={() => toggleTab('sound')}
              aria-expanded={tab === 'sound'}
              aria-controls="video-panel"
              aria-label={tab === 'sound' ? 'Recolher som' : 'Abrir som'}
            >
              <WaveIcon />
            </button>
          )}
        </div>
      </div>

      <div className={styles.content}>{children}</div>
    </div>
  );
}