// app/not-found.tsx
import LuccaError from "@/_components/global/LuccaError";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada | Manual digital",
  description: "O endereço acessado não existe ou mudou. Volte para o início ou busque o manual do seu produto.",
};

export default function NotFound() {
  return <LuccaError code={404} />;
}