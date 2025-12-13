import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

export async function POST(req: Request) {
  const formData = await req.formData();
  const password = formData.get("password");
  const slug = String(formData.get("slug") || "").trim();

  if (!password || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ message: "密码错误" }, { status: 401 });
  }

  if (!slug || slug.includes("..") || slug.includes("/")) {
    return NextResponse.json({ message: "无效的 slug" }, { status: 400 });
  }

  const markdownFile =
    (formData.get("text") as File | null) ||
    (formData.get("file") as File | null);

  if (!markdownFile) {
    return NextResponse.json(
      { message: "请上传 Markdown 文本或文件" },
      { status: 400 }
    );
  }

  const markdownBuffer = Buffer.from(await markdownFile.arrayBuffer());
  const contentPath = path.join(process.cwd(), "content", `${slug}.md`);
  await fs.mkdir(path.dirname(contentPath), { recursive: true });
  await fs.writeFile(contentPath, markdownBuffer, "utf8");

  let savedImage: string | null = null;
  const imageFile = formData.get("image") as File | null;
  if (imageFile) {
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const fileName = `${slug}-${Date.now()}-${imageFile.name}`;
    const imagePath = path.join(uploadDir, fileName);
    await fs.writeFile(imagePath, imageBuffer);
    savedImage = `/uploads/${fileName}`;
  }

  return NextResponse.json({
    message: "保存成功（注意静态部署需重新构建才能生效）",
    contentPath,
    image: savedImage
  });
}

