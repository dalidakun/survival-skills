import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_OWNER = process.env.GITHUB_OWNER || "dalidakun";
const GITHUB_REPO = process.env.GITHUB_REPO || "survival-skills";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const password = formData.get("password");
    const slug = String(formData.get("slug") || "").trim();

    // 验证密码
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ message: "文章标识不能为空" }, { status: 400 });
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { message: "GitHub Token 未配置" },
        { status: 500 }
      );
    }

    // 检查文件是否存在
    const filePath = `content/${slug}.md`;
    const checkResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!checkResponse.ok) {
      if (checkResponse.status === 404) {
        return NextResponse.json({ message: "文章不存在" }, { status: 404 });
      }
      throw new Error(`检查文件失败: ${checkResponse.statusText}`);
    }

    const fileData = await checkResponse.json();
    const sha = fileData.sha;

    // 删除文件
    const deleteResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Delete article: ${slug}`,
          sha: sha,
        }),
      }
    );

    if (!deleteResponse.ok) {
      const error = await deleteResponse.json();
      throw new Error(error.message || "删除失败");
    }

    return NextResponse.json({
      message: "删除成功！文件已从 GitHub 删除，Vercel 会自动重新部署（约 1-2 分钟）。",
      slug,
    });
  } catch (error) {
    console.error("删除错误:", error);
    const message =
      error instanceof Error ? error.message : "删除失败，请稍后再试";
    return NextResponse.json({ message }, { status: 500 });
  }
}

