"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ChevronDown, Lightbulb, Plus } from "lucide-react";

type KnowledgeItem = {
  id: string;
  title: string;
  category: string;
  problemDesc: string;
  solution: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

const categories = [
  { label: "全部", value: "all" },
  { label: "环境配置", value: "env" },
  { label: "账号权限", value: "permission" },
  { label: "命令行报错", value: "cli" },
  { label: "路径错误", value: "path" },
  { label: "部署失败", value: "deploy" },
  { label: "API配置", value: "api" },
  { label: "模型调用", value: "model" },
] as const;

const categoryMeta: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  env: { label: "环境配置", className: "bg-blue-100 text-blue-700" },
  permission: { label: "账号权限", className: "bg-red-100 text-red-700" },
  cli: { label: "命令行", className: "bg-orange-100 text-orange-700" },
  path: { label: "路径错误", className: "bg-yellow-100 text-yellow-700" },
  deploy: { label: "部署失败", className: "bg-purple-100 text-purple-700" },
  api: { label: "API配置", className: "bg-green-100 text-green-700" },
  model: { label: "模型调用", className: "bg-cyan-100 text-cyan-700" },
};

function getCategoryMeta(category: string) {
  return (
    categoryMeta[category] ?? {
      label: category,
      className: "bg-slate-100 text-slate-700",
    }
  );
}

function getSummary(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();

  return normalized.length > 60 ? `${normalized.slice(0, 60)}...` : normalized;
}

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchKnowledge() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/knowledge");

        if (!response.ok) {
          throw new Error("Failed to fetch knowledge");
        }

        const data = (await response.json()) as KnowledgeItem[];

        if (!ignore) {
          setItems(data);
        }
      } catch {
        if (!ignore) {
          setError("知识库加载失败，请稍后重试");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchKnowledge();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return items;
    }

    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            问题知识库
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            沉淀 AI 工具落地过程中的排错经验
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("功能开发中")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          <Plus className="size-4" strokeWidth={1.9} />
          新增条目
        </button>
      </header>

      <section className="mt-7 border-b border-slate-200">
        <div className="flex gap-6 overflow-x-auto">
          {categories.map((category) => {
            const active = activeCategory === category.value;

            return (
              <button
                key={category.value}
                type="button"
                onClick={() => setActiveCategory(category.value)}
                className={`border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-950"
                }`}
              >
                {category.label}
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

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-28 animate-pulse bg-slate-50" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Lightbulb className="h-16 w-16 text-slate-300" strokeWidth={1.7} />
            <h2 className="mt-5 text-lg font-medium text-slate-600">
              知识库暂无内容
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              记录第一条排错经验
            </p>
            <button
              type="button"
              onClick={() => alert("功能开发中")}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-blue-200 bg-white px-4 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              新增条目
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const category = getCategoryMeta(item.category);
              const expanded = expandedId === item.id;

              return (
                <article key={item.id}>
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : item.id)}
                    className="flex w-full items-start justify-between gap-5 px-5 py-5 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${category.className}`}
                        >
                          {category.label}
                        </span>
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex h-7 items-center rounded-full bg-slate-100 px-3 text-xs font-medium text-slate-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {getSummary(item.problemDesc)}
                      </p>
                    </div>

                    <ChevronDown
                      className={`mt-1 size-5 shrink-0 text-slate-400 transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                      strokeWidth={1.9}
                    />
                  </button>

                  {expanded ? (
                    <div className="px-5 pb-5">
                      <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                        <h3 className="text-sm font-semibold text-green-800">
                          解决方案
                        </h3>
                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-green-900">
                          {item.solution}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
