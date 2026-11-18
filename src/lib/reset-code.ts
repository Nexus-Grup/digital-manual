import "server-only";
import { createHmac, randomInt } from "crypto";

export const CODE_TTL_MS = 10 * 60 * 1000; // código vale 10 min
export const RESEND_COOLDOWN_MS = 60 * 1000; // 1 código por minuto
export const MAX_ATTEMPTS = 5; // tentativas erradas por código

export function generateCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/** O código nunca é salvo em texto puro: só o HMAC dele. */
export function hashCode(code: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return createHmac("sha256", secret).update(code).digest("hex");
}
