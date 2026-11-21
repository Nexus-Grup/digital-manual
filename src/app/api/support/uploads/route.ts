import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { HttpError, handleError, requireUser } from "@/lib/companyAccess";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { MAX_ATTACHMENT_SIZE, SUPPORT_BUCKET } from "@/lib/support/constants";

const startsWith = (b: Buffer, bytes: number[]) => bytes.every((v, i) => b[i] === v);

const TYPES: Record<string, { ext: string; valid: (b: Buffer) => boolean }> = {
  "image/png": { ext: "png", valid: (b) => startsWith(b, [0x89, 0x50, 0x4e, 0x47]) },
  "image/jpeg": { ext: "jpg", valid: (b) => startsWith(b, [0xff, 0xd8, 0xff]) },
  "application/pdf": { ext: "pdf", valid: (b) => startsWith(b, [0x25, 0x50, 0x44, 0x46]) },
};

// Anexos de chamado: qualquer usuário logado (usuário ou admin) pode subir.
export async function POST(req: Request) {
  try {
    await requireUser();
    const file = (await req.formData()).get("file");
    if (!(file instanceof File)) throw new HttpError(400, "No file sent");
    if (file.size > MAX_ATTACHMENT_SIZE) throw new HttpError(400, "File must be up to 10 MB");

    const kind = TYPES[file.type];
    if (!kind) throw new HttpError(400, "Use a PNG, JPG or PDF file");

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!kind.valid(buffer)) throw new HttpError(400, "The file content does not match its type");

    const objectPath = `support/${randomUUID()}.${kind.ext}`;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.storage.from(SUPPORT_BUCKET).upload(objectPath, buffer, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) {
      console.error("Support attachment upload failed", error);
      throw new HttpError(500, "Could not upload the file");
    }

    const { data } = supabase.storage.from(SUPPORT_BUCKET).getPublicUrl(objectPath);
    const fileName = file.name.split(/[\\/]/).pop()?.slice(0, 120) || `file.${kind.ext}`;
    return NextResponse.json(
      { fileUrl: data.publicUrl, fileName, mimeType: file.type, sizeBytes: file.size },
      { status: 201 },
    );
  } catch (e) {
    return handleError(e);
  }
}
