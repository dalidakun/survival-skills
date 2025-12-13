import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const password = formData.get("password");
    const pdfFile = formData.get("pdf") as File | null;

    // 验证密码
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: "密码错误" }, { status: 401 });
    }

    // 验证文件
    if (!pdfFile || pdfFile.type !== "application/pdf") {
      return NextResponse.json(
        { message: "请上传 PDF 文件" },
        { status: 400 }
      );
    }

    // 检查文件大小（限制为 50MB）
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (pdfFile.size > maxSize) {
      return NextResponse.json(
        { message: "文件大小不能超过 50MB" },
        { status: 400 }
      );
    }

    // 生成文件名（使用时间戳避免冲突）
    const timestamp = Date.now();
    const originalName = pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${originalName}`;
    
    // 保存文件到 public/pdfs 目录
    const pdfDir = path.join(process.cwd(), "public", "pdfs");
    await fs.mkdir(pdfDir, { recursive: true });
    
    const pdfPath = path.join(pdfDir, fileName);
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    await fs.writeFile(pdfPath, pdfBuffer);

    // 生成可访问的 URL（相对路径，Next.js 会自动处理）
    // 在生产环境中，这会是 /pdfs/文件名.pdf
    // 在本地开发中，这会是 http://localhost:3000/pdfs/文件名.pdf
    const pdfUrl = `/pdfs/${fileName}`;

    return NextResponse.json({
      message: "上传成功",
      url: pdfUrl,
      fileName: fileName,
      fullUrl: process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}${pdfUrl}`
        : pdfUrl
    });
  } catch (error) {
    console.error("PDF 上传错误:", error);
    return NextResponse.json(
      { message: "上传失败，请稍后再试" },
      { status: 500 }
    );
  }
}

