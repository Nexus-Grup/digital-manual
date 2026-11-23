import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import styles from "@/_styles/cssProductPage/Manual.module.css";
import { getManual } from "@/_data/getManual";
import ManualViewer from "@/_components/productComponents/ManualViewer";
import { ExternalFileIcon } from "@/_components/productComponents/TabIcons";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export const metadata: Metadata = {
  title: "Manual do produto | Manual digital",
  description: "Manual digital acessível, com busca, sumário e ajuste do tamanho do texto.",
};

export default function ManualPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ManualContent params={params} />
    </Suspense>
  );
}

async function ManualContent({ params }: PageProps) {
  const { productId } = await params;
  const manual = await getManual(productId);
  // sem texto digitalizado, o PDF precisa existir
  if (!manual || (manual.sections.length === 0 && !manual.pdfUrl)) notFound();

  const updated = new Date(manual.updatedAt).toLocaleDateString("pt-BR", { timeZone: "UTC" });

  return (
    <section className={styles["manual"]}>
      <div className={styles["manual__container"]}>
        <header className={styles["manual__header"]}>
          <div className={styles["manual__heading"]}>
            <h1 className={styles["manual__title"]}>{manual.title}</h1>
            <p className={styles["manual__name"]}>{manual.productName}</p>
            <ul className={styles["manual__meta"]} aria-label="Sobre este documento">
              {manual.version && <li className={styles["manual__meta-item"]}>Versão {manual.version}</li>}
              {manual.language && <li className={styles["manual__meta-item"]}>{manual.language}</li>}
              <li className={styles["manual__meta-item"]}>
                Atualizado em{" "}
                <time dateTime={manual.updatedAt}>{updated}</time>
              </li>
            </ul>
          </div>

          {manual.pdfUrl && (
            <a
              className={styles["manual__pdf"]}
              href={manual.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalFileIcon />
              Abrir PDF original
              <span className={styles["manual__sr-only"]}> (abre em nova aba)</span>
            </a>
          )}
        </header>

        {manual.sections.length > 0 ? (
          <ManualViewer sections={manual.sections} pdfUrl={manual.pdfUrl} />
        ) : (
          // manual ainda sem texto digitalizado: mostra o PDF direto na página
          <iframe
            src={`${manual.pdfUrl}#view=FitH`}
            title={`${manual.title} (PDF)`}
            style={{ width: "100%", height: "78vh", border: 0, borderRadius: 8, background: "#fff" }}
          />
        )}
      </div>
    </section>
  );
}