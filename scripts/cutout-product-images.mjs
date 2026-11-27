// Removes the background of product photos uploaded before the automatic cutout existed
// (main image + gallery), stores the cutout next to the original and points the database to it.
//
//   node scripts/cutout-product-images.mjs              -> dry run: lists what would change
//   node scripts/cutout-product-images.mjs --apply      -> processes and updates the database
//   node scripts/cutout-product-images.mjs --apply --product=2   -> only one product
//
// The originals are kept in the bucket, so the change can be undone by restoring the old URLs
// (printed in the log). Needs DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// and HF_TOKEN in .env / .env.local. Requires Node 22.18+ (imports a .ts file).
import { config } from 'dotenv';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { cutoutProductImage } from '../src/lib/imageCutout.ts';

config({ path: '.env.local' });
config({ path: '.env' });

const BUCKET = 'product-media';
const apply = process.argv.includes('--apply');
const productArg = process.argv.find((a) => a.startsWith('--product='));
const onlyProduct = productArg ? Number(productArg.split('=')[1]) : null;

const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
const prefix = `${base}/storage/v1/object/public/${BUCKET}/`;
const isOwnImage = (url) => url?.startsWith(prefix) && /\.(png|jpe?g|webp)$/i.test(url) && !url.endsWith('-cutout.webp');

const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
const supabase = createClient(base, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

await db.connect();
const filter = onlyProduct ? 'where p.id = $1' : '';
const params = onlyProduct ? [onlyProduct] : [];
const main = await db.query(`select p.id as "productId", p."imgUrl" as url from products p ${filter}`, params);
const gallery = await db.query(
  `select i.id, g."productId", i."imageUrl" as url
     from product_gallery_images i join product_galleries g on g.id = i."galleryId"
     join products p on p.id = g."productId" ${filter}`,
  params,
);

const jobs = [
  ...main.rows.filter((r) => isOwnImage(r.url)).map((r) => ({ ...r, table: 'main' })),
  ...gallery.rows.filter((r) => isOwnImage(r.url)).map((r) => ({ ...r, table: 'gallery' })),
];
console.log(`${jobs.length} image(s) without cutout${apply ? '' : ' (dry run, add --apply to process)'}`);

const done = new Map(); // same photo used twice (main + gallery) is processed once
let ok = 0, skipped = 0, failed = 0;

for (const job of jobs) {
  const label = `product ${job.productId} ${job.table}${job.id ? ` #${job.id}` : ''}`;
  if (!apply) {
    console.log(`- ${label}: ${job.url}`);
    continue;
  }
  try {
    let next = done.get(job.url);
    if (!next) {
      const path = job.url.slice(prefix.length);
      const res = await fetch(job.url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`download failed (${res.status})`);
      const { data, method } = await cutoutProductImage(new Uint8Array(await res.arrayBuffer()));
      if (method === 'none') {
        console.log(`! ${label}: background not removed (segmentation unavailable), kept as it is`);
        skipped++;
        continue;
      }
      const cutPath = path.replace(/\.[^./]+$/, '') + '-cutout.webp';
      const up = await supabase.storage.from(BUCKET).upload(cutPath, data, {
        contentType: 'image/webp',
        cacheControl: '31536000',
        upsert: true,
      });
      if (up.error) throw up.error;
      next = supabase.storage.from(BUCKET).getPublicUrl(cutPath).data.publicUrl;
      done.set(job.url, next);
      console.log(`  ${label}: ${method}`);
    }

    if (job.table === 'main') {
      await db.query('update products set "imgUrl" = $1 where id = $2 and "imgUrl" = $3', [next, job.productId, job.url]);
    } else {
      await db.query('update product_gallery_images set "imageUrl" = $1 where id = $2', [next, job.id]);
    }
    console.log(`✓ ${label}\n    old: ${job.url}\n    new: ${next}`);
    ok++;
  } catch (e) {
    console.error(`✗ ${label}:`, e instanceof Error ? e.message : e);
    failed++;
  }
}

if (apply) console.log(`\nDone: ${ok} updated, ${skipped} skipped, ${failed} failed.`);
await db.end();
process.exit(failed > 0 ? 1 : 0);
