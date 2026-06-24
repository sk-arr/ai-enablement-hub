import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

type SceneStatItem = {
  scene: string | null;
  _count: {
    scene: number;
  };
};

export async function GET() {
  try {
    const prisma = getPrismaClient();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(now.setHours(0, 0, 0, 0));

    const [
      totalRecords,
      completedRecords,
      needsOptimizationRecords,
      totalTemplates,
      activeTemplates,
      totalKnowledge,
      todayRecords,
      weekRecords,
      sceneStats,
    ] = await Promise.all([
      prisma.executionRecord.count(),
      prisma.executionRecord.count({ where: { status: "completed" } }),
      prisma.executionRecord.count({ where: { status: "needs_optimization" } }),
      prisma.template.count(),
      prisma.template.count({ where: { isActive: true } }),
      prisma.knowledgeItem.count(),
      prisma.executionRecord.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.executionRecord.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.executionRecord.groupBy({
        by: ["scene"],
        _count: { scene: true },
        orderBy: { _count: { scene: "desc" } },
      }),
    ]);

    return NextResponse.json({
      totalRecords,
      completedRecords,
      needsOptimizationRecords,
      totalTemplates,
      activeTemplates,
      totalKnowledge,
      todayRecords,
      weekRecords,
      sceneStats: sceneStats.map((s: SceneStatItem) => ({
        scene: s.scene ?? "未分类",
        count: s._count.scene,
      })),
    });
  } catch {
    return NextResponse.json({ error: "获取统计数据失败" }, { status: 500 });
  }
}
