import { HttpError, requireUser } from "@/lib/companyAccess";

// Só quem tem systemRole ADMIN passa. Use dentro do try/catch com handleError.
export async function requireAdmin() {
  const user = await requireUser();
  if (user.systemRole !== "ADMIN") throw new HttpError(403, "Acesso negado");
  return user;
}
