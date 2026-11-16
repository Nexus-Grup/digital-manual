'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/_styles/cssProductPage/SoundPanel.module.css';

type Props = {
  src: string;
  productName?: string;
  /** true quando a aba Som está aberta; ao fechar, o áudio pausa e volta ao início */
  active: boolean;
};

type Status = 'loading' | 'ready' | 'error';

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, '0')}`;
};

const icon = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export default function SoundPanel({ src, productName, active }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.02);

  // abre a aba -> toca; fecha -> pausa e volta ao início
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (active) {
      a.play().catch(() => {});
    } else {
      a.pause();
      a.currentTime = 0;
    }
  }, [active]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a || status !== 'ready') return;
    if (a.paused) {
      if (a.ended) a.currentTime = 0;
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  };

  const restart = () => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  };

  const retry = () => {
    const a = audioRef.current;
    if (!a) return;
    setStatus('loading');
    a.load();
    if (active) a.play().catch(() => {});
  };

  const statusText =
    status === 'loading'
      ? 'Carregando áudio...'
      : status === 'error'
        ? 'Não foi possível carregar o áudio.'
        : `${fmt(time)} / ${fmt(duration)}`;

  return (
    <div className={styles.root} data-status={status} data-playing={playing}>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onCanPlay={() => setStatus('ready')}
        onError={() => setStatus('error')}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      <div className={styles.stage}>
        <div className={styles.rings} aria-hidden="true">
          <span className={styles.ring} />
          <span className={styles.ring} />
          <span className={styles.ring} />
          <span className={styles.ring} />
        </div>

        <button
          type="button"
          className={styles.main}
          onClick={toggle}
          disabled={status !== 'ready'}
          aria-label={playing ? 'Pausar' : 'Reproduzir'}
        >
          {status === 'loading' && (
            <svg {...icon} className={styles.spinner}>
              <path d="M21 12a9 9 0 1 1-6.2-8.55" />
            </svg>
          )}
          {status === 'error' && (
            <svg {...icon}>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7.5v5.5M12 16.5h.01" />
            </svg>
          )}
          {status === 'ready' &&
            (playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            ))}
        </button>
      </div>

      <h3 className={styles.title}>Experiência sonora</h3>
      {productName && <p className={styles.product}>{productName}</p>}
      <p className={styles.status} role="status">
        {statusText}
      </p>

      {status === 'error' ? (
        <button type="button" className={styles.retry} onClick={retry}>
          <svg {...icon} width="16" height="16">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
          Tentar novamente
        </button>
      ) : (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.restart}
            onClick={restart}
            disabled={status !== 'ready'}
            aria-label="Reiniciar áudio"
          >
            <svg {...icon} width="18" height="18">
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
            </svg>
          </button>

          <svg {...icon} width="20" height="20" className={styles.volIcon}>
            <path d="M11 5L6 9H3v6h3l5 4z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>

          <input
            type="range"
            className={styles.volume}
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ '--v': `${volume * 100}%` } as React.CSSProperties}
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
}