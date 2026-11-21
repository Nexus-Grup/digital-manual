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

const TARGET_NAME = { PRODUCT: "product", BRAND: "brand", COMPANY: "company" } as const;

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
  const targetName = targetKey ? TARGET_NAME[targetKey] : "";

  function changeAbout(value: TicketAbout) {
    setAbout(value);
    setTargetId("");
    setError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (title.trim().length < LIMITS.titleMin) return setError("Add a short subject.");
    if (targetList && !targetId) return setError(`Select a ${targetName}.`);
    if (description.trim().length < LIMITS.bodyMin) return setError("Describe the problem in a few more words.");

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
    toast.success("Ticket opened");
    router.push(`${SUPPORT_BASE}/${res.data.id}`);
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="ticket-title">Subject</label>
        <input
          id="ticket-title"
          className={styles.input}
          value={title}
          maxLength={LIMITS.titleMax}
          placeholder="e.g. QR code won't open the manual"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <ChipGroup label="What is it about?" options={ABOUT_OPTIONS} value={about} onChange={changeAbout} />

      <div className={styles.row}>
        {targetList && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ticket-target">Select the {targetName}</label>
            <select id="ticket-target" className={styles.select} value={targetId} onChange={(e) => setTargetId(e.target.value)}>
              <option value="">Choose...</option>
              {targetList.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
            {targetList.length === 0 && <p className={styles.hint}>You don&apos;t have any {targetName}s yet.</p>}
          </div>
        )}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="ticket-category">Category</label>
          <select id="ticket-category" className={styles.select} value={category} onChange={(e) => setCategory(e.target.value as TicketCategory)}>
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <ChipGroup label="Priority" options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} />

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ticket-description">Description</label>
        <textarea
          id="ticket-description"
          className={styles.textarea}
          value={description}
          maxLength={LIMITS.bodyMax}
          placeholder="Describe the problem and what you've already tried."
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <AttachmentPicker variant="dropzone" files={files} onChange={setFiles} onBusyChange={setUploading} />

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.actions}>
        <Link href={SUPPORT_BASE} className={styles.secondary}>Cancel</Link>
        <button type="submit" className={styles.primary} disabled={busy || uploading}>
          {busy ? "Opening..." : "Open ticket"}
        </button>
      </div>
    </form>
  );
}
