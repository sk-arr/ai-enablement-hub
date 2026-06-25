"use client";

import { AI_SCENES } from "@/lib/constants";
import type { GeneratedPlan, SceneId } from "@/types";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Lightbulb,
  ListChecks,
  Loader2,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Scene = (typeof AI_SCENES)[number];

type ScenePlanPreset = Omit<GeneratedPlan, "summary"> & {
  summaryTemplate: string;
};

type SaveStatus = "idle" | "saving" | "saved";

const scenePlanPresets: Record<SceneId, ScenePlanPreset> = {
  workflow: {
    summaryTemplate:
      "当前需求适合先拆成标准输入、AI 处理节点、人工复核节点和交付输出四层。建议先用一个低风险业务流程做试点，再把稳定节点沉淀为团队 SOP。",
    goals: [
      "把模糊业务需求转化为可执行的 AI 工作流节点",
      "明确每个节点的输入、输出、责任人和质量检查方式",
      "形成可复用的流程模板，便于后续复制到同类业务",
    ],
    recommendedTools: [
      {
        name: "ChatGPT / Claude",
        description: "用于需求拆解、流程设计和 Prompt 初稿生成",
      },
      {
        name: "Notion / 飞书文档",
        description: "用于沉淀 SOP、节点说明和协作记录",
      },
      {
        name: "Zapier / n8n",
        description: "用于把稳定流程自动串联成低代码工作流",
      },
    ],
    steps: [
      {
        number: 1,
        title: "梳理当前业务流程",
        detail: "记录现有流程中的输入材料、处理动作、交付物和人工判断点，标记重复度高且规则明确的环节。",
      },
      {
        number: 2,
        title: "定义 AI 节点边界",
        detail: "将可由 AI 辅助的任务拆成独立节点，为每个节点设计输入格式、输出格式和失败兜底方式。",
      },
      {
        number: 3,
        title: "设计人工复核规则",
        detail: "为关键输出设置抽检标准，明确哪些结果可直接使用，哪些必须由负责人二次确认。",
      },
      {
        number: 4,
        title: "试运行并固化模板",
        detail: "选择 3 到 5 个真实案例试跑，记录耗时、返工点和可复用 Prompt，再形成团队模板。",
      },
    ],
    promptTemplate:
      "你是一名企业 AI 工作流顾问。请基于以下业务需求，拆解为「输入材料、AI 处理节点、人工复核节点、最终交付物、风险控制」五个部分，并输出可执行 SOP。业务需求：{{业务需求}}",
    risks: [
      "流程边界不清会导致 AI 输出过宽，难以复用",
      "缺少人工复核会放大错误结论的业务影响",
      "没有记录试运行数据，后续无法判断是否真正提效",
    ],
    acceptanceCriteria: [
      "至少形成 1 套完整流程图和 1 份 SOP 文档",
      "每个 AI 节点都有明确输入、输出和复核标准",
      "试运行任务平均处理时间下降 30% 以上",
    ],
    optimizationSuggestions: [
      "优先选择高频、低风险、规则明确的流程试点",
      "将每次失败案例补充到知识库，持续优化节点说明",
      "每周复盘模板调用次数和人工修改比例",
    ],
  },
  prompt: {
    summaryTemplate:
      "当前需求重点在于把一次性 Prompt 升级为可复用模板。建议用角色、任务、输入变量、输出格式、质量标准和示例六段式来组织，减少不同成员之间的使用偏差。",
    goals: [
      "产出可复用 Prompt 模板，而不是一次性指令",
      "统一变量字段和输出格式，降低团队使用门槛",
      "建立 Prompt 版本记录，方便持续优化",
    ],
    recommendedTools: [
      {
        name: "AI Enablement Hub 模板库",
        description: "用于分类存储、版本记录和一键调用 Prompt",
      },
      {
        name: "ChatGPT / DeepSeek",
        description: "用于快速测试不同模型下的输出稳定性",
      },
      {
        name: "飞书多维表格",
        description: "用于记录模板评分、适用场景和优化建议",
      },
    ],
    steps: [
      {
        number: 1,
        title: "明确模板适用边界",
        detail: "定义模板适合处理哪些任务、不适合处理哪些任务，避免一个 Prompt 覆盖过多场景。",
      },
      {
        number: 2,
        title: "设计变量字段",
        detail: "把需求中会变化的信息抽成变量，例如业务目标、用户画像、输出语气、长度限制和参考资料。",
      },
      {
        number: 3,
        title: "约束输出结构",
        detail: "要求 AI 按固定标题、列表或表格输出，便于团队成员直接复用和对比。",
      },
      {
        number: 4,
        title: "建立评分和迭代机制",
        detail: "每次调用后记录命中率、修改量和使用反馈，保留高分版本作为默认模板。",
      },
    ],
    promptTemplate:
      "你是一名资深 Prompt 架构师。请把以下业务任务改写为可复用 Prompt 模板，包含角色设定、输入变量、操作步骤、输出格式、质量标准和示例。业务任务：{{业务需求}}",
    risks: [
      "模板变量过少会导致复用范围窄",
      "输出格式不固定会增加人工整理成本",
      "缺少版本管理会让团队重复使用低质量模板",
    ],
    acceptanceCriteria: [
      "模板包含至少 5 个可替换变量",
      "输出格式稳定，可直接复制到业务文档",
      "经过至少 3 次真实任务测试并记录评分",
    ],
    optimizationSuggestions: [
      "为高频模板维护正反例，提升输出一致性",
      "按场景拆分模板，不要把多个任务塞进一个 Prompt",
      "定期淘汰低分模板，保留经过验证的版本",
    ],
  },
  coding: {
    summaryTemplate:
      "当前需求适合以小范围试点方式引入 AI 编程工具。关键不是安装工具本身，而是定义使用边界、代码审查规则、提交规范和安全策略。",
    goals: [
      "完成 AI 编程工具的团队试点方案",
      "明确可使用场景、禁止场景和代码审查要求",
      "建立可复盘的效率与质量指标",
    ],
    recommendedTools: [
      {
        name: "GitHub Copilot / Cursor",
        description: "用于代码补全、重构建议和单元测试辅助",
      },
      {
        name: "Codex",
        description: "用于跨文件修改、问题定位和项目级任务执行",
      },
      {
        name: "GitHub Pull Request",
        description: "用于保留 AI 辅助代码的审查、讨论和回滚记录",
      },
    ],
    steps: [
      {
        number: 1,
        title: "选择试点团队和仓库",
        detail: "从低风险内部项目开始，优先选择依赖清晰、测试较完整、业务影响可控的仓库。",
      },
      {
        number: 2,
        title: "定义 AI 使用规范",
        detail: "明确哪些任务可交给 AI 辅助，哪些涉及密钥、权限、支付或核心数据的代码必须人工处理。",
      },
      {
        number: 3,
        title: "建立审查流程",
        detail: "要求 AI 生成代码必须经过 lint、build、测试和人工 review，不允许直接合并。",
      },
      {
        number: 4,
        title: "统计试点效果",
        detail: "记录交付周期、缺陷率、返工次数和开发者反馈，决定是否扩大到更多项目。",
      },
    ],
    promptTemplate:
      "你是一名资深工程效率顾问。请为以下团队设计 AI 编程工具落地方案，包含试点范围、工具选择、使用规范、风险控制、代码审查流程和效果指标。背景：{{业务需求}}",
    risks: [
      "开发者过度信任 AI 输出，忽略边界条件和安全风险",
      "缺少 review 规则会让低质量代码进入主分支",
      "没有指标记录，无法证明工具是否提升效率",
    ],
    acceptanceCriteria: [
      "完成 1 份团队 AI 编程使用规范",
      "至少 1 个试点仓库跑通 lint、build 和 review 流程",
      "试点周期内记录不少于 10 条 AI 辅助任务数据",
    ],
    optimizationSuggestions: [
      "先从测试生成、文档补全、低风险重构开始",
      "为常见任务沉淀可复用提示词和操作清单",
      "每两周复盘一次 AI 代码缺陷类型",
    ],
  },
  debug: {
    summaryTemplate:
      "当前需求适合建立标准化排错链路。建议将错误信息、环境信息、复现步骤、已尝试方案和最终解决方案统一记录，避免同类问题重复排查。",
    goals: [
      "建立可复用的问题排查流程",
      "减少重复搜索和试错时间",
      "把解决方案沉淀为团队知识库条目",
    ],
    recommendedTools: [
      {
        name: "AI Enablement Hub 知识库",
        description: "用于沉淀错误类型、排查步骤和最终解决方案",
      },
      {
        name: "Codex / ChatGPT",
        description: "用于分析报错、推断根因和生成检查清单",
      },
      {
        name: "日志与监控工具",
        description: "用于定位运行时错误、接口失败和性能异常",
      },
    ],
    steps: [
      {
        number: 1,
        title: "收集完整上下文",
        detail: "整理报错原文、运行命令、环境版本、复现步骤和最近改动，避免只凭截图判断。",
      },
      {
        number: 2,
        title: "按层级定位根因",
        detail: "从依赖、配置、路径、权限、数据、代码逻辑依次排查，记录每一步结论。",
      },
      {
        number: 3,
        title: "验证修复有效性",
        detail: "使用最小复现命令重新验证，确保修复的是根因，不只是暂时绕过报错。",
      },
      {
        number: 4,
        title: "沉淀知识库条目",
        detail: "把错误现象、根因、修复步骤和预防方式写入知识库，方便团队下次检索。",
      },
    ],
    promptTemplate:
      "你是一名系统化问题排查专家。请基于以下错误信息和上下文，输出根因假设、排查顺序、验证命令、修复方案和知识库沉淀格式。问题描述：{{业务需求}}",
    risks: [
      "缺少完整报错原文会导致 AI 判断偏差",
      "跳过验证步骤可能让问题在部署后复现",
      "解决方案不沉淀会让团队反复排查同类问题",
    ],
    acceptanceCriteria: [
      "每个问题记录至少包含报错、环境、根因和修复步骤",
      "修复后有明确验证命令和通过结果",
      "高频问题能在知识库中通过关键词检索到",
    ],
    optimizationSuggestions: [
      "为常见报错建立排查模板",
      "把验证命令写进记录，减少口头经验传递",
      "定期统计高频问题，反向优化环境和文档",
    ],
  },
  meeting: {
    summaryTemplate:
      "当前需求适合把会议内容转为结构化纪要和行动追踪。重点是统一纪要格式、明确责任人和截止时间，并让后续任务能被持续跟进。",
    goals: [
      "把会议内容转化为结构化纪要",
      "明确决策事项、待办任务、责任人和截止时间",
      "形成可追踪的会后行动闭环",
    ],
    recommendedTools: [
      {
        name: "飞书妙记 / 腾讯会议纪要",
        description: "用于获取会议转写文本和基础摘要",
      },
      {
        name: "ChatGPT / Claude",
        description: "用于提炼决策、风险和行动项",
      },
      {
        name: "飞书任务 / Notion",
        description: "用于追踪会后任务状态和责任人",
      },
    ],
    steps: [
      {
        number: 1,
        title: "统一会议输入格式",
        detail: "收集会议主题、参会人、转写文本和背景资料，减少 AI 对上下文的误解。",
      },
      {
        number: 2,
        title: "生成结构化纪要",
        detail: "按背景、讨论要点、关键决策、行动项、风险问题五个部分输出。",
      },
      {
        number: 3,
        title: "人工确认行动项",
        detail: "由会议负责人检查责任人、截止时间和任务描述，避免 AI 自动补全造成误导。",
      },
      {
        number: 4,
        title: "同步到任务系统",
        detail: "将确认后的行动项同步到团队协作工具，定期更新状态。",
      },
    ],
    promptTemplate:
      "你是一名高效会议纪要助理。请基于以下会议内容，输出会议背景、讨论要点、关键决策、行动项表格、风险问题和下次跟进建议。会议内容：{{业务需求}}",
    risks: [
      "转写文本质量差会影响纪要准确性",
      "AI 可能补全不存在的责任人或截止时间",
      "纪要不进入任务系统会导致行动项遗忘",
    ],
    acceptanceCriteria: [
      "纪要包含决策、行动项和风险问题三类核心信息",
      "每个行动项都有责任人、截止时间和状态",
      "会后 24 小时内完成纪要分发和任务同步",
    ],
    optimizationSuggestions: [
      "会议开始前明确议题和预期输出",
      "为不同会议类型维护专用纪要模板",
      "定期统计行动项完成率，优化会议质量",
    ],
  },
  content: {
    summaryTemplate:
      "当前需求适合建立内容生产流水线。建议把选题、资料收集、初稿生成、审核修改、发布分发和数据复盘拆成固定环节，提高产出稳定性。",
    goals: [
      "提升内容从选题到发布的整体效率",
      "保证品牌语气、内容质量和审核标准一致",
      "沉淀可复用的内容模板和选题方法",
    ],
    recommendedTools: [
      {
        name: "ChatGPT / Claude / DeepSeek",
        description: "用于选题扩展、初稿生成和标题优化",
      },
      {
        name: "飞书文档 / Notion",
        description: "用于内容排期、素材管理和审核协作",
      },
      {
        name: "数据看板",
        description: "用于跟踪阅读量、转化率和复用效果",
      },
    ],
    steps: [
      {
        number: 1,
        title: "建立选题池",
        detail: "按用户痛点、产品功能、行业趋势和案例复盘分类收集选题，并标注优先级。",
      },
      {
        number: 2,
        title: "生成内容初稿",
        detail: "使用统一 Prompt 生成标题、结构和正文初稿，要求 AI 标注需要人工补充的事实信息。",
      },
      {
        number: 3,
        title: "执行人工审核",
        detail: "检查事实准确性、品牌语气、敏感表达和转化路径，保留修改记录。",
      },
      {
        number: 4,
        title: "复盘数据并优化模板",
        detail: "发布后记录阅读、收藏、咨询和转化数据，更新高表现模板。",
      },
    ],
    promptTemplate:
      "你是一名企业内容运营专家。请基于以下业务需求，设计内容生产提效方案，包含选题池、内容结构、AI Prompt、审核标准、发布节奏和数据复盘指标。需求：{{业务需求}}",
    risks: [
      "AI 生成内容可能出现事实错误或表达空泛",
      "缺少审核标准会导致品牌语气不一致",
      "只追求产量会牺牲内容转化质量",
    ],
    acceptanceCriteria: [
      "形成至少 10 个可执行选题和 3 个内容模板",
      "每篇内容都有审核记录和发布状态",
      "每周复盘内容数据并更新模板建议",
    ],
    optimizationSuggestions: [
      "把高转化内容拆解为结构模板",
      "为不同渠道设置不同标题和摘要规则",
      "将用户反馈反向补充到选题池",
    ],
  },
};

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function typeText(
  text: string,
  callback: (t: string) => void,
  onDone: () => void,
) {
  let i = 0;
  const intervalMs = Math.max(4, Math.floor(1800 / Math.max(text.length, 1)));
  const timer = window.setInterval(() => {
    i++;
    callback(text.slice(0, i));

    if (i >= text.length) {
      window.clearInterval(timer);
      onDone();
    }
  }, intervalMs);
}

