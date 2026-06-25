"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Clock, FileText, Plus, UserRound } from "lucide-react";
import type { ExecutionRecord, RecordStatus, SceneId } from "@/types";

type RecordItem = ExecutionRecord & {
  score?: number | null;
  notes?: string | null;
};

type TabValue = "all" | "completed" | "pending" | "needs_optimization" | "archived";

const tabs: { label: string; value: TabValue }[] = [
  { label: "全部", value: "all" },
  { label: "已完成", value: "completed" },
  { label: "待处理", value: "pending" },
  { label: "需优化", value: "needs_optimization" },
  { label: "已归档", value: "archived" },
];

const sceneMeta: Record<
  SceneId,
  {
    label: string;
    className: string;
  }
> = {
  workflow: { label: "业务需求转工作流", className: "bg-blue-100 text-blue-700" },
  prompt: { label: "Prompt 模板生成", className: "bg-purple-100 text-purple-700" },
  coding: { label: "AI 编程工具部署", className: "bg-green-100 text-green-700" },
  debug: { label: "问题排查", className: "bg-orange-100 text-orange-700" },
  meeting: { label: "会议纪要整理", className: "bg-cyan-100 text-cyan-700" },
  content: { label: "内容运营提效", className: "bg-pink-100 text-pink-700" },
};

const statusMeta: Record<
  RecordStatus,
  {
    label: string;
    className: string;
  }
> = {
  completed: { label: "已完成", className: "bg-green-100 text-green-700" },
  pending: { label: "待处理", className: "bg-gray-100 text-gray-600" },
  needs_optimization: { label: "需优化", className: "bg-orange-100 text-orange-700" },
  archived: { label: "已归档", className: "bg-slate-100 text-slate-600" },
  generating: { label: "生成中", className: "bg-blue-100 text-blue-700" },
};

function formatRecordTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const pad = (num: number) => String(num).padStart(2, "0");

  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

function getSummary(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();

  return normalized.length > 80 ? `${normalized.slice(0, 80)}...` : normalized;
}

function getStars(score: number) {
  return "★".repeat(Math.max(0, Math.min(5, score)));
}

export default function RecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchRecords() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/records");

        if (!response.ok) {
          throw new Error("Failed to fetch records");
        }

        const data = (await response.json()) as RecordItem[];

        if (!ignore) {
          setRecords(data);
        }
      } catch {
        if (!ignore) {
          setError("执行记录加载失败，请稍后重试");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchRecords();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredRecords = useMemo(() => {
    if (activeTab === "all") {
      return records;
    }

    return records.filter((record) => record.status === activeTab);
  }, [activeTab, records]);

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            执行记录
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            查看和管理所有 AI 执行方案记录
          </p>
        </div>

        <Link
          href="/workspace"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          <Plus className="size-4" strokeWidth={1.9} />
          新建方案
        </Link>
      </header>

      <section className="mt-7 border-b border-slate-200">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const active = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-950"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {error ? (
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="size-4" strokeWidth={1.9} />
          {error}
        </div>
      ) : null}

      <section className="mt-6">
        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white py-24 text-center">
            <FileText className="h-16 w-16 text-slate-300" strokeWidth={1.7} />
            <h2 className="mt-5 text-lg font-medium text-slate-600">
              还没有执行记录
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              去生成你的第一个 AI 执行方案吧
            </p>
            <button
              type="button"
              onClick={() => router.push("/workspace")}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-blue-200 bg-white px-4 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              去生成方案
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRecords.map((record) => {
              const scene = sceneMeta[record.scene as SceneId] ?? {
                label: record.scene,
                className: "bg-slate-100 text-slate-700",
              };
              const status = statusMeta[record.status as RecordStatus] ?? {
                label: record.status,
                className: "bg-slate-100 text-slate-700",
              };

              return (
                <Link
                  key={record.id}
                  href={`/workspace/records/${record.id}`}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${scene.className}`}
                    >
                      {scene.label}
                    </span>
                    <span
                      className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                    {record.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {getSummary(record.inputContent)}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <UserRound className="size-4" strokeWidth={1.8} />
                      {record.owner}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-4" strokeWidth={1.8} />
                      {formatRecordTime(record.createdAt)}
                    </span>
                    {record.score != null ? (
                      <span className="font-medium text-amber-500">
                        {getStars(record.score)}
                      </span>
                    ) : null}
                  </div>

                  {record.notes ? (
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                      {record.notes}
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
