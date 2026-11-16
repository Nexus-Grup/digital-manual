// app/not-found.tsx
import LuccaError from "@/_components/global/LuccaError";

export default function NotFound() {
  return <LuccaError code={404} />;
}