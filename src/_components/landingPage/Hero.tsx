import Image from "next/image";
import styles from "@/_styles/landingPage/Hero.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import mascot from "@/_assets/image/lucca/lucca-qrcode.png";
import HeroSearch from "@/_components/landingPage/HeroSearch";
import { ArrowRightIcon, CubeIcon, HandIcon, LeafIcon, QrCodeIcon } from "@/_components/landingPage/Icons";

const HIGHLIGHTS = [
    { icon: <QrCodeIcon size={20} />, label: "QR Code na embalagem" },
    { icon: <CubeIcon size={20} />, label: "Visualização 3D em 360°" },
    { icon: <HandIcon size={20} />, label: "Libras e leitura em voz alta" },
];

const SEARCH_LABELS = {
    label: "Já tem um produto? Encontre o manual agora",
    placeholder: "Nome, modelo ou código do produto",
    aria: "Buscar manual por nome, modelo ou código do produto",
    button: "Buscar manual",
};

export default function Hero() {
    return (
        <section className={styles["hero"]} id="inicio" aria-labelledby="hero-title">
            <div className={styles["hero__container"]}>
                <div className={styles["hero__content"]}>
                    <p className={styles["hero__tag"]}>
                        <LeafIcon size={18} />
                        O manual do futuro
                    </p>
                    <div className={styles["hero__heading"]}>
                        <h1 className={styles["hero__title"]} id="hero-title">
                            Diga adeus aos manuais de papel confusos. Bem-vindo à era do{" "}
                            <span className={styles["hero__title-highlight"]}>Manual Digital</span>.
                        </h1>
                        <p className={styles["hero__text"]}>
                            Transformamos instruções estáticas em experiências interativas em 360°, 100% acessíveis e
                            sustentáveis, direto do QR Code da caixa para a palma da sua mão.
                        </p>
                    </div>
                    <HeroSearch pulse t={SEARCH_LABELS} />
                    <div className={styles["hero__b2b"]}>
                        <p className={styles["hero__b2b-text"]}>É fabricante ou marca?</p>
                        <md-outlined-button
                            suppressHydrationWarning
                            className={`${buttonStyles["md-button--trailing-icon"]} ${styles["hero__b2b-button"]}`}
                            href="#contato"
                            trailing-icon=""
                        >
                            Digitalizar os manuais da minha empresa
                            <ArrowRightIcon slot="icon" size={18} />
                        </md-outlined-button>
                    </div>
                    <ul className={styles["hero__highlights"]}>
                        {HIGHLIGHTS.map((highlight) => (
                            <li className={styles["hero__highlight"]} key={highlight.label}>
                                <span className={styles["hero__highlight-icon"]}>{highlight.icon}</span>
                                {highlight.label}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles["hero__visual"]}>
                    <div className={styles["hero__blob"]} aria-hidden="true"></div>
                    <Image
                        className={styles["hero__mascot"]}
                        src={mascot}
                        alt="Lucca, a coruja guia do Manual digital, escaneando com o celular o QR Code de um manual"
                        sizes="(min-width: 1200px) 400px, (min-width: 768px) 340px, 260px"
                        loading="eager"
                        fetchPriority="high"
                    />
                    <p className={`${styles["hero__badge"]} ${styles["hero__badge--top"]}`}>
                        <CubeIcon size={18} />
                        3D 360°
                    </p>
                    <p className={`${styles["hero__badge"]} ${styles["hero__badge--bottom"]}`}>
                        <span className={styles["hero__badge-icon--eco"]}>
                            <LeafIcon size={18} />
                        </span>
                        Zero papel desnecessário
                    </p>
                </div>
            </div>
        </section>
    );
}
