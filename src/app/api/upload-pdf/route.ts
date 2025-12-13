import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_OWNER = process.env.GITHUB_OWNER || "dalidakun";
const GITHUB_REPO = process.env.GITHUB_REPO || "survival-skills";

async function createOrUpdateFile(
  path: string,
  content: Buffer,
  message: string
) {
  // 检查文件是否已存在
  const checkResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: "GET",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  let sha: string | undefined;
  if (checkResponse.ok) {
    const data = await checkResponse.json();
    sha = data.sha;
  } else if (checkResponse.status !== 404) {
    throw new Error(`检查文件失败: ${checkResponse.statusText}`);
  }

  const body = {
    message,
    content: content.toString("base64"),
    ...(sha && { sha }),
  };

  const createResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!createResponse.ok) {
    const error = await createResponse.json();
    throw new Error(error.message || "提交到 GitHub 失败");
  }

  return createResponse.json();
}

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

    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { message: "GitHub Token 未配置，请在 Vercel 环境变量中添加 GITHUB_TOKEN" },
        { status: 500 }
      );
    }

    // 生成文件名（使用时间戳避免冲突）
    const timestamp = Date.now();
    const originalName = pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${originalName}`;
    
    // 读取 PDF 文件内容
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    
    // 通过 GitHub API 保存到 public/pdfs 目录
    const filePath = `public/pdfs/${fileName}`;
    await createOrUpdateFile(
      filePath,
      pdfBuffer,
      `Upload PDF: ${originalName}`
    );

    // 生成可访问的 URL
    const pdfUrl = `/pdfs/${fileName}`;

    return NextResponse.json({
      message: "上传成功！PDF 已提交到 GitHub，Vercel 会自动重新部署（约 1-2 分钟）。",
      url: pdfUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("PDF 上传错误:", error);
    const message =
      error instanceof Error ? error.message : "上传失败，请稍后再试";
    return NextResponse.json({ message }, { status: 500 });
  }
}

