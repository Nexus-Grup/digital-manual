'use client';

import styles from '@/_styles/cssProductPage/Manual.module.css';
import { useVideos, type PanelTab } from './VideosContext';
import { CameraIcon, WaveIcon } from './TabIcons';

const ITEMS: { tab: PanelTab; label: string; Icon: typeof CameraIcon }[] = [
  { tab: 'video', label: 'Vídeos', Icon: CameraIcon },
  { tab: 'sound', label: 'Som', Icon: WaveIcon },
];

/**
 * Mobile-only, in-flow video/sound buttons for pages that start with text (manual):
 * same panel as the floating side tabs, without covering the title.
 */
export default function MediaButtons() {
  const { tab, toggleTab, available } = useVideos();
  const items = ITEMS.filter((item) => available[item.tab]);
  if (items.length === 0) return null;

  return (
    <>
      {items.map(({ tab: key, label, Icon }) => (
        <button
          key={key}
          type="button"
          className={`${styles['manual__pdf']} ${styles['manual__media']}`}
          data-active={tab === key}
          aria-expanded={tab === key}
          aria-controls="video-panel"
          onClick={() => toggleTab(key)}
        >
          <Icon size={20} />
          {label}
        </button>
      ))}
    </>
  );
}
