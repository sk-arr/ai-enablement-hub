import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrismaClient();
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(templates);
  } catch {
    return NextResponse.json({ error: "获取模板失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const body = await request.json();
    const template = await prisma.template.create({
      data: {
        name: body.name,
        category: body.category,
        description: body.description ?? null,
        content: body.content,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(template, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建模板失败" }, { status: 500 });
  }
}
