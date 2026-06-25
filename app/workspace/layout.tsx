"use client";

import { TopProgressBar } from "@/components/shared/TopProgressBar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  BookTemplate,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const navItems: {
  href: string;
  label: string;
  icon: LucideIcon;
}[] = [
  { href: "/workspace", label: "工作台", icon: LayoutDashboard },
  { href: "/workspace/generate", label: "方案生成", icon: Zap },
  { href: "/workspace/records", label: "执行记录", icon: FileText },
  { href: "/workspace/templates", label: "模板库", icon: BookTemplate },
  { href: "/workspace/knowledge", label: "知识库", icon: BookOpen },
  { href: "/workspace/dashboard", label: "数据看板", icon: BarChart3 },
];

function isNavActive(pathname: string, href: string) {
  if (href === "/workspace") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <TopProgressBar />
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden h-screen flex-col border-r border-slate-200 bg-white transition-all duration-200 md:flex ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <div
          className={`flex items-center border-b border-slate-200 py-5 ${
            collapsed ? "justify-center px-2" : "justify-between px-5"
          }`}
        >
          {!collapsed ? (
            <Link href="/workspace" className="block min-w-0">
              <div className="truncate text-base font-semibold tracking-tight text-slate-950">
                AI Enablement Hub
              </div>
              <div className="mt-1 truncate text-xs text-slate-500">
                企业 AI 提效工作台
              </div>
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
            aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
          >
            {collapsed ? (
              <ChevronRight className="size-4" strokeWidth={1.9} />
            ) : (
              <ChevronLeft className="size-4" strokeWidth={1.9} />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map((item) => {
            const active = isNavActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                } ${collapsed ? "justify-center" : "gap-3"}`}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.9} />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className={`border-t border-slate-200 ${collapsed ? "p-3" : "p-4"}`}>
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-3"
            }`}
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              演
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-slate-950">
                  演示用户
                </div>
                <div className="truncate text-xs text-slate-500">
                  admin@demo.com
                </div>
              </div>
            ) : null}
          </div>

          {!collapsed ? (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
          >
            <LogOut className="size-4" strokeWidth={1.9} />
            退出登录
          </button>
          ) : null}
        </div>
      </aside>

      <main
        className={`min-h-screen bg-slate-50 transition-all duration-200 ${
          collapsed ? "md:ml-16" : "md:ml-60"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
