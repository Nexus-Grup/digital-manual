"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// Ajuste o caminho para onde está o seu CreateUserForm
import {
  CreateUserForm,
  type AdminCreateUserValues,
} from "@/_components/utils/CreateUserForm";

const LIST_HREF = "/painel/gerenciar-plataforma/usuarios";

export function CreateUserAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: AdminCreateUserValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(
          typeof data?.error === "string" ? data.error : "Dados inválidos. Confira os campos."
        );
        return;
      }

      toast.success("Usuário criado com sucesso.");
      router.push(LIST_HREF); // volta para a lista
      router.refresh(); // atualiza tabela e cards
    } catch {
      toast.error("Erro de conexão. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CreateUserForm
      variant="admin"
      loading={loading}
      onCancel={() => router.push(LIST_HREF)}
      onSubmit={handleSubmit}
    />
  );
}