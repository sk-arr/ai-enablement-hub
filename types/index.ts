export type SceneId = "workflow" | "prompt" | "coding" | "debug" | "meeting" | "content";

export type RecordStatus = "pending" | "generating" | "completed" | "needs_optimization" | "archived";

export type TemplateCategory = "workflow" | "prompt" | "sop" | "debug" | "delivery";

export type KnowledgeCategory = "env" | "permission" | "cli" | "path" | "deploy" | "api" | "model";

export interface GeneratedPlan {
  summary: string;
  goals: string[];
  recommendedTools: { name: string; description: string }[];
  steps: { number: number; title: string; detail: string }[];
  promptTemplate: string;
  risks: string[];
  acceptanceCriteria: string[];
  optimizationSuggestions: string[];
}

export interface ExecutionRecord {
  id: string;
  title: string;
  scene: SceneId;
  inputContent: string;
  outputContent: string;
  status: RecordStatus;
  owner: string;
  score?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
