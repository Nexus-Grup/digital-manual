import styles from "@/_styles/landingPage/Accessibility.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import luccaHeadphones from "@/_assets/image/lucca/lucca-headphones.png";
import SnapCarousel from "@/_components/landingPage/SnapCarousel";
import { ContrastIcon, GlobeIcon, HandIcon, VolumeIcon } from "@/_components/landingPage/Icons";

const FEATURES = [
    {
        icon: <HandIcon />,
        title: "Tradução em Libras",
        text: "Integração nativa com o VLibras para a inclusão de pessoas surdas em todo o conteúdo do manual.",
    },
    {
        icon: <VolumeIcon />,
        title: "Leitura de tela e voz alta",
        text: "Navegação completa por voz e áudio para pessoas com baixa visão ou dificuldade de leitura.",
    },
    {
        icon: <ContrastIcon />,
        title: "Conforto visual",
        text: "Dark Mode, White Mode e Alto Contraste a um toque, com textos grandes e legíveis.",
    },
    {
        icon: <GlobeIcon />,
        title: "Tradução de idioma",
        text: "Conversão instantânea de idioma para atender consumidores e mercados do mundo todo.",
    },
];

export default function Accessibility() {
    return (
        <section className={styles["accessibility"]} id="acessibilidade" aria-labelledby="accessibility-title">
            <div className={styles["accessibility__container"]}>
                <div className={styles["accessibility__top"]}>
                    <SectionHeading
                        id="accessibility-title"
                        lucca={luccaHeadphones}
                        eyebrow="Acessibilidade 100%"
                        title="Tecnologia feita para todas as pessoas."
                        text="Nenhum consumidor deve ficar para trás por barreiras sensoriais, linguísticas ou cognitivas. Acessibilidade não é um extra: é o ponto de partida."
                        inverse
                    />
                    <blockquote className={styles["accessibility__quote"]}>
                        <p className={styles["accessibility__quote-text"]}>“Instruir é incluir.”</p>
                        <p className={styles["accessibility__quote-hint"]}>
                            Experimente agora: use os botões de contraste, idioma e Libras no topo da página.
                        </p>
                    </blockquote>
                </div>
                <SnapCarousel label="Recursos de acessibilidade" count={FEATURES.length} inverse>
                    <ul className={styles["accessibility__list"]}>
                        {FEATURES.map((feature) => (
                            <li className={styles["accessibility__card"]} key={feature.title}>
                                <span className={styles["accessibility__card-icon"]}>{feature.icon}</span>
                                <div className={styles["accessibility__card-content"]}>
                                    <h3 className={styles["accessibility__card-title"]}>{feature.title}</h3>
                                    <p className={styles["accessibility__card-text"]}>{feature.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </SnapCarousel>
            </div>
        </section>
    );
}
