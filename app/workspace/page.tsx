"use client";

import { AI_SCENES } from "@/lib/constants";
import {
  ArrowRight,
  ClipboardList,
  Code2,
  FileText,
  Rocket,
  Workflow,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type Scene = (typeof AI_SCENES)[number];
type SceneIconName = Scene["icon"];
type SceneColor = Scene["color"];

const sceneIconMap: Record<SceneIconName, LucideIcon> = {
  Workflow,
  FileText,
  Code2,
  Wrench,
  ClipboardList,
  Rocket,
};

const sceneColorMap: Record<SceneColor, string> = {
  blue: "bg-blue-50 text-blue-500",
  purple: "bg-purple-50 text-purple-500",
  green: "bg-green-50 text-green-500",
  orange: "bg-orange-50 text-orange-500",
  cyan: "bg-cyan-50 text-cyan-500",
  pink: "bg-pink-50 text-pink-500",
};

export default function WorkspacePage() {
  const router = useRouter();

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          选择 AI 提效场景
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          选择一个场景，填写业务需求，生成结构化执行方案
        </p>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {AI_SCENES.map((scene) => {
          const Icon = sceneIconMap[scene.icon];

          return (
            <button
              key={scene.id}
              type="button"
              onClick={() => router.push(`/workspace/generate?scene=${scene.id}`)}
              className="group flex min-h-64 flex-col rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <div
                className={`flex size-12 items-center justify-center rounded-xl ${sceneColorMap[scene.color]}`}
              >
                <Icon className="size-6" strokeWidth={1.9} />
              </div>

              <div className="mt-6 flex-1">
                <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                  {scene.name}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {scene.description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600">
                <span>开始使用</span>
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.9}
                />
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}
