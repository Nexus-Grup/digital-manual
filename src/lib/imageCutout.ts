import sharp from 'sharp';
import { Client, handle_file } from '@gradio/client';

/**
 * Product photo cutout: removes the background and crops the image to the product (WebP with alpha).
 *
 * 1. BiRefNet (MIT, by its author) on a free Hugging Face Space: segments the product in any photo,
 *    including real scenes (table, wall, hands). Same HF_TOKEN quota as the 3D generation.
 * 2. If the Space is unavailable: flood fill from the image border, only when the border is a plain
 *    backdrop (studio photo). A busy scene is then kept as it is instead of being cut badly.
 *
 * No path aliases and no "server-only" here, so scripts/cutout-product-images.mjs can import it too.
 */

const SEGMENT_SPACE = process.env.BG_REMOVAL_SPACE ?? 'ZhengPeng7/BiRefNet_demo';
const SEGMENT_TIMEOUT_MS = 60_000;

const MAX_SIDE = 1600; // bigger than any slot on the public pages (hero 520px @2x)
const LOCAL_TOLERANCE = 18; // max color step between neighboring backdrop pixels (JPEG noise, gradients)
const GLOBAL_TOLERANCE = 64; // max distance from the backdrop color
const UNIFORM_BORDER = 0.85; // share of the border that must match the backdrop color
const PADDING = 0.04; // margin kept around the product, relative to its largest side
const MIN_SHARE = 0.01; // below 1% product (or backdrop) the result is not trusted

type Rgb = [number, number, number];
type Raw = { data: Buffer; width: number; height: number };

export type CutoutMethod = 'ai' | 'backdrop' | 'transparent' | 'none';

export type Cutout = {
  /** WebP with transparency, cropped to the product */
  data: Buffer;
  /** how the background was removed ('none': busy photo and segmentation unavailable) */
  method: CutoutMethod;
};

function hfToken(): `hf_${string}` | undefined {
  const t = process.env.HF_TOKEN?.trim();
  return t?.startsWith('hf_') ? (t as `hf_${string}`) : undefined;
}

const toRaw = async (input: Buffer): Promise<Raw> => {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
};

function borderIndexes(w: number, h: number): number[] {
  const out: number[] = [];
  for (let x = 0; x < w; x++) out.push(x, (h - 1) * w + x);
  for (let y = 1; y < h - 1; y++) out.push(y * w, y * w + w - 1);
  return out;
}

const visibleShare = ({ data, width, height }: Raw) => {
  let visible = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) visible++;
  return visible / (width * height);
};

// ---------- 1. BiRefNet segmentation ----------

type GradioFile = { url?: string | null };