async function generateMockPlan(
  scene: Scene,
  inputContent: string,
): Promise<GeneratedPlan> {
  await sleep(1500);

  const preset = scenePlanPresets[scene.id];
  const normalizedInput = inputContent.trim();
  const inputPreview =
    normalizedInput.length > 90
      ? `${normalizedInput.slice(0, 90)}...`
      : normalizedInput;

  return {
    summary: `${preset.summaryTemplate} 本次输入重点为「${inputPreview || scene.name}」，建议先完成小范围验证，再进入团队级复用。`,
    goals: preset.goals,
    recommendedTools: preset.recommendedTools,
    steps: preset.steps,
    promptTemplate: preset.promptTemplate,
    risks: preset.risks,
    acceptanceCriteria: preset.acceptanceCriteria,
    optimizationSuggestions: preset.optimizationSuggestions,
  };
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
  icon: typeof Sparkles;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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

function GeneratePageContent() {
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [requirement, setRequirement] = useState("");
  const [context, setContext] = useState("");
  const [owner, setOwner] = useState("演示用户");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [displayedPlan, setDisplayedPlan] = useState<GeneratedPlan | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const selectedScene = useMemo(() => {
    const sceneId = searchParams.get("scene");
    return AI_SCENES.find((scene) => scene.id === sceneId) ?? AI_SCENES[0];
  }, [searchParams]);

  const handleGenerate = async () => {
    if (!title.trim() || !requirement.trim()) {
      setError("请先填写任务标题和业务需求描述");
      return;
    }

    setError("");
    setLoading(true);
    setIsTyping(false);
    setPlan(null);
    setDisplayedPlan(null);

    const inputContent = [
      `任务标题：${title}`,
      `业务需求：${requirement}`,
      context ? `补充上下文：${context}` : "",
      `负责人：${owner || "演示用户"}`,
    ]
      .filter(Boolean)
      .join("\n");

    const result = await generateMockPlan(selectedScene, inputContent);
    setSaveStatus("idle");
    setLoading(false);
    setIsTyping(true);
    setDisplayedPlan({ ...result, summary: "" });

    typeText(
      result.summary,
      (summary) => {
        setDisplayedPlan((current) => {
          if (!current) {
            return current;
          }

          return { ...current, summary };
        });
      },
      () => {
        setDisplayedPlan(result);
        setPlan(result);
        setIsTyping(false);
      },
    );
  };

  async function handleSave() {
    if (!plan || isTyping || saveStatus !== "idle") {
      return;
    }

    setSaveStatus("saving");

    try {
      const response = await fetch("/api/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          scene: selectedScene.id,
          inputContent: requirement,
          outputContent: JSON.stringify(plan),
          status: "completed",
          owner,
        }),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      setSaveStatus("saved");
    } catch {
      setSaveStatus("idle");
      alert("保存失败，请重试");
    }
  }

  const saveButtonClassName =
    saveStatus === "saved"
      ? "bg-green-600 hover:bg-green-600 focus:ring-green-100"
      : saveStatus === "saving"
        ? "bg-slate-400 hover:bg-slate-400 focus:ring-slate-100"
        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-100";

  const saveButtonText =
    saveStatus === "saved"
      ? "✓ 已保存"
      : saveStatus === "saving"
        ? "保存中..."
        : "保存执行记录";

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(360px,0.42fr)_minmax(0,0.58fr)] lg:px-10">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            填写业务需求
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            当前场景：
            <span className="font-medium text-blue-600">
              {selectedScene.name}
            </span>
          </p>
        </div>

        <div className="mt-7 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">
              任务标题 <span className="text-red-500">*</span>
            </span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              placeholder="例如：客服知识库 AI 回复流程优化"
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">
              业务需求描述 <span className="text-red-500">*</span>
            </span>
            <textarea
              value={requirement}
              onChange={(event) => setRequirement(event.target.value)}
              required
              rows={5}
              placeholder="请详细描述你的业务需求，例如：我们需要用 AI 提高客服回复效率..."
              className="resize-none rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">
              补充上下文
            </span>
            <textarea
              value={context}
              onChange={(event) => setContext(event.target.value)}
              rows={3}
              placeholder="可以补充团队规模、当前工具、特殊限制等信息"
              className="resize-none rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">负责人</span>
            <input
              value={owner}
              onChange={(event) => setOwner(event.target.value)}
              className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            disabled={loading || isTyping}
            onClick={handleGenerate}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" strokeWidth={2} />
                生成中...
              </>
            ) : isTyping ? (
              "生成结果中..."
            ) : (
              "生成执行方案"
            )}
          </button>
        </div>
      </section>

      <section className="min-h-[640px]">
        {!displayedPlan ? (
          <div className="flex min-h-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100/70 p-8 text-center">
            <div className="flex max-w-sm flex-col items-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
                <Sparkles className="size-7" strokeWidth={1.8} />
              </div>
              <p className="mt-5 text-base font-medium text-slate-700">
                填写左侧需求后，点击生成按钮
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                系统会基于当前场景生成需求理解、目标拆解、工具建议、执行步骤和验收标准。
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            <div className="flex items-center justify-end">
              <button
                type="button"
                disabled={!plan || isTyping || saveStatus !== "idle"}
                onClick={handleSave}
                className={`inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-4 disabled:cursor-not-allowed ${saveButtonClassName}`}
              >
                {saveButtonText}
              </button>
            </div>

            <PlanCard
              title="需求理解"
              accentClassName="bg-emerald-50 text-emerald-600"
              titleClassName="text-emerald-700"
              icon={Sparkles}
            >
              <p>
                {displayedPlan.summary}
                {isTyping ? <span className="animate-pulse">|</span> : null}
              </p>
            </PlanCard>

            {!isTyping ? (
              <>
            <PlanCard
              title="目标拆解"
              accentClassName="bg-blue-50 text-blue-600"
              icon={Target}
            >
              <ul className="space-y-2">
                {displayedPlan.goals.map((goal) => (
                  <li key={goal} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-500" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </PlanCard>

            <PlanCard
              title="推荐 AI 工具"
              accentClassName="bg-purple-50 text-purple-600"
              icon={Wrench}
            >
              <div className="space-y-3">
                {displayedPlan.recommendedTools.map((tool) => (
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

            <PlanCard
              title="执行步骤"
              accentClassName="bg-orange-50 text-orange-600"
              icon={ListChecks}
            >
              <div className="space-y-4">
                {displayedPlan.steps.map((step) => (
                  <div key={step.number} className="flex gap-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700">
                      {step.number}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {step.title}
                      </div>
                      <div className="mt-1 text-slate-600">{step.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </PlanCard>

            <PlanCard
              title="Prompt 模板"
              accentClassName="bg-cyan-50 text-cyan-600"
              icon={FileText}
            >
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                {displayedPlan.promptTemplate}
              </pre>
            </PlanCard>

            <PlanCard
              title="风险提醒"
              accentClassName="bg-red-50 text-red-600"
              icon={AlertTriangle}
            >
              <ul className="space-y-2">
                {displayedPlan.risks.map((risk) => (
                  <li key={risk} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-red-400" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </PlanCard>

            <PlanCard
              title="验收标准"
              accentClassName="bg-green-50 text-green-600"
              icon={ClipboardCheck}
            >
              <ul className="space-y-2">
                {displayedPlan.acceptanceCriteria.map((criterion) => (
                  <li key={criterion} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </PlanCard>

            <PlanCard
              title="优化建议"
              accentClassName="bg-pink-50 text-pink-600"
              icon={Lightbulb}
            >
              <ul className="space-y-2">
                {displayedPlan.optimizationSuggestions.map((suggestion) => (
                  <li key={suggestion} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-pink-400" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </PlanCard>
              </>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
          正在加载方案生成器...
        </div>
      }
    >
      <GeneratePageContent />
    </Suspense>
  );
}
