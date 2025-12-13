import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_OWNER = process.env.GITHUB_OWNER || "dalidakun";
const GITHUB_REPO = process.env.GITHUB_REPO || "survival-skills";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "item";
}

async function createOrUpdateFile(
  path: string,
  content: string,
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
    content: Buffer.from(content).toString("base64"),
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
    const title = String(formData.get("title") || "").trim();
    const link = String(formData.get("link") || "").trim();

    // 验证密码
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    if (!title || !link) {
      return NextResponse.json({ message: "标题和链接必填" }, { status: 400 });
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { message: "GitHub Token 未配置，请在 Vercel 环境变量中添加 GITHUB_TOKEN" },
        { status: 500 }
      );
    }

    const slug = slugify(title);
    const filePath = `content/${slug}.md`;
    const md = `---
slug: ${slug}
title: ${title}
subtitle:
image:
link: ${link}
intro: ""
principle: ""
steps: []
safety: ""
tips: []
related: []
---
`;

    await createOrUpdateFile(
      filePath,
      md,
      `Add article: ${title}`
    );

    return NextResponse.json({
      message: "保存成功！文件已提交到 GitHub，Vercel 会自动重新部署（约 1-2 分钟）。",
      slug,
      filePath,
    });
  } catch (error) {
    console.error("保存错误:", error);
    const message =
      error instanceof Error ? error.message : "保存失败，请稍后再试";
    return NextResponse.json({ message }, { status: 500 });
  }
}

