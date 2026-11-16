'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type PanelTab = 'video' | 'sound';

type VideosCtx = {
  /** aba aberta no momento (null = painel fechado) */
  tab: PanelTab | null;
  /** atalho: painel aberto em qualquer aba */
  open: boolean;
  /** abre a aba; se ela já estiver aberta, fecha */
  toggleTab: (tab: PanelTab) => void;
  close: () => void;
};

const VideosContext = createContext<VideosCtx | null>(null);

export function VideosProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<PanelTab | null>(null);

  const toggleTab = useCallback(
    (next: PanelTab) => setTab((current) => (current === next ? null : next)),
    [],
  );
  const close = useCallback(() => setTab(null), []);

  const value = useMemo(
    () => ({ tab, open: tab !== null, toggleTab, close }),
    [tab, toggleTab, close],
  );

  return <VideosContext.Provider value={value}>{children}</VideosContext.Provider>;
}

export function useVideos() {
  const ctx = useContext(VideosContext);
  if (!ctx) throw new Error('useVideos deve ser usado dentro de <VideosProvider>');
  return ctx;
}