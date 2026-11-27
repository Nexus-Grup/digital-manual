import styles from "@/_styles/landingPage/Problem.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import luccaPaper from "@/_assets/image/lucca/lucca-paper.png";
import { GlobeIcon, HandIcon, PaperIcon, ScaleIcon, SearchIcon, TreeIcon, TruckIcon } from "@/_components/landingPage/Icons";

const STATS = [
    {
        icon: <TreeIcon />,
        value: "4.741 t",
        label: "de papel por ano",
        text: "estimadas só em manuais básicos de quatro gigantes: Whirlpool, Electrolux, Samsung e Apple.",
    },
    {
        icon: <ScaleIcon />,
        value: "80 g",
        label: "por manual",
        text: "é o peso médio de um único manual de eletrodoméstico, multiplicado por milhões de caixas.",
    },
    {
        icon: <PaperIcon />,
        value: "13.152",
        label: "resmas de 500 folhas",
        text: "por ano em um único cenário de bens de consumo, com 1,6 milhão de manuais impressos.",
    },
];

const PAINS = [
    { icon: <SearchIcon />, text: "Letras miúdas e desenhos que confundem mais do que explicam." },
    { icon: <TruckIcon />, text: "Manual perdido, rasgado ou jogado fora junto com a caixa." },
    { icon: <HandIcon />, text: "Nenhum recurso para pessoas com deficiência visual, auditiva ou dificuldade de leitura." },
    { icon: <GlobeIcon />, text: "Um só idioma, sem vídeo e sem como ver a peça de outro ângulo." },
];

export default function Problem() {
    return (
        <section className={styles["problem"]} id="problema" aria-labelledby="problem-title">
            <div className={styles["problem__container"]}>
                <SectionHeading
                    id="problem-title"
                    lucca={luccaPaper}
                    eyebrow="O problema"
                    title="O custo invisível do papel na indústria."
                    text="O manual físico encarece a logística, gera lixo e, na maioria das vezes, acaba descartado ou esquecido. E quem precisa montar o produto continua sem ajuda."
                />
                <div className={styles["problem__grid"]}>
                    <div className={styles["problem__industry"]}>
                        <h3 className={styles["problem__subtitle"]}>Para a indústria</h3>
                        <ul className={styles["problem__stats"]}>
                            {STATS.map((stat) => (
                                <li className={styles["problem__stat"]} key={stat.value}>
                                    <span className={styles["problem__stat-icon"]}>{stat.icon}</span>
                                    <div className={styles["problem__stat-content"]}>
                                        <p className={styles["problem__stat-value"]}>
                                            {stat.value} <span className={styles["problem__stat-label"]}>{stat.label}</span>
                                        </p>
                                        <p className={styles["problem__stat-text"]}>{stat.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles["problem__users"]}>
                        <h3 className={styles["problem__subtitle"]}>Para quem monta</h3>
                        <ul className={styles["problem__pains"]}>
                            {PAINS.map((pain) => (
                                <li className={styles["problem__pain"]} key={pain.text}>
                                    <span className={styles["problem__pain-icon"]}>{pain.icon}</span>
                                    <p className={styles["problem__pain-text"]}>{pain.text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <p className={styles["problem__note"]}>
                    Estimativas ilustrativas do estudo do Time Nexus, com base em relatórios anuais de 2025 e na premissa
                    de papel 75 g/m² em formato A5. Não representam dados internos das empresas citadas.
                </p>
            </div>
        </section>
    );
}
