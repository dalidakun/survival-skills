import { NextResponse } from "next/server";
import { getAllSkills } from "@/lib/content";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const password = url.searchParams.get("password");

    // 验证密码
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: "未授权" }, { status: 401 });
    }

    const skills = getAllSkills();
    return NextResponse.json({ articles: skills });
  } catch (error) {
    console.error("获取文章列表错误:", error);
    return NextResponse.json(
      { message: "获取失败，请稍后再试" },
      { status: 500 }
    );
  }
}

