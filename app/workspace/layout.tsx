"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  BookTemplate,
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-60 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="border-b border-slate-200 px-5 py-5">
          <Link href="/workspace" className="block">
            <div className="text-base font-semibold tracking-tight text-slate-950">
              AI Enablement Hub
            </div>
            <div className="mt-1 text-xs text-slate-500">企业 AI 提效工作台</div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {navItems.map((item) => {
            const active = isNavActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Icon className="size-4" strokeWidth={1.9} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              演
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-slate-950">
                演示用户
              </div>
              <div className="truncate text-xs text-slate-500">
                admin@demo.com
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
          >
            <LogOut className="size-4" strokeWidth={1.9} />
            退出登录
          </button>
        </div>
      </aside>

      <main className="min-h-screen bg-slate-50 md:ml-60">{children}</main>
    </div>
  );
}
