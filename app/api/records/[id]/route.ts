import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const record = await prisma.executionRecord.findUnique({
      where: { id },
    });
    if (!record) {
      return NextResponse.json({ error: "记录不存在" }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "获取记录失败" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const record = await prisma.executionRecord.update({
      where: { id },
      data: {
        status: body.status,
        score: body.score,
        notes: body.notes,
      },
    });
    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: "更新记录失败" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    await prisma.executionRecord.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "删除记录失败" }, { status: 500 });
  }
}
