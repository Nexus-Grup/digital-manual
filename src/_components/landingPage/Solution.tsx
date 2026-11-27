import styles from "@/_styles/landingPage/Solution.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import luccaPlay from "@/_assets/image/lucca/lucca-play.png";
import SolutionDemo from "@/_components/landingPage/SolutionDemo";
import { ChecklistIcon, CubeIcon, PlayIcon, QrCodeIcon } from "@/_components/landingPage/Icons";

const FEATURES = [
    {
        icon: <CubeIcon />,
        title: "Visualização 3D em 360°",
        text: "Gire, aproxime e veja cada peça em vista explodida. Nada de adivinhar pelo desenho.",
    },
    {
        icon: <ChecklistIcon />,
        title: "Passo a passo inteligente",
        text: "Checklists interativos de montagem e informações detalhadas de cada peça, no seu ritmo.",
    },
    {
        icon: <PlayIcon />,
        title: "Central de vídeos",
        text: "Os melhores vídeos sobre o produto reunidos e organizados dentro do próprio manual.",
    },
    {
        icon: <QrCodeIcon />,
        title: "Acesso híbrido",
        text: "Aponte a câmera para o QR Code da caixa ou pesquise pelo modelo direto no site.",
    },
];

export default function Solution() {
    return (
        <section className={styles["solution"]} id="solucao" aria-labelledby="solution-title">
            <div className={styles["solution__container"]}>
                <SectionHeading
                    id="solution-title"
                    lucca={luccaPlay}
                    eyebrow="A solução"
                    title="Muito além de um PDF: uma experiência guiada."
                    text="O Manual digital transforma o livreto da caixa em um guia visual, interativo e sempre atualizado. Experimente ao lado: gire a peça e marque as etapas."
                />
                <div className={styles["solution__grid"]}>
                    <SolutionDemo />
                    <ul className={styles["solution__features"]}>
                        {FEATURES.map((feature) => (
                            <li className={styles["solution__card"]} key={feature.title}>
                                <span className={styles["solution__card-icon"]}>{feature.icon}</span>
                                <div className={styles["solution__card-content"]}>
                                    <h3 className={styles["solution__card-title"]}>{feature.title}</h3>
                                    <p className={styles["solution__card-text"]}>{feature.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
