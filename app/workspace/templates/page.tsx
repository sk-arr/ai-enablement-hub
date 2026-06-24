"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, FileText, Plus } from "lucide-react";

type Template = {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  content: string;
  isActive: boolean;
  useCount: number;
  createdAt: string;
  updatedAt: string;
};

type CategoryValue = "all" | "workflow" | "prompt" | "sop" | "debug" | "delivery";

const categories: { label: string; value: CategoryValue }[] = [
  { label: "全部", value: "all" },
  { label: "工作流模板", value: "workflow" },
  { label: "Prompt模板", value: "prompt" },
  { label: "SOP模板", value: "sop" },
  { label: "排错模板", value: "debug" },
  { label: "交付文档", value: "delivery" },
];

const categoryMeta: Record<
  Exclude<CategoryValue, "all">,
  {
    label: string;
    className: string;
  }
> = {
  workflow: { label: "工作流", className: "bg-blue-100 text-blue-700" },
  prompt: { label: "Prompt", className: "bg-purple-100 text-purple-700" },
  sop: { label: "SOP", className: "bg-green-100 text-green-700" },
  debug: { label: "排错", className: "bg-orange-100 text-orange-700" },
  delivery: { label: "交付文档", className: "bg-slate-100 text-slate-700" },
};

function getCategoryMeta(category: string) {
  return (
    categoryMeta[category as Exclude<CategoryValue, "all">] ?? {
      label: category,
      className: "bg-slate-100 text-slate-700",
    }
  );
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryValue>("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function fetchTemplates() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/templates");

        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }

        const data = (await response.json()) as Template[];

        if (!ignore) {
          setTemplates(data);
        }
      } catch {
        if (!ignore) {
          setError("模板数据加载失败，请稍后重试");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchTemplates();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") {
      return templates;
    }

    return templates.filter((template) => template.category === activeCategory);
  }, [activeCategory, templates]);

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            模板库
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            管理可复用的工作流、Prompt 和 SOP 模板
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("功能开发中")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          <Plus className="size-4" strokeWidth={1.9} />
          新增模板
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

      <section className="mt-6">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <div className="flex max-w-sm flex-col items-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 ring-1 ring-slate-200">
                <FileText className="size-8" strokeWidth={1.7} />
              </div>
              <h2 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">
                暂无模板
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                当前分类下还没有可用模板。
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => {
              const category = getCategoryMeta(template.category);

              return (
                <article
                  key={template.id}
                  className="relative rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex justify-end">
                    <span
                      className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${category.className}`}
                    >
                      {category.label}
                    </span>
                  </div>

                  <h2 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
                    {template.name}
                  </h2>
                  <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
                    {template.description || "暂无模板描述"}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                    <span className="text-slate-500">
                      使用 {template.useCount} 次
                    </span>
                    <span
                      className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${
                        template.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {template.isActive ? "启用" : "停用"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
