import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "session";
const DAY = 60 * 60 * 24;

function getKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createSession(userId: number, remember: boolean) {
  const maxAge = remember ? 30 * DAY : DAY;

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(getKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Sem "Remember me": cookie de sessão (some ao fechar o navegador)
    ...(remember && { maxAge }),
  });
}

/** Retorna o id do usuário da sessão, ou null se ausente/inválida/expirada. */
export async function readSession(): Promise<number | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    const id = Number(payload.sub);
    return Number.isInteger(id) ? id : null;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE_NAME);
}
