import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("开始写入种子数据...");

  // 清空现有数据
  await prisma.executionRecord.deleteMany();
  await prisma.template.deleteMany();
  await prisma.knowledgeItem.deleteMany();

  // 创建模板数据
  await prisma.template.createMany({
    data: [
      {
        name: "业务需求转 AI 工作流模板",
        category: "workflow",
        description: "将模糊业务需求转化为可执行 AI 工作流的标准模板",
        content: "## 需求背景\n{{背景描述}}\n\n## 目标\n{{目标描述}}\n\n## AI 节点设计\n{{节点列表}}\n\n## 验收标准\n{{验收条件}}",
        isActive: true,
        useCount: 23,
      },
      {
        name: "客服回复 Prompt 模板",
        category: "prompt",
        description: "适用于电商客服场景的标准化 Prompt",
        content: "你是一名专业的客服助手，负责回复用户问题。\n\n要求：\n1. 语气友好，简洁清晰\n2. 优先解决用户问题\n3. 无法解决时引导人工\n\n用户问题：{{user_question}}",
        isActive: true,
        useCount: 45,
      },
      {
        name: "周报整理 Prompt 模板",
        category: "prompt",
        description: "将原始工作记录整理成结构化周报",
        content: "请将以下工作记录整理成周报格式：\n\n原始记录：{{raw_content}}\n\n输出格式：\n## 本周完成\n## 遇到的问题\n## 下周计划",
        isActive: true,
        useCount: 18,
      },
      {
        name: "AI 工具评估 SOP",
        category: "sop",
        description: "评估和引入新 AI 工具的标准流程",
        content: "## 评估步骤\n1. 需求确认\n2. 工具调研\n3. 小范围测试\n4. 效果评估\n5. 团队推广\n\n## 评估维度\n- 功能匹配度\n- 成本\n- 学习曲线\n- 安全性",
        isActive: true,
        useCount: 7,
      },
      {
        name: "API 调用排错模板",
        category: "debug",
        description: "AI API 调用失败时的系统排查流程",
        content: "## 排查步骤\n1. 检查 API Key 是否有效\n2. 确认请求格式\n3. 查看错误码\n4. 检查网络连接\n5. 查看 API 配额",
        isActive: true,
        useCount: 12,
      },
      {
        name: "AI 项目交付文档模板",
        category: "delivery",
        description: "AI 提效项目的标准交付文档结构",
        content: "## 项目概述\n## 实现方案\n## 使用说明\n## 效果数据\n## 后续优化建议",
        isActive: false,
        useCount: 3,
      },
    ],
  });

  // 创建知识库数据
  await prisma.knowledgeItem.createMany({
    data: [
      {
        title: "Claude API 返回 429 错误怎么处理",
        category: "api",
        problemDesc: "调用 Claude API 时频繁出现 429 Too Many Requests 错误，导致请求失败。",
        solution: "1. 检查当前账号的 API 配额限制\n2. 在请求之间添加延迟（建议 1-2 秒）\n3. 实现指数退避重试机制\n4. 考虑升级 API 套餐\n5. 使用请求队列控制并发数量",
        tags: ["Claude", "API", "限流", "429"],
      },
      {
        title: "Windows 上 npx 命令报错 ENOENT",
        category: "cli",
        problemDesc: "在 Windows PowerShell 中运行 npx 命令时提示 ENOENT: no such file or directory。",
        solution: "1. 确认 Node.js 已正确安装（node -v 检查）\n2. 尝试以管理员身份运行 PowerShell\n3. 检查环境变量 PATH 是否包含 npm 路径\n4. 运行 npm cache clean --force 后重试",
        tags: ["Windows", "npx", "ENOENT", "环境配置"],
      },
      {
        title: "Prisma 连接 Neon 数据库超时",
        category: "deploy",
        problemDesc: "使用 Prisma 连接 Neon PostgreSQL 时出现连接超时，特别是冷启动后第一次请求。",
        solution: "1. Neon 免费版有冷启动延迟（约 3-5 秒），属正常现象\n2. 在 DATABASE_URL 添加 connect_timeout=30 参数\n3. 使用连接池模式（Pooler URL）而非直连\n4. 在 Prisma Client 配置中增加超时设置",
        tags: ["Prisma", "Neon", "超时", "冷启动"],
      },
      {
        title: "Next.js API 路由返回 500 但没有错误信息",
        category: "deploy",
        problemDesc: "Next.js API 路由返回 500 错误，但控制台没有详细错误信息，难以排查。",
        solution: "1. 在 API 路由的 catch 块中打印 console.error(error)\n2. 检查 .env 文件中的环境变量是否正确\n3. 确认 Prisma Client 已生成（npx prisma generate）\n4. 查看 Vercel 部署日志获取详细错误",
        tags: ["Next.js", "API", "500错误", "调试"],
      },
      {
        title: "OpenAI API Key 泄露了怎么办",
        category: "permission",
        problemDesc: "不小心把 API Key 提交到了 GitHub 公开仓库，需要紧急处理。",
        solution: "1. 立即在 OpenAI 控制台撤销该 API Key\n2. 生成新的 API Key\n3. 在 GitHub 仓库 Settings > Secrets 重新配置\n4. 检查 .gitignore 是否包含 .env 文件\n5. 使用 git-filter-repo 清除历史提交中的敏感信息",
        tags: ["API Key", "安全", "泄露", "GitHub"],
      },
    ],
  });

  // 创建示例执行记录
  await prisma.executionRecord.createMany({
    data: [
      {
        title: "客服知识库 AI 回复流程优化",
        scene: "workflow",
        inputContent: "需要用 AI 提高客服团队的回复效率，目前人工回复平均需要 5 分钟，希望降低到 1 分钟以内。",
        outputContent: JSON.stringify({ summary: "构建 AI 辅助客服工作流", goals: ["缩短回复时间", "提高一致性"] }),
        status: "completed",
        owner: "演示用户",
        score: 5,
        notes: "效果很好，已在团队推广",
      },
      {
        title: "周报自动整理 Prompt 优化",
        scene: "prompt",
        inputContent: "需要一个能把原始工作记录整理成结构化周报的 Prompt 模板。",
        outputContent: JSON.stringify({ summary: "周报整理 Prompt 设计", goals: ["结构化输出", "减少人工整理时间"] }),
        status: "completed",
        owner: "演示用户",
        score: 4,
        notes: "基本满足需求，后续可以优化格式",
      },
      {
        title: "Claude Code 团队部署方案",
        scene: "coding",
        inputContent: "团队有 5 名开发，希望统一引入 Claude Code 提升编码效率。",
        outputContent: JSON.stringify({ summary: "Claude Code 团队部署规划", goals: ["统一工具链", "提升开发效率"] }),
        status: "needs_optimization",
        owner: "演示用户",
        score: 3,
        notes: "方案可行，但需要考虑成本控制",
      },
    ],
  });

  console.log("种子数据写入完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
