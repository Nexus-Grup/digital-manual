import styles from "@/_styles/landingPage/Brand.module.css";
import SectionHeading from "@/_components/landingPage/SectionHeading";
import luccaBook from "@/_assets/image/lucca/lucca-book.png";
import { EyeIcon, FlagIcon, TargetIcon } from "@/_components/landingPage/Icons";

const VALUES = [
    {
        title: "Acessibilidade radical",
        text: "Instruir é incluir: Libras, leitura de tela, alto contraste, Dark e White Mode e vários idiomas.",
    },
    {
        title: "Sustentabilidade mensurável",
        text: "Cada QR Code escaneado poupa árvores, água, energia e emissões na cadeia gráfica.",
    },
    {
        title: "Inovação centrada no usuário",
        text: "3D em 360°, vista explodida, checklists passo a passo e curadoria de vídeos.",
    },
    {
        title: "Eficiência e parceria B2B",
        text: "Menos custo de impressão, armazenagem e frete, com indicadores ESG mais fortes.",
    },
    {
        title: "Transição responsável",
        text: "Reduzimos o papel com inteligência, sem excluir quem ainda precisa do suporte impresso.",
    },
];

const POSITIONING = [
    {
        audience: "Para fabricantes e indústrias",
        text: "Não somos um repositório de PDFs. Somos uma plataforma SaaS de pós-venda inteligente, que transforma custos gráficos e passivos ambientais em metas ESG atingidas, menos chamados no SAC e encantamento no unboxing.",
    },
    {
        audience: "Para quem compra e monta",
        text: "O fim da frustração com manuais confusos. Um guia visual, interativo, em 3D e adaptado às suas necessidades, na palma da mão pelo QR Code ou no navegador.",
    },
];

export default function Brand() {
    return (
        <section className={styles["brand"]} id="sobre" aria-labelledby="brand-title">
            <div className={styles["brand__container"]}>
                <SectionHeading
                    id="brand-title"
                    lucca={luccaBook}
                    eyebrow="Quem somos"
                    title="Um novo jeito de entregar informação: para as pessoas e para o planeta."
                    text="O Manual digital nasce para substituir folhetos impressos, estáticos e confusos por uma experiência interativa, acessível e centrada em quem usa."
                />
                <div className={styles["brand__purpose"]}>
                    <article className={`${styles["brand__card"]} ${styles["brand__card--mission"]}`}>
                        <span className={styles["brand__card-icon"]}>
                            <TargetIcon />
                        </span>
                        <h3 className={styles["brand__card-title"]}>Missão</h3>
                        <p className={styles["brand__card-text"]}>
                            Transformar a experiência de pós-compra e montagem de produtos com manuais digitais
                            interativos, intuitivos e 100% acessíveis, reduzindo drasticamente o desperdício de papel e
                            os custos operacionais das indústrias.
                        </p>
                    </article>
                    <article className={`${styles["brand__card"]} ${styles["brand__card--vision"]}`}>
                        <span className={styles["brand__card-icon"]}>
                            <EyeIcon />
                        </span>
                        <h3 className={styles["brand__card-title"]}>Visão</h3>
                        <p className={styles["brand__card-text"]}>
                            Ser o padrão global de documentação técnica digital e pós-venda interativo, liderando a
                            transição de bens de consumo, eletrodomésticos e mobiliário rumo ao fim do papel
                            desnecessário e à inclusão digital universal.
                        </p>
                    </article>
                </div>
                <div className={styles["brand__values"]}>
                    <h3 className={styles["brand__subtitle"]}>Nossos valores</h3>
                    <ol className={styles["brand__values-list"]}>
                        {VALUES.map((value, index) => (
                            <li className={styles["brand__value"]} key={value.title}>
                                <span className={styles["brand__value-number"]} aria-hidden="true">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <h4 className={styles["brand__value-title"]}>{value.title}</h4>
                                <p className={styles["brand__value-text"]}>{value.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
                <md-divider></md-divider>
                <div className={styles["brand__bottom"]}>
                    <article className={styles["brand__legacy"]}>
                        <span className={styles["brand__legacy-icon"]}>
                            <FlagIcon />
                        </span>
                        <h3 className={styles["brand__subtitle"]}>Nosso legado</h3>
                        <p className={styles["brand__legacy-text"]}>
                            Provar que pequenas mudanças na forma como entregamos informação em larga escala poupam
                            milhares de toneladas de recursos naturais por ano, enquanto democratizam o conhecimento
                            técnico para milhões de pessoas com deficiência.
                        </p>
                    </article>
                    <div className={styles["brand__positioning"]}>
                        <h3 className={styles["brand__subtitle"]}>Nosso posicionamento</h3>
                        <ul className={styles["brand__positioning-list"]}>
                            {POSITIONING.map((item) => (
                                <li className={styles["brand__positioning-item"]} key={item.audience}>
                                    <h4 className={styles["brand__positioning-audience"]}>{item.audience}</h4>
                                    <p className={styles["brand__positioning-text"]}>{item.text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
