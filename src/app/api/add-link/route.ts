import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "item";
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

    const slug = slugify(title);
    const filePath = path.join(process.cwd(), "content", `${slug}.md`);
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

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, md, "utf8");

    return NextResponse.json({ message: "保存成功", slug, filePath });
  } catch (error) {
    console.error("保存错误:", error);
    return NextResponse.json(
      { message: "保存失败，请稍后再试" },
      { status: 500 }
    );
  }
}

