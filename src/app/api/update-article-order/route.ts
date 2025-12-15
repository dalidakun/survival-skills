import { NextResponse } from "next/server";
import matter from "gray-matter";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_OWNER = process.env.GITHUB_OWNER || "dalidakun";
const GITHUB_REPO = process.env.GITHUB_REPO || "survival-skills";

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

  if (!checkResponse.ok) {
    if (checkResponse.status === 404) {
      throw new Error("文章不存在");
    }
    const errorText = await checkResponse.text();
    throw new Error(`检查文件失败: ${checkResponse.statusText} - ${errorText}`);
  }

  const fileData = await checkResponse.json();
  const sha = fileData.sha;

  const body = {
    message,
    content: Buffer.from(content).toString("base64"),
    sha,
  };

  const updateResponse = await fetch(
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

  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    let errorMessage = "更新失败";
    try {
      const error = JSON.parse(errorText);
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return updateResponse.json();
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const password = formData.get("password");
    const slug = String(formData.get("slug") || "").trim();
    const orderStr = String(formData.get("order") || "").trim();

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

    // 解析 order（如果为空字符串，则删除 order 字段）
    let order: number | null = null;
    if (orderStr !== "") {
      const orderNum = Number(orderStr);
      if (isNaN(orderNum)) {
        return NextResponse.json({ message: "排序值必须是数字" }, { status: 400 });
      }
      order = orderNum;
    }

    // 获取现有文件内容
    const filePath = `content/${slug}.md`;
    const getResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!getResponse.ok) {
      if (getResponse.status === 404) {
        return NextResponse.json({ message: "文章不存在" }, { status: 404 });
      }
      const errorText = await getResponse.text();
      throw new Error(`获取文件失败: ${getResponse.statusText} - ${errorText}`);
    }

    const fileData = await getResponse.json();
    const existingContent = Buffer.from(fileData.content, "base64").toString("utf8");

    // 解析 frontmatter
    const { data, content: bodyContent } = matter(existingContent);

    // 更新 order 字段
    if (order !== null) {
      data.order = order;
    } else {
      // 删除 order 字段
      delete data.order;
    }

    // 重新构建 markdown 内容
    const updatedMd = matter.stringify(bodyContent, data);

    // 更新文件
    await createOrUpdateFile(
      filePath,
      updatedMd,
      `Update article order: ${order !== null ? order : 'remove order'}`
    );

    return NextResponse.json({
      message: "排序更新成功！文件已提交到 GitHub，Vercel 会自动重新部署（约 1-2 分钟）。",
      slug,
      order: order !== null ? order : undefined,
    });
  } catch (error) {
    console.error("更新排序错误:", error);
    const message =
      error instanceof Error ? error.message : "更新失败，请稍后再试";
    return NextResponse.json({ message }, { status: 500 });
  }
}

