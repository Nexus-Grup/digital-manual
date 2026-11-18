import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/session";

/**
 * Usuário logado (ou null). Sempre confere no banco, então um usuário
 * desativado (isActive = false) perde o acesso mesmo com cookie válido.
 */
export const getCurrentUser = cache(async () => {
  const userId = await readSession();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      userName: true,
      email: true,
      systemRole: true,
      isActive: true,
      mustChangePassword: true,
    },
  });

  if (!user || !user.isActive) return null;
  return user;
});
