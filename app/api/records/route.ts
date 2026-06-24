import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma = getPrismaClient();
    const records = await prisma.executionRecord.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Failed to fetch records", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrismaClient();
    const body = await request.json();
    const record = await prisma.executionRecord.create({
      data: {
        title: body.title,
        scene: body.scene,
        inputContent: body.inputContent,
        outputContent: body.outputContent,
        status: body.status ?? "completed",
        owner: body.owner ?? "演示用户",
        score: body.score ?? null,
        notes: body.notes ?? null,
      },
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Failed to create record", error);
    return NextResponse.json(
      { error: "创建记录失败，请检查数据库配置" },
      { status: 500 },
    );
  }
}
