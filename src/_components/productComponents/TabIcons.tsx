const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function CameraIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <rect x="2" y="6" width="13" height="12" rx="2" />
      <path d="M15 10l7-4v12l-7-4z" />
    </svg>
  );
}

export function WaveIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4" />
    </svg>
  );
}

export function PlayCircleIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l5 3.5-5 3.5z" />
    </svg>
  );
}

export function LightbulbIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1.1 1.3 1.1 2.2h5c0-.9.5-1.7 1.1-2.2A6 6 0 0 0 12 3z" />
    </svg>
  );
}

export function BoltIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M12 3l9.5 17h-19z" />
      <path d="M13 8.5l-3 5h4l-3 4" />
    </svg>
  );
}

export function GaugeIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M4.5 18a9 9 0 1 1 15 0" />
      <path d="M12 14l4-5" />
      <circle cx="12" cy="14" r="1.2" />
    </svg>
  );
}

export function ReverseIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M4 9h13l-3-3M20 15H7l3 3" />
    </svg>
  );
}

export function ChevronIcon({
  size = 22,
  direction = 'down',
}: {
  size?: number;
  direction?: 'up' | 'down';
}) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d={direction === 'up' ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} />
    </svg>
  );
}

export function ImageIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="M21 16l-5-5-9 9" />
    </svg>
  );
}

export function Rotate360Icon({ size = 56 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 40" width={size} height={(size * 40) / 64} {...base} strokeWidth={2.6}>
      <path d="M10 18c-4 2-6 4-6 6.5C4 30.8 16.5 36 32 36s28-5.2 28-11.5c0-2.5-2-4.5-6-6.5" />
      <path d="M36 32l-4 4 4 4" />
      <text
        x="31"
        y="24"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
      >
        360
      </text>
      <circle cx="53" cy="7" r="3" />
    </svg>
  );
}
export function SearchIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </svg>
  );
}

export function AlertIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M12 3l9.5 17h-19z" />
      <path d="M12 10v4.5M12 17.5v.01" />
    </svg>
  );
}

export function ExternalFileIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M9 14h6M9 17h4" />
    </svg>
  );
}

export function ListIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...base}>
      <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
    </svg>
  );
}
