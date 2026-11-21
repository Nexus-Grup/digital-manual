import type { UploadedFile } from "./types";

export type Res<T> = { ok: true; data: T } | { ok: false; error: string };

export async function request<T>(url: string, init: RequestInit): Promise<Res<T>> {
  try {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
    const json = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: json?.error ?? "Something went wrong. Try again." };
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, error: "Network error. Check your connection." };
  }
}

export const createTicket = (payload: unknown) =>
  request<{ id: number }>("/api/support/tickets", { method: "POST", body: JSON.stringify(payload) });

export const sendReply = (ticketId: number, body: string, attachments: UploadedFile[] = []) =>
  request<{ id: number }>(`/api/support/tickets/${ticketId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body, attachments }),
  });

export const resolveTicket = (ticketId: number) =>
  request<{ ok: true }>(`/api/support/tickets/${ticketId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "RESOLVED" }),
  });

// Mesmo padrão do upload de logo: o arquivo sobe na hora e a URL volta para o formulário.
export async function uploadAttachment(file: File): Promise<Res<UploadedFile>> {
  try {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/support/uploads", { method: "POST", body });
    const json = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: json?.error ?? "Upload failed" };
    return { ok: true, data: json as UploadedFile };
  } catch {
    return { ok: false, error: "Upload failed. Try again." };
  }
}
