import type { TicketMessageView } from "@/lib/support/types";
import { TimeText } from "./TimeText";
import styles from "@/_styles/cssUserPanelPage/support/TicketThread.module.css";

const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

// Usado no painel do usuário (sem notas internas) e no do admin (com notas em amarelo).
export function TicketThread({ messages }: { messages: TicketMessageView[] }) {
  return (
    <ol className={styles.list}>
      {messages.map((m) => (
        <li
          key={m.id}
          className={[styles.msg, m.fromSupport ? styles.support : "", m.isInternal ? styles.internal : ""].join(" ")}
        >
          <span className={styles.avatar} aria-hidden="true">{initials(m.authorName)}</span>
          <div className={styles.body}>
            <div className={styles.meta}>
              <strong>{m.authorName}</strong> · <TimeText iso={m.createdAt} />
              {m.isInternal && <span className={styles.tag}> · Internal note, only the team sees this</span>}
            </div>
            <div className={styles.bubble}>{m.body}</div>
            {m.attachments.length > 0 && (
              <ul className={styles.files}>
                {m.attachments.map((a) => (
                  <li key={a.id}>
                    <a href={a.fileUrl} target="_blank" rel="noopener noreferrer">{a.fileName}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
