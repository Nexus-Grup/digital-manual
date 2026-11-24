'use client';

import type { ReactNode } from 'react';
import { useVideos, type PanelTab } from '../VideosContext';

type Props = {
  tab: PanelTab;
  className: string;
  children: ReactNode;
};

/** Opens the side panel (videos / sound) from the home page, like the side tabs do. */
export default function HomeMediaButton({ tab, className, children }: Props) {
  const { tab: current, toggleTab } = useVideos();

  return (
    <button
      type="button"
      className={className}
      aria-expanded={current === tab}
      aria-controls="video-panel"
      onClick={() => toggleTab(tab)}
    >
      {children}
    </button>
  );
}
