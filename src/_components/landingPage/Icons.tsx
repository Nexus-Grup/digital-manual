import type { ReactNode, SVGProps } from "react";

// Small inline SVG icon set (24x24, stroke based) used across the landing page.
// Inline icons avoid loading an icon font and keep the page fast.

type IconProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

function createIcon(paths: ReactNode) {
    return function Icon({ size = 24, ...props }: IconProps) {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
                {...props}
            >
                {paths}
            </svg>
        );
    };
}

export const SearchIcon = createIcon(
    <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </>,
);

export const ArrowRightIcon = createIcon(<path d="M5 12h14M13 6l6 6-6 6" />);

export const CheckIcon = createIcon(<path d="M5 12.5l4.5 4.5L19 7.5" />);

export const QrCodeIcon = createIcon(
    <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3" />
    </>,
);

export const CubeIcon = createIcon(
    <>
        <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7z" />
        <path d="M3.5 7 12 11.5 20.5 7M12 11.5v10" />
    </>,
);

export const ChecklistIcon = createIcon(
    <>
        <path d="m3 6 1.5 1.5L7.5 4.5M3 13l1.5 1.5 3-3" />
        <path d="M11 6h10M11 13h10M11 20h10M4 20h.01" />
    </>,
);

export const PlayIcon = createIcon(
    <>
        <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
        <path d="m10 9 5 3-5 3z" />
    </>,
);

export const DevicesIcon = createIcon(
    <>
        <rect x="7" y="2.5" width="10" height="19" rx="2" />
        <path d="M11 18h2" />
    </>,
);

export const HandIcon = createIcon(
    <>
        <path d="M18 11V6a2 2 0 0 0-4 0v5" />
        <path d="M14 10V4a2 2 0 0 0-4 0v6" />
        <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L6 15" />
    </>,
);

export const VolumeIcon = createIcon(
    <>
        <path d="M11 5 6 9H2v6h4l5 4z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
    </>,
);

export const ContrastIcon = createIcon(
    <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
    </>,
);

export const GlobeIcon = createIcon(
    <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>,
);

export const LeafIcon = createIcon(
    <>
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z" />
        <path d="M2 21c0-3 1.9-5.4 5.2-6.1C9.6 14.4 12 13 13 12" />
    </>,
);

export const TreeIcon = createIcon(
    <>
        <path d="M12 22v-6" />
        <path d="M12 2 5 12h4l-3 4h12l-3-4h4z" />
    </>,
);

export const DropletIcon = createIcon(<path d="M12 2.5S5.5 9.5 5.5 14a6.5 6.5 0 0 0 13 0c0-4.5-6.5-11.5-6.5-11.5Z" />);

export const BoltIcon = createIcon(<path d="M13 2 4 14h7l-1 8 9-12h-7z" />);

export const TruckIcon = createIcon(
    <>
        <path d="M2 6h11v10H2zM13 9h4.5l3.5 3.5V16h-8" />
        <circle cx="6.5" cy="17.5" r="2" />
        <circle cx="17" cy="17.5" r="2" />
    </>,
);

export const CoinsIcon = createIcon(
    <>
        <ellipse cx="9" cy="7" rx="6" ry="3" />
        <path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7" />
        <path d="M9 18c0 1.7 2.7 3 6 3s6-1.3 6-3v-5c0-1.4-1.8-2.5-4.3-2.9" />
    </>,
);

export const ChartIcon = createIcon(
    <>
        <path d="M3 3v18h18" />
        <path d="m7 15 4-4 3 3 6-6" />
    </>,
);

export const RefreshIcon = createIcon(
    <>
        <path d="M20 11a8 8 0 0 0-14.6-4.5L3 9" />
        <path d="M3 4v5h5M4 13a8 8 0 0 0 14.6 4.5L21 15" />
        <path d="M21 20v-5h-5" />
    </>,
);

export const HeadsetIcon = createIcon(
    <>
        <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
        <path d="M3 14h3v6H4.5A1.5 1.5 0 0 1 3 18.5zM21 14h-3v6h1.5a1.5 1.5 0 0 0 1.5-1.5z" />
    </>,
);

export const UploadIcon = createIcon(
    <>
        <path d="M12 15V3M7 8l5-5 5 5" />
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    </>,
);

export const SparkleIcon = createIcon(
    <>
        <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
        <path d="M19 15v4M17 17h4" />
    </>,
);

export const RocketIcon = createIcon(
    <>
        <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1Z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2Z" />
        <path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" />
    </>,
);

export const TargetIcon = createIcon(
    <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
    </>,
);

export const EyeIcon = createIcon(
    <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
    </>,
);

export const FlagIcon = createIcon(
    <>
        <path d="M4 22V4" />
        <path d="M4 4h13l-2 4 2 4H4" />
    </>,
);

export const FridgeIcon = createIcon(
    <>
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M5 10h14M9 5v2M9 13v3" />
    </>,
);

export const SofaIcon = createIcon(
    <>
        <path d="M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" />
        <path d="M3 11a2 2 0 0 1 2 2v1h14v-1a2 2 0 1 1 2 2v3H3v-3a2 2 0 0 1 0-4Z" />
        <path d="M5 18v2M19 18v2" />
    </>,
);

export const WrenchIcon = createIcon(
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z" />,
);

export const PaperIcon = createIcon(
    <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
    </>,
);

export const ScaleIcon = createIcon(
    <>
        <path d="M12 3v18M7 21h10M5 7h14" />
        <path d="m5 7-3 7a3.5 3.5 0 0 0 6 0zM19 7l-3 7a3.5 3.5 0 0 0 6 0z" />
    </>,
);
