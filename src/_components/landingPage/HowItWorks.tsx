import styles from "@/_styles/landingPage/HowItWorks.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import { RocketIcon, SparkleIcon, UploadIcon } from "@/_components/landingPage/Icons";

// Shared SVG gradient for the step icons (defined once in the hidden <svg> below).
const ICON_GRADIENT_ID = "how-it-works-icon-gradient";
const ICON_GRADIENT = `url(#${ICON_GRADIENT_ID})`;

const STEPS = [
    {
        icon: <UploadIcon size={26} stroke={ICON_GRADIENT} />,
        title: "Envio",
        text: "Sua empresa envia o manual atual e os arquivos técnicos e 3D do produto.",
    },
    {
        icon: <SparkleIcon size={26} stroke={ICON_GRADIENT} />,
        title: "Transformação",
        text: "A plataforma converte o material em um manual 3D interativo, acessível e com vídeos integrados.",
    },
    {
        icon: <RocketIcon size={26} stroke={ICON_GRADIENT} />,
        title: "Publicação",
        text: "Geramos o QR Code exclusivo para a embalagem e indexamos o manual no buscador público.",
    },
];

export default function HowItWorks() {
    return (
        <section className={styles["how-it-works"]} id="como-funciona" aria-labelledby="how-it-works-title">
            <svg className={styles["how-it-works__defs"]} aria-hidden="true" focusable="false">
                <defs>
                    <linearGradient id={ICON_GRADIENT_ID} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" className={styles["how-it-works__stop--start"]} />
                        <stop offset="100%" className={styles["how-it-works__stop--end"]} />
                    </linearGradient>
                </defs>
            </svg>
            <div className={styles["how-it-works__container"]}>
                <SectionHeading
                    id="how-it-works-title"
                    eyebrow="Como funciona"
                    title="Do papel ao QR Code em três passos."
                    text="Implementação simples e rápida, sem mudar a linha de produção."
                    centered
                />
                <ol className={styles["how-it-works__list"]}>
                    {STEPS.map((step, index) => (
                        <li className={styles["how-it-works__step"]} key={step.title}>
                            <div className={styles["how-it-works__step-header"]}>
                                <span className={styles["how-it-works__number"]}>{index + 1}</span>
                                <span className={styles["how-it-works__icon"]}>{step.icon}</span>
                            </div>
                            <h3 className={styles["how-it-works__title"]}>{step.title}</h3>
                            <p className={styles["how-it-works__text"]}>{step.text}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}
