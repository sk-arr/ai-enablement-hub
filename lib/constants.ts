export const AI_SCENES = [
  {
    id: "workflow",
    name: "业务需求转 AI 工作流",
    description: "将模糊的业务需求转化为可执行的 AI 工作流方案",
    icon: "Workflow",
    color: "blue",
  },
  {
    id: "prompt",
    name: "Prompt 模板生成器",
    description: "为具体业务场景生成结构化、可复用的 Prompt 模板",
    icon: "FileText",
    color: "purple",
  },
  {
    id: "coding",
    name: "AI 编程工具部署",
    description: "规划 AI 编程辅助工具的引入和团队部署方案",
    icon: "Code2",
    color: "green",
  },
  {
    id: "debug",
    name: "问题排查助手",
    description: "系统化排查 AI 工具落地过程中的常见问题",
    icon: "Wrench",
    color: "orange",
  },
  {
    id: "meeting",
    name: "会议纪要整理",
    description: "将会议内容转化为结构化纪要和后续行动清单",
    icon: "ClipboardList",
    color: "cyan",
  },
  {
    id: "content",
    name: "内容运营提效",
    description: "利用 AI 工具加速内容创作、审核和分发流程",
    icon: "Rocket",
    color: "pink",
  },
] as const;

export const RECORD_STATUS = {
  pending: { label: "待处理", color: "gray" },
  generating: { label: "生成中", color: "blue" },
  completed: { label: "已完成", color: "green" },
  needs_optimization: { label: "需优化", color: "orange" },
  archived: { label: "已归档", color: "slate" },
} as const;

export const TEMPLATE_CATEGORIES = [
  { id: "workflow", label: "工作流模板" },
  { id: "prompt", label: "Prompt 模板" },
  { id: "sop", label: "SOP 模板" },
  { id: "debug", label: "排错模板" },
  { id: "delivery", label: "交付文档模板" },
] as const;

export const KNOWLEDGE_CATEGORIES = [
  { id: "env", label: "环境配置" },
  { id: "permission", label: "账号权限" },
  { id: "cli", label: "命令行报错" },
  { id: "path", label: "路径错误" },
  { id: "deploy", label: "部署失败" },
  { id: "api", label: "API 配置" },
  { id: "model", label: "模型调用" },
] as const;
