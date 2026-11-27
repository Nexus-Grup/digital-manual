"use client";

import Image from "next/image";
import Link from "next/link";
import LuccaLoader from "@/_components/global/LuccaLoader";
import styles from "@/_styles/global/LuccaError.module.css";
import luccaThinking from "@/_assets/image/lucca/lucca-thinking.png";

export type ErrorType = 400 | 401 | 403 | 404 | 429 | 500 | 503 | "offline" | "unknown";

/** Título e texto exibidos em cada tipo de erro */
const INFO: Record<ErrorType, { title: string; text: string }> = {
  400: { title: "Pedido inválido", text: "Não consegui entender esse pedido. Confira o que foi enviado." },
  401: { title: "Faça login", text: "Preciso saber quem é você antes de continuar." },
  403: { title: "Acesso negado", text: "Você não tem permissão para entrar nesta área." },
  404: { title: "Página não encontrada", text: "Procurei em tudo e não achei essa página. Confira se o link está certo." },
  429: { title: "Calma aí", text: "Muitos pedidos em pouco tempo. Respire e tente de novo." },
  500: { title: "Algo deu errado", text: "Tivemos um problema por aqui. Tente de novo em instantes." },
  503: { title: "Em manutenção", text: "Estamos ajustando algumas coisas. Volte daqui a pouco." },
  offline: { title: "Sem conexão", text: "Parece que a internet caiu. Confira a conexão e tente de novo." },
  unknown: { title: "Algo deu errado", text: "Não sei bem o que aconteceu. Tente de novo em instantes." },
};

/** O que aparece em tamanho grande (o número do erro) */
const label = (code: ErrorType) =>
  typeof code === "number" ? String(code) : code === "offline" ? "Offline" : "Erro";

/** Descobre o tipo do erro: sem internet, `error.status` ou um código no texto da mensagem */
export function detectCode(error?: { status?: number; message?: string }): ErrorType {
  if (typeof navigator !== "undefined" && !navigator.onLine) return "offline";
  if (typeof error?.status === "number") return error.status as ErrorType;
  const m = error?.message?.match(/\b(400|401|403|404|429|500|503)\b/);
  return m ? (Number(m[1]) as ErrorType) : 500;
}

type Props = {
  /** Tipo do erro. Códigos que não estão na lista caem em "unknown" */
  code?: ErrorType | number;
  /** O `error` do error.tsx: o código é descoberto sozinho (quando `code` não é passado) */
  error?: Error & { status?: number; digest?: string };
  /** Título personalizado (substitui o padrão do código) */
  title?: string;
  /** Texto personalizado (substitui o padrão do código) */
  text?: string;
  /** Passe o `reset` do error.tsx para mostrar o botão "Tentar de novo" */
  reset?: () => void;
  homeHref?: string;
  homeLabel?: string;
};

export default function LuccaError({
  code,
  error,
  title,
  text,
  reset,
  homeHref = "/",
  homeLabel = "Voltar ao início",
}: Props) {
  const finalCode = (code ?? (error ? detectCode(error) : 404)) as ErrorType;
  const info = INFO[finalCode] ?? INFO.unknown;

  return (
    <main id="conteudo" className={styles.page}>
      {/* not found: Lucca thinking ("where did it go?"); other errors keep the blinking Lucca */}
      {finalCode === 404 ? (
        <Image className={styles.thinking} src={luccaThinking} alt="" sizes="160px" priority />
      ) : (
        <LuccaLoader variant="blink" size={120} fullscreen={false} />
      )}

      <div className={styles.info}>
        <h1 className={styles.code}>{INFO[finalCode] ? label(finalCode) : String(code)}</h1>
        <h2 className={styles.title}>{title ?? info.title}</h2>
        <p className={styles.text}>{text ?? info.text}</p>
      </div>

      <div className={styles.actions}>
        {reset && (
          <button type="button" className={styles.btn} onClick={reset}>
            Tentar de novo
          </button>
        )}
        <Link href={homeHref} className={`${styles.btn} ${styles.ghost}`}>
          {homeLabel}
        </Link>
      </div>
    </main>
  );
}