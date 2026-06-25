"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  DatabaseZap,
  FileText,
  GitBranch,
  Library,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const painPoints: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Network,
    title: "工具各自为战",
    description: "团队成员各用各的 AI 工具，经验无法沉淀，换个人就要从零开始",
  },
  {
    icon: ClipboardList,
    title: "执行缺乏追踪",
    description: "不知道哪些 AI 方案真正有效，没有记录，没有数据，无法优化",
  },
  {
    icon: BookOpen,
    title: "知识散落各处",
    description: "排错经验藏在聊天记录里，每次遇到问题都要重新摸索",
  },
];

const solutionModules: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: Workflow,
    title: "AI 工作流工具台",
    description: "选场景、填需求、生成结构化执行方案",
  },
  {
    icon: FileText,
    title: "Prompt 模板库",
    description: "管理可复用 Prompt，分类存储，一键调用",
  },
  {
    icon: DatabaseZap,
    title: "执行记录管理",
    description: "每次执行自动存档，支持状态追踪和评分",
  },
  {
    icon: Library,
    title: "问题知识库",
    description: "沉淀排错经验，分类检索，团队共享",
  },
  {
    icon: BarChart3,
    title: "数据看板",
    description: "实时统计执行数据，洞察高频场景和模板复用率",
  },
  {
    icon: ShieldCheck,
    title: "演示登录系统",
    description: "完整的 B 端产品登录体验，一键进入工作台",
  },
];

const stats = [
  { key: "totalRecords", label: "条执行记录" },
  { key: "totalTemplates", label: "类模板管理" },
  { key: "totalKnowledge", label: "类问题知识库" },
] as const;

type HomeStats = {
  totalRecords: number;
  totalTemplates: number;
  totalKnowledge: number;
};

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
      <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-8 text-slate-600 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function CardIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex size-11 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
      <Icon className="size-5" strokeWidth={1.8} />
    </div>
  );
}

function CountUpNumber({
  value,
  loading,
}: {
  value?: number;
  loading: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (loading || value == null) {
      const resetTimer = window.setTimeout(() => setDisplayValue(0), 0);

      return () => {
        window.clearTimeout(resetTimer);
      };
    }

    if (value === 0) {
      const resetTimer = window.setTimeout(() => setDisplayValue(0), 0);

      return () => {
        window.clearTimeout(resetTimer);
      };
    }

    let current = 0;
    const increment = value / 60;

    const timer = window.setInterval(() => {
      current += increment;

      if (current >= value) {
        setDisplayValue(value);
        window.clearInterval(timer);
        return;
      }

      setDisplayValue(Math.round(current));
    }, 25);

    return () => {
      window.clearInterval(timer);
    };
  }, [loading, value]);

  if (loading || value == null) {
    return "--";
  }

  return displayValue;
}

export default function Home() {
  const [homeStats, setHomeStats] = useState<HomeStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchHomeStats() {
      try {
        setStatsLoading(true);

        const response = await fetch("/api/dashboard/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = (await response.json()) as HomeStats;

        if (!ignore) {
          setHomeStats({
            totalRecords: data.totalRecords,
            totalTemplates: data.totalTemplates,
            totalKnowledge: data.totalKnowledge,
          });
        }
      } catch {
        if (!ignore) {
          setHomeStats(null);
        }
      } finally {
        if (!ignore) {
          setStatsLoading(false);
        }
      }
    }

    fetchHomeStats();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex flex-col gap-0.5">
            <span className="text-base font-semibold tracking-tight text-slate-950">
              AI Enablement Hub
            </span>
            <span className="text-xs text-slate-500">企业 AI 提效工作台</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href="#features" className="transition-colors hover:text-blue-600">
              功能
            </Link>
            <Link href="#scenes" className="transition-colors hover:text-blue-600">
              场景
            </Link>
            <Link href="#about" className="transition-colors hover:text-blue-600">
              关于
            </Link>
          </nav>

          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            进入工作台
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white px-5 pb-20 pt-32 sm:px-6 md:pb-24 md:pt-40 lg:px-8">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-100 opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-100 opacity-40 blur-3xl" />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <Sparkles className="size-4 text-blue-600" strokeWidth={1.8} />
            面向小团队的 AI 落地管理平台
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.08]">
            让 AI 从“随便用”变成团队的生产力系统
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl md:leading-9">
            AI Enablement Hub 帮助小团队统一管理 AI 工作流、Prompt 模板、执行记录与效果数据，让 AI
            提效真正可复用、可追踪、可沉淀。
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-6 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              立即体验 Demo
            </Link>
            <Link
              href="#features"
              className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-base font-medium text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              了解更多
            </Link>
          </div>

          <div className="mt-14 grid w-full max-w-4xl grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-3 sm:p-6">
            {stats.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center rounded-xl bg-white px-5 py-6 text-center shadow-sm ring-1 ring-slate-200/70"
              >
                <span className="text-4xl font-semibold tracking-tight text-blue-600">
                  <CountUpNumber
                    value={homeStats?.[item.key]}
                    loading={statsLoading}
                  />
                </span>
                <span className="mt-2 text-sm font-medium text-slate-600">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="scenes" className="scroll-mt-24 px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading title="企业 AI 落地，卡在哪里？" />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {painPoints.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <CardIcon icon={item.icon} />
                <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="scroll-mt-24 bg-slate-50 px-5 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="一个平台，管理 AI 落地全过程"
            description="从场景选择、模板沉淀到执行追踪和数据复盘，把零散 AI 使用变成团队可复制的工作系统。"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {solutionModules.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <CardIcon icon={item.icon} />
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl bg-blue-600 px-6 py-16 text-center sm:px-10 lg:px-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center">
            <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-white/15 text-white">
              <Rocket className="size-6" strokeWidth={1.8} />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              准备好让 AI 真正为团队创造价值了吗？
            </h2>
            <p className="mt-5 text-base leading-8 text-blue-50 md:text-lg">
              立即体验演示版本，感受企业 AI 提效工作台的完整流程
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-base font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
            >
              立即体验 Demo
            </Link>
          </div>
        </div>
      </section>

      <footer id="about" className="scroll-mt-24 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 border-b border-white/10 pb-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                AI Enablement Hub
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                为 AI-native 团队打造的轻量级 AI 工作流、模板、记录与知识管理工作台。
              </p>
            </div>

            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              <GitBranch className="size-4" strokeWidth={1.8} />
              进入工作台
            </Link>
          </div>

          <p className="pt-8 text-center text-sm text-slate-400">
            © 2024 AI Enablement Hub. Built for AI-native teams.
          </p>
        </div>
      </footer>
    </main>
  );
}
