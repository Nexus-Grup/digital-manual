"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { TicketAbout, TicketCategory, TicketPriority } from "@prisma/client";
import { createTicket } from "@/lib/support/client";
import {
  ABOUT_OPTIONS,
  CATEGORY_OPTIONS,
  LIMITS,
  PRIORITY_OPTIONS,
  SUPPORT_BASE,
} from "@/lib/support/constants";
import type { TicketTargets, UploadedFile } from "@/lib/support/types";
import { AttachmentPicker } from "./AttachmentPicker";
import { ChipGroup } from "./ChipGroup";
import styles from "@/_styles/cssUserPanelPage/support/NewTicketForm.module.css";

// pt-BR names with article, for the target field texts ("Selecione o produto", "nenhuma marca")
const TARGET_NAME = {
  PRODUCT: { the: "o produto", none: "nenhum produto" },
  BRAND: { the: "a marca", none: "nenhuma marca" },
  COMPANY: { the: "a empresa", none: "nenhuma empresa" },
} as const;

export function NewTicketForm({ targets }: { targets: TicketTargets }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState<TicketAbout>("PRODUCT");
  const [targetId, setTargetId] = useState("");
  const [category, setCategory] = useState<TicketCategory>("TECHNICAL_ISSUE");
  const [priority, setPriority] = useState<TicketPriority>("LOW");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const targetKey = about === "PRODUCT" || about === "BRAND" || about === "COMPANY" ? about : null;
  const targetList = targetKey
    ? { PRODUCT: targets.products, BRAND: targets.brands, COMPANY: targets.companies }[targetKey]
    : null;
  const targetName = targetKey ? TARGET_NAME[targetKey] : null;

  function changeAbout(value: TicketAbout) {
    setAbout(value);
    setTargetId("");
    setError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (title.trim().length < LIMITS.titleMin) return setError("Escreva um assunto curto.");
    if (targetList && !targetId) return setError(`Selecione ${targetName?.the}.`);
    if (description.trim().length < LIMITS.bodyMin) return setError("Descreva o problema com um pouco mais de detalhes.");

    setBusy(true);
    const id = targetList ? Number(targetId) : null;
    const res = await createTicket({
      title,
      about,
      category,
      priority,
      description,
      attachments: files,
      productId: about === "PRODUCT" ? id : null,
      brandId: about === "BRAND" ? id : null,
      companyId: about === "COMPANY" ? id : null,
    });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    toast.success("Chamado aberto");
    router.push(`${SUPPORT_BASE}/${res.data.id}`);
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="ticket-title">Assunto</label>
        <input
          id="ticket-title"
          className={styles.input}
          value={title}
          maxLength={LIMITS.titleMax}
          placeholder="ex.: o QR Code não abre o manual"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <ChipGroup label="Sobre o que é?" options={ABOUT_OPTIONS} value={about} onChange={changeAbout} />

      <div className={styles.row}>
        {targetList && targetName && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ticket-target">Selecione {targetName.the}</label>
            <select id="ticket-target" className={styles.select} value={targetId} onChange={(e) => setTargetId(e.target.value)}>
              <option value="">Escolha...</option>
              {targetList.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
            {targetList.length === 0 && (
              <p className={styles.hint}>Você ainda não tem {targetName.none}.</p>
            )}
          </div>
        )}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="ticket-category">Categoria</label>
          <select id="ticket-category" className={styles.select} value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)}>
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <ChipGroup label="Prioridade" options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} />

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ticket-description">Descrição</label>
        <textarea
          id="ticket-description"
          className={styles.textarea}
          value={description}
          maxLength={LIMITS.bodyMax}
          placeholder="Descreva o problema e o que você já tentou."
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <AttachmentPicker variant="dropzone" files={files} onChange={setFiles} onBusyChange={setUploading} />

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.actions}>
        <Link href={SUPPORT_BASE} className={styles.secondary}>Cancelar</Link>
        <button type="submit" className={styles.primary} disabled={busy || uploading}>
          {busy ? "Abrindo..." : "Abrir chamado"}
        </button>
      </div>
    </form>
  );
}
