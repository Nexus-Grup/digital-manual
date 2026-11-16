import type { CSSProperties } from "react";
import {
    siApple,
    siBosch,
    siIkea,
    siLenovo,
    siLg,
    siMotorola,
    siPanasonic,
    siSamsung,
    siSiemens,
    siToshiba,
    siXiaomi,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";
import styles from "@/_styles/landingPage/LogoMarquee.module.css";
import MarqueeViewport from "@/_components/landingPage/MarqueeViewport";

type BrandLogo = {
    icon: SimpleIcon;
    /** Tight bounding box of the icon path inside its 24x24 canvas: [x, y, width, height]. */
    box: [number, number, number, number];
};

type LogoStyle = CSSProperties & {
    "--logo-color": string;
};

// Official brand marks from Simple Icons (CC0). Boxes were measured with getBBox() so wordmarks
// are cropped instead of rendered as thin lines inside a square canvas.
const BRANDS: BrandLogo[] = [
    { icon: siBosch, box: [0, 0, 24, 24] },
    { icon: siSamsung, box: [0, 10.166, 24, 3.668] },
    { icon: siApple, box: [2.225, 0, 19.55, 24] },
    { icon: siLg, box: [0, 6.709, 24, 10.582] },
    { icon: siSiemens, box: [0, 10.016, 24, 3.968] },
    { icon: siPanasonic, box: [0, 10.161, 24, 3.678] },
    { icon: siIkea, box: [0, 7.2, 24, 9.6] },
    { icon: siXiaomi, box: [0, 0, 24, 24] },
    { icon: siMotorola, box: [0, 0, 24, 24] },
    { icon: siLenovo, box: [0, 7.997, 24, 8.006] },
    { icon: siToshiba, box: [0, 10.172, 24, 3.656] },
];

// Optical sizing: wide wordmarks get less height so all logos carry similar visual weight.
function logoHeight(ratio: number) {
    if (ratio >= 5) return 22;
    if (ratio >= 2.8) return 28;
    if (ratio >= 2) return 36;
    return 44;
}

function LogoList({ clone = false }: { clone?: boolean }) {
    return (
        <ul className={styles["logo-marquee__list"]} aria-hidden={clone || undefined}>
            {BRANDS.map(({ icon, box }) => {
                const [x, y, width, height] = box;
                const ratio = width / height;
                const svgHeight = logoHeight(ratio);
                const style: LogoStyle = { "--logo-color": `#${icon.hex}` };

                return (
                    <li className={styles["logo-marquee__item"]} key={icon.slug}>
                        <svg
                            className={styles["logo-marquee__logo"]}
                            style={style}
                            viewBox={`${x} ${y} ${width} ${height}`}
                            width={Math.round(svgHeight * ratio)}
                            height={svgHeight}
                            role={clone ? undefined : "img"}
                            aria-label={clone ? undefined : icon.title}
                            focusable="false"
                        >
                            <path d={icon.path} />
                        </svg>
                    </li>
                );
            })}
        </ul>
    );
}

// Infinite single-line logo marquee. The list is rendered twice and the track slides by -50% (CSS only);
// MarqueeViewport pauses it while it is off-screen.
export default function LogoMarquee() {
    return (
        <section className={styles["logo-marquee"]} aria-labelledby="logo-marquee-title">
            <div className={styles["logo-marquee__container"]}>
                <p className={styles["logo-marquee__title"]} id="logo-marquee-title">
                    O mercado que queremos transformar: grandes fabricantes de eletrônicos, eletrodomésticos e móveis
                </p>
                <MarqueeViewport>
                    <LogoList />
                    <LogoList clone />
                </MarqueeViewport>
            </div>
        </section>
    );
}
