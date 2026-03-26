import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Salva imagem base64 em /public/uploads/ e retorna URL publica
// Em producao (Vercel), /tmp/ e o unico dir gravavel — usamos ele
// e servimos via API route

const IS_VERCEL = !!process.env.VERCEL;
const UPLOAD_DIR = IS_VERCEL ? "/tmp/campaign-images" : path.join(process.cwd(), "public/uploads");

export async function POST(req: Request) {
  try {
    const { image } = await req.json(); // base64 data URL
    if (!image || !image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }

    // Extract base64 data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Generate filename
    const filename = `campaign-${Date.now()}.png`;

    // Ensure dir exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const filepath = path.join(UPLOAD_DIR, filename);
    await writeFile(filepath, buffer);

    // Return URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const url = IS_VERCEL
      ? `${appUrl}/api/upload/campaign-image?file=${filename}`
      : `${appUrl}/uploads/${filename}`;

    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error("[upload] Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// Serve imagem do /tmp/ na Vercel
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("file");

  if (!filename || filename.includes("..")) {
    return new NextResponse("Not found", { status: 404 });
  }

  const filepath = path.join(UPLOAD_DIR, filename);
  try {
    const { readFile } = await import("fs/promises");
    const buffer = await readFile(filepath);
    return new NextResponse(buffer, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
