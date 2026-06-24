import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrismaClient();
    const items = await prisma.knowledgeItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch knowledge items", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrismaClient();
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
  } catch (error) {
    console.error("Failed to create knowledge item", error);
    return NextResponse.json(
      { error: "创建条目失败，请检查数据库配置" },
      { status: 500 },
    );
  }
}
