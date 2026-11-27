'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/**
 * Monta a URL publica que o QR vai abrir: https://seusite.com/p/<qrId>
 * Em producao defina NEXT_PUBLIC_APP_URL (ex: https://manualdigital.com.br) para o QR
 * sempre apontar para o dominio certo, mesmo se for gerado em localhost.
 */
export function qrUrl(qrId: string) {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? (typeof window !== 'undefined' ? window.location.origin : '')).replace(/\/$/, '');
  return `${base}/p/${encodeURIComponent(qrId)}`;
}

/** Desenha o QR Code no navegador (pacote "qrcode"). `value` = texto/URL que o QR contem. */
export function QrImage({ value, size = 64, className }: { value: string; size?: number; className?: string }) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(value, { margin: 1, width: size * 3 }).then((u) => alive && setSrc(u));
    return () => { alive = false; };
  }, [value, size]);

  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt={`QR Code de ${value}`} width={size} height={size} className={className} /> : <span style={{ width: size, height: size, display: 'inline-block' }} />;
}

export async function downloadQrPng(value: string, fileName: string) {
  const url = await QRCode.toDataURL(value, { margin: 2, width: 1024 });
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.png`;
  a.click();
}

export async function downloadQrPdf(value: string, fileName: string, title: string) {
  const { jsPDF } = await import('jspdf');
  const png = await QRCode.toDataURL(value, { margin: 2, width: 1024 });
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  pdf.setFontSize(18);
  pdf.text(fileName, 105, 30, { align: 'center' });
  pdf.setFontSize(11);
  pdf.text(title, 105, 38, { align: 'center' });
  pdf.addImage(png, 'PNG', 45, 50, 120, 120);
  pdf.setFontSize(9);
  pdf.text(value, 105, 182, { align: 'center' });
  pdf.save(`${fileName}.pdf`);
}