"use client";

import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const features = [
  "统一管理 AI 工作流与 Prompt 模板",
  "追踪每一次 AI 执行记录与效果",
  "沉淀团队 AI 落地知识与经验",
];

export default function LoginPage() {
  const router = useRouter();

  const goToWorkspace = () => {
    router.push("/workspace");
  };

  return (
    <main className="min-h-screen bg-white text-slate-950 md:grid md:grid-cols-2">
      <section className="hidden min-h-screen flex-col justify-between bg-slate-900 px-12 py-10 text-white md:flex lg:px-16">
        <div className="text-lg font-semibold tracking-tight">
          AI Enablement Hub
        </div>

        <div className="max-w-xl">
          <h1 className="text-5xl font-semibold tracking-tight">欢迎回来</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            企业 AI 提效工作台，让 AI 成为团队的生产力系统
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/30">
                  <Check className="size-4" strokeWidth={2.2} />
                </span>
                <span className="text-base leading-7 text-slate-200">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-500">v1.0 Demo</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              演示账号登录
            </h2>
            <p className="mt-3 text-base text-slate-500">
              使用以下账号体验完整功能
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">邮箱</span>
              <input
                type="email"
                placeholder="admin@demo.com"
                defaultValue="admin@demo.com"
                className="h-12 rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">密码</span>
              <input
                type="password"
                placeholder="请输入密码"
                defaultValue="demo123456"
                className="h-12 rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>

            <button
              type="button"
              onClick={goToWorkspace}
              className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-5 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              进入工作台
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            这是演示账号，无需注册，点击即可体验
          </p>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">或者</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={goToWorkspace}
            className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-base font-medium text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
          >
            一键体验 Demo
          </button>

          <Link
            href="/"
            className="mx-auto mt-8 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="size-4" strokeWidth={2} />
            返回首页
          </Link>
        </div>
      </section>
    </main>
  );
}
