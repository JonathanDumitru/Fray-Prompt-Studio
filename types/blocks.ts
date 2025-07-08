export type BlockType =
  | "system"
  | "instruction"
  | "context"
  | "role"
  | "example"
  | "format"
  | "constraint"
  | "chain-of-thought"
  | "task"
  | "few-shot"
  | "persona"
  | "audience"
  | "domain"
  | "analogy"
  | "counter-example"
  | "tree-of-thought"
  | "self-reflection"
  | "step-back"
  | "tone"
  | "structure"
  | "validation"
  | "safety"
  | "fact-check"
  | "uncertainty"
  | "question"
  | "clarification"
  | "options"
  | "follow-up"
  | "code"
  | "creative"
  | "analysis"
  | "research"
  | "meta-prompt"
  | "performance"
  | "iteration"
  | "benchmark"
  | "if" // New
  | "then" // New
  | "loop" // New
  | "inject" // New

export interface Block {
  id: string
  type: BlockType
  content: string
  category: string
}

export interface BlockConfig {
  bgColor: string
  textColor: string
  clipPath: string
  prefix: string
  promptPrefix: string
  placeholder: string
  emoji: string
  glowColor?: string
}
