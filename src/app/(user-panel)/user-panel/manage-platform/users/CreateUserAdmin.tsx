"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreateUserForm, type AdminCreateUserValues } from "@/_components/utils/CreateUserForm"

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
        // 400 (zod) devolve um objeto; 403/409/500 devolvem texto
        const message =
          typeof data?.error === "string" ? data.error : "Invalid data. Check the fields.";
        toast.error(message);
        return;
      }

      toast.success("User created successfully.");
      router.push("/user-panel/manage-platform/users");
      router.refresh();
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CreateUserForm
      variant="admin"
      loading={loading}
      onCancel={() => router.back()}
      onSubmit={handleSubmit}
    />
  );
}