"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  FileText,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DashboardStats = {
  totalRecords: number;
  completedRecords: number;
  needsOptimizationRecords: number;
  totalTemplates: number;
  activeTemplates: number;
  totalKnowledge: number;
  todayRecords: number;
  weekRecords: number;
  sceneStats: { scene: string; count: number }[];
};

type Period = "today" | "week" | "all";

const periodOptions: { label: string; value: Period }[] = [
  { label: "今日", value: "today" },
  { label: "本周", value: "week" },
  { label: "全部", value: "all" },
];

const sceneShortNameMap: Record<string, string> = {
  workflow: "工作流",
  prompt: "Prompt",
  coding: "编程",
  debug: "排查",
  meeting: "会议",
  content: "内容",
};

const statCards = [
  {
    key: "totalRecords",
    label: "总执行次数",
    icon: Zap,
    color: "bg-blue-50 text-blue-600",
  },
  {
    key: "completedRecords",
    label: "已完成任务",
    icon: CheckCircle,
    color: "bg-green-50 text-green-600",
  },
  {
    key: "needsOptimizationRecords",
    label: "需优化任务",
    icon: AlertCircle,
    color: "bg-orange-50 text-orange-600",
  },
  {
    key: "totalTemplates",
    label: "模板总数",
    icon: FileText,
    color: "bg-purple-50 text-purple-600",
  },
  {
    key: "totalKnowledge",
    label: "知识库条目",
    icon: BookOpen,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    key: "weekRecords",
    label: "本周新增",
    icon: TrendingUp,
    color: "bg-pink-50 text-pink-600",
  },
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<Period>("all");

  useEffect(() => {
    let ignore = false;

    async function fetchStats() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/dashboard/stats?period=${period}`);

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = (await response.json()) as DashboardStats;

        if (!ignore) {
          setStats(data);
        }
      } catch {
        if (!ignore) {
          setError("数据看板加载失败，请稍后重试");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchStats();

    return () => {
      ignore = true;
    };
  }, [period]);

  const chartData = useMemo(() => {
    return (
      stats?.sceneStats.map((item) => ({
        scene: sceneShortNameMap[item.scene] ?? item.scene,
        count: item.count,
      })) ?? []
    );
  }, [stats]);

  const completionRate = stats?.totalRecords
    ? Math.round((stats.completedRecords / stats.totalRecords) * 100)
    : 0;

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            数据看板
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            实时统计 AI 提效工作台的使用数据
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          {periodOptions.map((option) => {
            const active = period === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setPeriod(option.value)}
                className={`h-9 rounded-md px-4 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </header>

      {error ? (
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="size-4" strokeWidth={1.9} />
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-slate-100" />
            <div className="h-96 animate-pulse rounded-lg border border-slate-200 bg-slate-100" />
          </div>
        </div>
      ) : stats ? (
        <>
          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {statCards.map((card) => {
              const Icon = card.icon;
              const value = stats[card.key];

              return (
                <article
                  key={card.key}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl ${card.color}`}
                  >
                    <Icon className="size-6" strokeWidth={1.9} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight text-slate-950">
                      {value}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">{card.label}</div>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                场景使用频率
              </h2>
              <div className="mt-5 h-80">
                {chartData.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                    暂无统计数据
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="scene" tickLine={false} axisLine={false} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </article>

            <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                本周概览
              </h2>
              <div className="mt-6 grid gap-4">
                <div className="rounded-lg bg-blue-50 p-5">
                  <div className="text-sm font-medium text-blue-700">今日执行</div>
                  <div className="mt-2 text-4xl font-bold tracking-tight text-blue-900">
                    {stats.todayRecords}
                  </div>
                </div>
                <div className="rounded-lg bg-pink-50 p-5">
                  <div className="text-sm font-medium text-pink-700">本周执行</div>
                  <div className="mt-2 text-4xl font-bold tracking-tight text-pink-900">
                    {stats.weekRecords}
                  </div>
                </div>
                <div className="rounded-lg bg-green-50 p-5">
                  <div className="text-sm font-medium text-green-700">完成率</div>
                  <div className="mt-2 text-4xl font-bold tracking-tight text-green-900">
                    {completionRate}%
                  </div>
                </div>
              </div>
            </article>
          </section>
        </>
      ) : (
        <div className="mt-8 flex min-h-[320px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          暂无统计数据
        </div>
      )}
    </div>
  );
}
