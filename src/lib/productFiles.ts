// Tipos de arquivo aceitos no upload, com tamanho máximo e conferência do conteúdo real.
export type FileKind = 'image' | 'audio' | 'pdf' | 'model';

const MB = 1024 * 1024;
const at = (b: Uint8Array, bytes: number[], from = 0) => bytes.every((v, i) => b[from + i] === v);

type Rule = { ext: string; type: string; valid: (b: Uint8Array) => boolean };

export const FILE_KINDS: Record<FileKind, { maxSize: number; rules: Rule[] }> = {
  image: {
    maxSize: 10 * MB,
    rules: [
      { ext: 'png', type: 'image/png', valid: (b) => at(b, [0x89, 0x50, 0x4e, 0x47]) },
      { ext: 'jpg', type: 'image/jpeg', valid: (b) => at(b, [0xff, 0xd8, 0xff]) },
      { ext: 'webp', type: 'image/webp', valid: (b) => at(b, [0x52, 0x49, 0x46, 0x46]) && at(b, [0x57, 0x45, 0x42, 0x50], 8) },
    ],
  },
  audio: {
    maxSize: 20 * MB,
    rules: [
      { ext: 'mp3', type: 'audio/mpeg', valid: (b) => at(b, [0x49, 0x44, 0x33]) || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0) },
      { ext: 'wav', type: 'audio/wav', valid: (b) => at(b, [0x52, 0x49, 0x46, 0x46]) && at(b, [0x57, 0x41, 0x56, 0x45], 8) },
      { ext: 'ogg', type: 'audio/ogg', valid: (b) => at(b, [0x4f, 0x67, 0x67, 0x53]) },
    ],
  },
  pdf: { maxSize: 50 * MB, rules: [{ ext: 'pdf', type: 'application/pdf', valid: (b) => at(b, [0x25, 0x50, 0x44, 0x46]) }] },
  model: { maxSize: 50 * MB, rules: [{ ext: 'glb', type: 'model/gltf-binary', valid: (b) => at(b, [0x67, 0x6c, 0x54, 0x46]) }] },
};

export const isFileKind = (v: unknown): v is FileKind => typeof v === 'string' && v in FILE_KINDS;

/** extensão do nome do arquivo -> regra (jpeg vira jpg) */
export function ruleForName(kind: FileKind, fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase().replace('jpeg', 'jpg') ?? '';
  return FILE_KINDS[kind].rules.find((r) => r.ext === ext) ?? null;
}
