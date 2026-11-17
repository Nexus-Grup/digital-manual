"use client"
import WaitScreen from '@/_components/global/WaitScreen';
import { useRouter } from 'next/navigation'

export default function Wait() {
  const router = useRouter();

  return <WaitScreen loop={false} onDone={() => router.replace("/landing-page")} />;
}
