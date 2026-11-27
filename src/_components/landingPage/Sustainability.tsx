import Image from "next/image";
import styles from "@/_styles/landingPage/Sustainability.module.css";
import mascot from "@/_assets/image/lucca/lucca-celebrate.png";
import luccaPlant from "@/_assets/image/lucca/lucca-plant.png";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import { BoltIcon, DropletIcon, TreeIcon, TruckIcon } from "@/_components/landingPage/Icons";

const RESOURCES = [
    {
        icon: <TreeIcon />,
        title: "Menos árvores derrubadas",
        text: "Manuais que não são impressos deixam de consumir celulose nova.",
    },
    {
        icon: <DropletIcon />,
        title: "Menos água",
        text: "A fabricação de papel é uma das indústrias que mais consomem água.",
    },
    {
        icon: <BoltIcon />,
        title: "Menos energia",
        text: "Sem gráfica, refile e acabamento, sobra energia na cadeia produtiva.",
    },
    {
        icon: <TruckIcon />,
        title: "Menos carbono no frete",
        text: "Caixas mais leves e compactas reduzem peso e emissões logísticas.",
    },
];

export default function Sustainability() {
    return (
        <section className={styles["sustainability"]} id="sustentabilidade" aria-labelledby="sustainability-title">
            <div className={styles["sustainability__container"]}>
                <SectionHeading
                    id="sustainability-title"
                    lucca={luccaPlant}
                    eyebrow="Sustentabilidade"
                    title="Cada QR Code escaneado é papel que não vira lixo."
                    text="A informação continua na caixa, só que no lugar certo: no celular de quem vai montar, sempre atualizada e sem custo ambiental de impressão."
                />
                <ul className={styles["sustainability__list"]}>
                    {RESOURCES.map((resource) => (
                        <li className={styles["sustainability__item"]} key={resource.title}>
                            <span className={styles["sustainability__item-icon"]}>{resource.icon}</span>
                            <div className={styles["sustainability__item-content"]}>
                                <h3 className={styles["sustainability__item-title"]}>{resource.title}</h3>
                                <p className={styles["sustainability__item-text"]}>{resource.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className={styles["sustainability__transition"]}>
                    <Image
                        className={styles["sustainability__mascot"]}
                        src={mascot}
                        alt=""
                        sizes="120px"
                    />
                    <div className={styles["sustainability__transition-content"]}>
                        <h3 className={styles["sustainability__transition-title"]}>Transição responsável</h3>
                        <p className={styles["sustainability__transition-text"]}>
                            Não queremos deixar ninguém sem instrução. Reduzimos o papel com inteligência e mantemos a
                            versão impressa para quem ainda não tem acesso fácil à internet ou a um smartphone.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
