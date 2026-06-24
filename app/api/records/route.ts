import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const records = await prisma.executionRecord.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(records);
  } catch {
    return NextResponse.json({ error: "获取记录失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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
  } catch {
    return NextResponse.json({ error: "创建记录失败" }, { status: 500 });
  }
}