async function segment(png: Buffer): Promise<Buffer> {
  const token = hfToken();
  const run = async () => {
    const client = await Client.connect(SEGMENT_SPACE, token ? { token } : undefined);
    const result = await client.predict('/image', {
      images: handle_file(new Blob([new Uint8Array(png)], { type: 'image/png' })),
      resolution: '',
      weights_file: 'General',
    });
    // returns [[original, cutout with alpha]]
    const pair = (result.data as GradioFile[][])[0];
    const url = pair?.[1]?.url;
    if (!url) throw new Error('segmentation returned no image');
    const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined, cache: 'no-store' });
    if (!res.ok) throw new Error(`segmentation download failed (${res.status})`);
    return Buffer.from(await res.arrayBuffer());
  };

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('segmentation timed out')), SEGMENT_TIMEOUT_MS);
  });
  try {
    return await Promise.race([run(), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

// ---------- 2. Plain backdrop fallback ----------

const dist2 = (d: Buffer, i: number, c: Rgb) => {
  const r = d[i] - c[0];
  const g = d[i + 1] - c[1];
  const b = d[i + 2] - c[2];
  return r * r + g * g + b * b;
};

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

/** Marks the backdrop (1) by flood fill from the border. Null when the border is not a plain backdrop. */
function backdropMask(d: Buffer, w: number, h: number, border: number[]): { mask: Uint8Array; color: Rgb } | null {
  const color: Rgb = [0, 1, 2].map((c) => median(border.map((p) => d[p * 4 + c]))) as Rgb;
  const local2 = LOCAL_TOLERANCE ** 2;
  const global2 = GLOBAL_TOLERANCE ** 2;

  const seeds = border.filter((p) => dist2(d, p * 4, color) < global2);
  if (seeds.length / border.length < UNIFORM_BORDER) return null; // busy scene: do not guess

  const total = w * h;
  const mask = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;
  for (const p of seeds) {
    if (!mask[p]) {
      mask[p] = 1;
      queue[tail++] = p;
    }
  }

  const visit = (n: number, pi: number) => {
    if (mask[n]) return;
    const ni = n * 4;
    const r = d[ni] - d[pi];
    const g = d[ni + 1] - d[pi + 1];
    const b = d[ni + 2] - d[pi + 2];
    if (r * r + g * g + b * b < local2 && dist2(d, ni, color) < global2) {
      mask[n] = 1;
      queue[tail++] = n;
    }
  };

  while (head < tail) {
    const p = queue[head++];
    const pi = p * 4;
    const x = p % w;
    if (x > 0) visit(p - 1, pi);
    if (x < w - 1) visit(p + 1, pi);
    if (p >= w) visit(p - w, pi);
    if (p + w < total) visit(p + w, pi);
  }

  const share = tail / total;
  return share < MIN_SHARE || share > 1 - MIN_SHARE ? null : { mask, color };
}

/** Transparent backdrop + soft, color-corrected outline. Writes the alpha channel in place. */
function applyMask(d: Buffer, w: number, h: number, mask: Uint8Array, color: Rgb) {
  const total = w * h;
  for (let p = 0; p < total; p++) {
    const i = p * 4;
    if (mask[p]) {
      d[i + 3] = 0;
      continue;
    }
    const x = p % w;
    const onEdge =
      (x > 0 && mask[p - 1]) || (x < w - 1 && mask[p + 1]) || (p >= w && mask[p - w]) || (p + w < total && mask[p + w]);
    if (!onEdge) continue;

    // outline pixel: blend of product and backdrop -> partial alpha, backdrop color removed
    const a = Math.min(1, Math.sqrt(dist2(d, i, color)) / GLOBAL_TOLERANCE);
    if (a <= 0.05) {
      d[i + 3] = 0;
      continue;
    }
    for (let c = 0; c < 3; c++) {
      d[i + c] = Math.max(0, Math.min(255, Math.round((d[i + c] - (1 - a) * color[c]) / a)));
    }
    d[i + 3] = Math.round(d[i + 3] * a);
  }
}

// ---------- crop + encode ----------

/** Smallest box around the visible pixels, plus padding. Null when the image is fully transparent. */
function productBox({ data, width: w, height: h }: Raw) {
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * PADDING);
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  return {
    left,
    top,
    width: Math.min(w - 1, maxX + pad) - left + 1,
    height: Math.min(h - 1, maxY + pad) - top + 1,
  };
}

async function encode(raw: Raw): Promise<Buffer> {
  const image = sharp(raw.data, { raw: { width: raw.width, height: raw.height, channels: 4 } });
  const box = productBox(raw);
  return (box ? image.extract(box) : image).webp({ quality: 85, alphaQuality: 90, effort: 4 }).toBuffer();
}

async function removeBackground(png: Buffer): Promise<{ raw: Raw; method: CutoutMethod }> {
  const original = await toRaw(png);
  const { data, width: w, height: h } = original;
  const border = borderIndexes(w, h);

  // already a cutout (transparent PNG/WebP): keep its alpha
  if (border.filter((p) => data[p * 4 + 3] < 200).length / border.length > 0.5) {
    return { raw: original, method: 'transparent' };
  }

  try {
    const cut = await sharp(await segment(png)).resize(w, h, { fit: 'fill' }).png().toBuffer();
    const raw = await toRaw(cut);
    const share = visibleShare(raw);
    if (share >= MIN_SHARE && share <= 1 - MIN_SHARE) return { raw, method: 'ai' };
    console.warn(`Segmentation found no product (visible share ${share.toFixed(3)}), trying the backdrop fallback`);
  } catch (e) {
    console.warn('Segmentation unavailable, trying the backdrop fallback:', e instanceof Error ? e.message : e);
  }

  const backdrop = backdropMask(data, w, h, border);
  if (!backdrop) return { raw: original, method: 'none' };
  applyMask(data, w, h, backdrop.mask, backdrop.color);
  return { raw: original, method: 'backdrop' };
}

export async function cutoutProductImage(input: Uint8Array): Promise<Cutout> {
  // EXIF orientation + size cap; PNG keeps it lossless for the segmentation
  const png = await sharp(input)
    .rotate()
    .resize(MAX_SIDE, MAX_SIDE, { fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer();
  const { raw, method } = await removeBackground(png);
  return { data: await encode(raw), method };
}
