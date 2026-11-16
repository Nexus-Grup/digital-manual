import styles from "@/_styles/landingPage/Business.module.css";
import buttonStyles from "@/_styles/landingPage/MaterialButton.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import { ArrowRightIcon, ChartIcon, CoinsIcon, HeadsetIcon, RefreshIcon } from "@/_components/landingPage/Icons";

const BENEFITS = [
    {
        icon: <CoinsIcon />,
        title: "Redução de custos",
        text: "Corte direto em impressão, papel, armazenagem e peso no frete de cada unidade vendida.",
    },
    {
        icon: <ChartIcon />,
        title: "Metas ESG reais",
        text: "Relatórios de impacto com toneladas de papel e CO₂ economizados, prontos para o balanço corporativo.",
    },
    {
        icon: <RefreshIcon />,
        title: "Atualização em tempo real",
        text: "Corrija instruções ou inclua melhorias na hora, sem reimprimir lotes inteiros.",
    },
    {
        icon: <HeadsetIcon />,
        title: "Menos chamados no SAC",
        text: "Montagens mais claras reduzem devoluções, avaliações negativas e dúvidas no suporte.",
    },
];

export default function Business() {
    return (
        <section className={styles["business"]} id="empresas" aria-labelledby="business-title">
            <div className={styles["business__container"]}>
                <SectionHeading
                    id="business-title"
                    eyebrow="Para empresas"
                    title="Por que marcas inovadoras escolhem o Manual digital?"
                    text="Uma plataforma SaaS de pós-venda que transforma custo gráfico e passivo ambiental em economia, indicadores ESG e clientes mais satisfeitos."
                />
                <ul className={styles["business__list"]}>
                    {BENEFITS.map((benefit) => (
                        <li className={styles["business__card"]} key={benefit.title}>
                            <span className={styles["business__card-icon"]}>{benefit.icon}</span>
                            <div className={styles["business__card-content"]}>
                                <h3 className={styles["business__card-title"]}>{benefit.title}</h3>
                                <p className={styles["business__card-text"]}>{benefit.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className={styles["business__cta"]}>
                    <p className={styles["business__cta-text"]}>
                        Descubra quanto a sua operação pode economizar com a calculadora de impacto.
                    </p>
                    <div className={styles["business__cta-actions"]}>
                        <md-filled-button className={buttonStyles["md-button--trailing-icon"]} href="#contato" trailing-icon="">
                            Falar com especialista
                            <ArrowRightIcon slot="icon" size={18} />
                        </md-filled-button>
                        <md-outlined-button className={buttonStyles["md-button"]} href="#calculadora">
                            Calcular impacto
                        </md-outlined-button>
                    </div>
                </div>
            </div>
        </section>
    );
}
