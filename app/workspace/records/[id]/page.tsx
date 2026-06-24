"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileText,
  Lightbulb,
  ListChecks,
  Loader2,
  Sparkles,
  Star,
  Target,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ExecutionRecord, GeneratedPlan, RecordStatus, SceneId } from "@/types";

type RecordItem = ExecutionRecord & {
  score?: number | null;
  notes?: string | null;
};

type RecordPatchPayload = {
  status?: RecordStatus;
  score?: number | null;
  notes?: string;
};

const statusOptions: { label: string; value: RecordStatus }[] = [
  { label: "待处理", value: "pending" },
  { label: "生成中", value: "generating" },
  { label: "已完成", value: "completed" },
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

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const pad = (num: number) => String(num).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function PlanCard({
  title,
  accentClassName,
  titleClassName = "text-slate-950",
  icon: Icon,
  children,
}: {
  title: string;
  accentClassName: string;
  titleClassName?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-9 items-center justify-center rounded-lg ${accentClassName}`}
        >
          <Icon className="size-4" strokeWidth={2} />
        </div>
        <h2 className={`text-base font-semibold tracking-tight ${titleClassName}`}>
          {title}
        </h2>
      </div>
      <div className="mt-4 text-sm leading-6 text-slate-600">{children}</div>
    </section>
  );
}

function parseGeneratedPlan(outputContent: string) {
  try {
    return JSON.parse(outputContent) as GeneratedPlan;
  } catch {
    return null;
  }
}

export default function RecordDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [record, setRecord] = useState<RecordItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<RecordStatus>("pending");
  const [score, setScore] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [savingField, setSavingField] = useState<"status" | "score" | "notes" | null>(
    null,
  );

  useEffect(() => {
    let ignore = false;

    async function fetchRecord() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/records/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch record");
        }

        const data = (await response.json()) as RecordItem;

        if (!ignore) {
          setRecord(data);
          setStatus(data.status);
          setScore(data.score ?? null);
          setNotes(data.notes ?? "");
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

    fetchRecord();

    return () => {
      ignore = true;
    };
  }, [id]);

  const parsedPlan = useMemo(() => {
    if (!record) {
      return null;
    }

    return parseGeneratedPlan(record.outputContent);
  }, [record]);

  async function patchRecord(data: RecordPatchPayload) {
    const response = await fetch(`/api/records/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Update failed");
    }

    const updated = (await response.json()) as RecordItem;
    setRecord(updated);
    setStatus(updated.status);
    setScore(updated.score ?? null);
    setNotes(updated.notes ?? "");
  }

  async function handleSaveStatus() {
    try {
      setSavingField("status");
      await patchRecord({ status });
    } catch {
      alert("状态更新失败，请重试");
    } finally {
      setSavingField(null);
    }
  }

  async function handleSaveScore() {
    try {
      setSavingField("score");
      await patchRecord({ score });
    } catch {
      alert("评分保存失败，请重试");
    } finally {
      setSavingField(null);
    }
  }

  async function handleSaveNotes() {
    try {
      setSavingField("notes");
      await patchRecord({ notes });
    } catch {
      alert("备注保存失败，请重试");
    } finally {
      setSavingField(null);
    }
  }

  async function handleCopyPrompt() {
    if (!parsedPlan?.promptTemplate) {
      return;
    }

    try {
      await navigator.clipboard.writeText(parsedPlan.promptTemplate);
    } catch {
      alert("复制失败，请手动复制");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        <Loader2 className="mr-2 size-4 animate-spin" />
        正在加载执行记录...
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="px-6 py-8 sm:px-8 lg:px-10">
        <Link
          href="/workspace/records"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← 返回列表
        </Link>
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="size-4" strokeWidth={1.9} />
          {error || "记录不存在"}
        </div>
      </div>
    );
  }

  const scene = sceneMeta[record.scene as SceneId] ?? {
    label: record.scene,
    className: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <div className="mb-6">
        <Link
          href="/workspace/records"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← 返回列表
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
          {record.title}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight text-slate-950">
              基本信息
            </h2>
            <div className="mt-5 space-y-4 text-sm">
              <div>
                <div className="mb-2 text-slate-500">场景</div>
                <span
                  className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${scene.className}`}
                >
                  {scene.label}
                </span>
              </div>
              <label className="block">
                <span className="mb-2 block text-slate-500">状态</span>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value as RecordStatus)}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <div className="mb-1 text-slate-500">负责人</div>
                <div className="text-slate-950">{record.owner}</div>
              </div>
              <div>
                <div className="mb-1 text-slate-500">创建时间</div>
                <div className="text-slate-950">{formatDateTime(record.createdAt)}</div>
              </div>
              <div>
                <div className="mb-1 text-slate-500">更新时间</div>
                <div className="text-slate-950">{formatDateTime(record.updatedAt)}</div>
              </div>
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={savingField === "status"}
                className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {savingField === "status" ? "更新中..." : "更新状态"}
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight text-slate-950">
              评分
            </h2>
            <div className="mt-5 flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScore(value)}
                  className="text-2xl text-amber-400 transition-transform hover:scale-110"
                  aria-label={`${value} 分`}
                >
                  <Star
                    className={`size-7 ${
                      score && value <= score ? "fill-amber-400" : "fill-none"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSaveScore}
              disabled={savingField === "score"}
              className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {savingField === "score" ? "保存中..." : "保存评分"}
            </button>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight text-slate-950">
              备注
            </h2>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={5}
              className="mt-5 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="补充执行反馈、优化建议或复盘结论"
            />
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={savingField === "notes"}
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {savingField === "notes" ? "保存中..." : "保存备注"}
            </button>
          </section>
        </aside>

        <main>
          <h2 className="mb-5 text-2xl font-semibold tracking-tight text-slate-950">
            执行方案
          </h2>

          {!parsedPlan ? (
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {record.outputContent}
              </pre>
            </section>
          ) : (
            <div className="grid gap-5">
              <PlanCard
                title="需求理解"
                accentClassName="bg-emerald-50 text-emerald-600"
                titleClassName="text-emerald-700"
                icon={Sparkles}
              >
                <p>{parsedPlan.summary}</p>
              </PlanCard>

              <PlanCard title="目标拆解" accentClassName="bg-blue-50 text-blue-600" icon={Target}>
                <ul className="space-y-2">
                  {parsedPlan.goals.map((goal) => (
                    <li key={goal} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-500" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </PlanCard>

              <PlanCard title="推荐 AI 工具" accentClassName="bg-purple-50 text-purple-600" icon={Wrench}>
                <div className="space-y-3">
                  {parsedPlan.recommendedTools.map((tool) => (
                    <div
                      key={tool.name}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
                    >
                      <div className="font-medium text-slate-900">{tool.name}</div>
                      <div className="mt-1 text-slate-600">{tool.description}</div>
                    </div>
                  ))}
                </div>
              </PlanCard>

              <PlanCard title="执行步骤" accentClassName="bg-orange-50 text-orange-600" icon={ListChecks}>
                <div className="space-y-4">
                  {parsedPlan.steps.map((step) => (
                    <div key={step.number} className="flex gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700">
                        {step.number}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{step.title}</div>
                        <div className="mt-1 text-slate-600">{step.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </PlanCard>

              <PlanCard title="Prompt 模板" accentClassName="bg-cyan-50 text-cyan-600" icon={FileText}>
                <div className="mb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="inline-flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <Copy className="size-3.5" />
                    复制
                  </button>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                  {parsedPlan.promptTemplate}
                </pre>
              </PlanCard>

              <PlanCard
                title="风险提醒"
                accentClassName="bg-orange-50 text-orange-600"
                titleClassName="text-orange-700"
                icon={AlertCircle}
              >
                <ul className="space-y-2 rounded-lg bg-orange-50 p-4">
                  {parsedPlan.risks.map((risk) => (
                    <li key={risk} className="flex gap-2 text-orange-900">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-400" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </PlanCard>

              <PlanCard title="验收标准" accentClassName="bg-green-50 text-green-600" icon={ClipboardCheck}>
                <ul className="space-y-2">
                  {parsedPlan.acceptanceCriteria.map((criterion) => (
                    <li key={criterion} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </PlanCard>

              <PlanCard title="后续优化建议" accentClassName="bg-pink-50 text-pink-600" icon={Lightbulb}>
                <ul className="space-y-2">
                  {parsedPlan.optimizationSuggestions.map((suggestion) => (
                    <li key={suggestion} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-pink-400" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </PlanCard>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
