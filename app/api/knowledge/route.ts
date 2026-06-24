import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.knowledgeItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "获取知识库失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await prisma.knowledgeItem.create({
      data: {
        title: body.title,
        category: body.category,
        problemDesc: body.problemDesc,
        solution: body.solution,
        tags: body.tags ?? [],
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建条目失败" }, { status: 500 });
  }
}
