import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Enablement Hub | 企业 AI 提效工作台",
  description: "帮助团队把 AI 工作流、Prompt 模板、执行记录和效果数据统一管理起来",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
