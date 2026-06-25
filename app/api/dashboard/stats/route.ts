import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

type SceneStatItem = {
  scene: string | null;
  _count: {
    scene: number;
  };
};

type Period = "today" | "week" | "all";

export async function GET(request: Request) {
  try {
    const prisma = getPrismaClient();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const url = new URL(request.url);
    const rawPeriod = url.searchParams.get("period");
    const period: Period =
      rawPeriod === "today" || rawPeriod === "week" || rawPeriod === "all"
        ? rawPeriod
        : "all";
    const periodWhere =
      period === "today"
        ? { createdAt: { gte: todayStart } }
        : period === "week"
          ? { createdAt: { gte: weekAgo } }
          : {};

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
      prisma.executionRecord.count({ where: periodWhere }),
      prisma.executionRecord.count({
        where: { ...periodWhere, status: "completed" },
      }),
      prisma.executionRecord.count({
        where: { ...periodWhere, status: "needs_optimization" },
      }),
      prisma.template.count(),
      prisma.template.count({ where: { isActive: true } }),
      prisma.knowledgeItem.count(),
      prisma.executionRecord.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.executionRecord.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.executionRecord.groupBy({
        by: ["scene"],
        where: periodWhere,
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
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
    return NextResponse.json({
      totalRecords: 0,
      completedRecords: 0,
      needsOptimizationRecords: 0,
      totalTemplates: 0,
      activeTemplates: 0,
      totalKnowledge: 0,
      todayRecords: 0,
      weekRecords: 0,
      sceneStats: [],
    });
  }
}
