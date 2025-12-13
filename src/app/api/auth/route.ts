import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { message: "密码错误" },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: "验证成功" });
  } catch (error) {
    return NextResponse.json(
      { message: "验证失败" },
      { status: 500 }
    );
  }
}

