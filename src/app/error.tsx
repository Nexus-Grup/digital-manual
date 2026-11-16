'use client'; 

import LuccaError from '@/_components/global/LuccaError';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <LuccaError code={500} reset={reset} />;
}