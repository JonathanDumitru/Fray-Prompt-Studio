import { useDraggable } from "@dnd-kit/core"
import type { BlockType } from "@/types/blocks"
import { getBlockConfig } from "@/lib/block-configs"

interface BlockCategory {
  name: string
  emoji: string
  blocks: {
    type: BlockType
    label: string
    emoji: string
    defaultContent: string
    description: string
  }[]
}

const blockCategories: BlockCategory[] = [
  {
    name: "System & Instructions",
    emoji: "🎭",
    blocks: [
      {
        type: "system",
        label: "System Role",
        emoji: "🎭",
        defaultContent: "a helpful AI assistant",
        description: "Set the AI's personality and role",
      },
      {
        type: "instruction",
        label: "Instruction",
        emoji: "📝",
        defaultContent: "help me analyze this text",
        description: "Give clear directions",
      },
      {
        type: "task",
        label: "Specific Task",
        emoji: "🎯",
        defaultContent: "summarize the key points",
        description: "Define a concrete task",
      },
      {
        type: "persona",
        label: "Persona",
        emoji: "👨‍💼",
        defaultContent: "an expert data scientist with 10 years experience",
        description: "Define detailed character traits",
      },
    ],
  },
  {
    name: "Context & Background",
    emoji: "📚",
    blocks: [
      {
        type: "context",
        label: "Context Info",
        emoji: "📚",
        defaultContent: "this is a business email from a client",
        description: "Provide background information",
      },
      {
        type: "role",
        label: "Role Playing",
        emoji: "👤",
        defaultContent: "a senior marketing manager",
        description: "Make AI adopt a specific role",
      },
      {
        type: "audience",
        label: "Target Audience",
        emoji: "👥",
        defaultContent: "explain this to a 12-year-old",
        description: "Define who the response is for",
      },
      {
        type: "domain",
        label: "Domain Knowledge",
        emoji: "🏛️",
        defaultContent: "in the context of machine learning",
        description: "Specify the field or domain",
      },
    ],
  },
  {
    name: "Examples & Learning",
    emoji: "💡",
    blocks: [
      {
        type: "example",
        label: "Single Example",
        emoji: "💡",
        defaultContent: "Input: 'Hello world' → Output: 'Greeting detected'",
        description: "Show one input/output example",
      },
      {
        type: "few-shot",
        label: "Multiple Examples",
        emoji: "⚡",
        defaultContent: "1. Happy → Positive\n2. Sad → Negative\n3. Excited → Positive",
        description: "Multiple examples for pattern learning",
      },
      {
        type: "analogy",
        label: "Analogy",
        emoji: "🔗",
        defaultContent: "think of this like a library catalog system",
        description: "Use analogies to explain concepts",
      },
      {
        type: "counter-example",
        label: "Counter Example",
        emoji: "❌",
        defaultContent: "do NOT do this: ...",
        description: "Show what not to do",
      },
    ],
  },
  {
    name: "Advanced Reasoning",
    emoji: "🧠",
    blocks: [
      {
        type: "chain-of-thought",
        label: "Step-by-Step",
        emoji: "🧠",
        defaultContent: "let's think through this step by step",
        description: "Encourage reasoning process",
      },
      {
        type: "tree-of-thought",
        label: "Tree of Thought",
        emoji: "🌳",
        defaultContent: "explore multiple reasoning paths",
        description: "Consider different approaches",
      },
      {
        type: "self-reflection",
        label: "Self-Reflection",
        emoji: "🪞",
        defaultContent: "review your answer and check for errors",
        description: "Ask AI to critique itself",
      },
      {
        type: "step-back",
        label: "Step Back",
        emoji: "↩️",
        defaultContent: "first, what are the fundamental principles here?",
        description: "Start with high-level concepts",
      },
    ],
  },
  {
    name: "Output Control",
    emoji: "📋",
    blocks: [
      {
        type: "format",
        label: "Output Format",
        emoji: "📋",
        defaultContent: "respond in bullet points",
        description: "Specify how to format the response",
      },
      {
        type: "constraint",
        label: "Constraints",
        emoji: "⚠️",
        defaultContent: "keep response under 50 words",
        description: "Set limits and requirements",
      },
      {
        type: "tone",
        label: "Tone & Style",
        emoji: "🎨",
        defaultContent: "use a friendly, conversational tone",
        description: "Set the communication style",
      },
      {
        type: "structure",
        label: "Structure",
        emoji: "🏗️",
        defaultContent: "organize with: 1) Summary 2) Details 3) Conclusion",
        description: "Define response organization",
      },
    ],
  },
  {
    name: "Quality & Safety",
    emoji: "🛡️",
    blocks: [
      {
        type: "validation",
        label: "Input Validation",
        emoji: "✅",
        defaultContent: "first check if the input makes sense",
        description: "Validate input before processing",
      },
      {
        type: "safety",
        label: "Safety Guidelines",
        emoji: "🛡️",
        defaultContent: "avoid harmful, biased, or inappropriate content",
        description: "Set safety boundaries",
      },
      {
        type: "fact-check",
        label: "Fact Checking",
        emoji: "🔍",
        defaultContent: "verify claims and cite sources when possible",
        description: "Encourage accuracy verification",
      },
      {
        type: "uncertainty",
        label: "Handle Uncertainty",
        emoji: "❓",
        defaultContent: "if unsure, say so and explain your confidence level",
        description: "Acknowledge limitations",
      },
    ],
  },
  {
    name: "Interactive Elements",
    emoji: "💬",
    blocks: [
      {
        type: "question",
        label: "Ask Questions",
        emoji: "❓",
        defaultContent: "ask clarifying questions if needed",
        description: "Encourage information gathering",
      },
      {
        type: "clarification",
        label: "Seek Clarification",
        emoji: "🤔",
        defaultContent: "what specific aspect would you like me to focus on?",
        description: "Request more details",
      },
      {
        type: "options",
        label: "Provide Options",
        emoji: "🔀",
        defaultContent: "here are 3 different approaches you could take",
        description: "Offer multiple solutions",
      },
      {
        type: "follow-up",
        label: "Follow-up",
        emoji: "➡️",
        defaultContent: "would you like me to elaborate on any of these points?",
        description: "Suggest next steps",
      },
    ],
  },
  {
    name: "Specialized Domains",
    emoji: "🔬",
    blocks: [
      {
        type: "code",
        label: "Code Generation",
        emoji: "💻",
        defaultContent: "write clean, well-commented code",
        description: "For programming tasks",
      },
      {
        type: "creative",
        label: "Creative Writing",
        emoji: "✍️",
        defaultContent: "be imaginative and engaging",
        description: "For creative content",
      },
      {
        type: "analysis",
        label: "Data Analysis",
        emoji: "📊",
        defaultContent: "provide statistical insights and trends",
        description: "For analytical tasks",
      },
      {
        type: "research",
        label: "Research Mode",
        emoji: "🔬",
        defaultContent: "approach this systematically with evidence",
        description: "For research-oriented tasks",
      },
    ],
  },
  {
    name: "Meta & Optimization",
    emoji: "⚙️",
    blocks: [
      {
        type: "meta-prompt",
        label: "Meta Prompting",
        emoji: "🔄",
        defaultContent: "improve this prompt to get better results",
        description: "Self-improving prompts",
      },
      {
        type: "performance",
        label: "Performance Check",
        emoji: "📈",
        defaultContent: "rate the quality of your response from 1-10",
        description: "Self-evaluation",
      },
      {
        type: "iteration",
        label: "Iterative Improvement",
        emoji: "🔁",
        defaultContent: "refine your answer based on this feedback",
        description: "Continuous improvement",
      },
      {
        type: "benchmark",
        label: "Benchmark",
        emoji: "🏆",
        defaultContent: "compare your approach to industry best practices",
        description: "Quality comparison",
      },
    ],
  },
  {
    name: "Logic & Dynamic",
    emoji: "💡",
    blocks: [
      {
        type: "if",
        label: "If Condition",
        emoji: "❓",
        defaultContent: "the user asks about pricing",
        description: "Define a condition for conditional logic",
      },
      {
        type: "then",
        label: "Then Action",
        emoji: "✅",
        defaultContent: "provide a link to the pricing page",
        description: "Specify an action to take if a condition is met",
      },
      {
        type: "loop",
        label: "Loop Action",
        emoji: "🔄",
        defaultContent: "for each item in the list, summarize it",
        description: "Repeat an action for multiple inputs or iterations",
      },
      {
        type: "inject",
        label: "Inject Dynamic Content",
        emoji: "💉",
        defaultContent: "{{user_name}}",
        description: "Insert dynamic data into the prompt",
      },
    ],
  },
]

function ScratchStyleBlock({
  type,
  label,
  emoji,
  defaultContent,
  description,
}: {
  type: BlockType
  label: string
  emoji: string
  defaultContent: string
  description: string
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type,
      defaultContent,
      category: "instruction",
    },
  })

  const blockConfig = getBlockConfig(type)

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div className="mb-4">
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`
          relative inline-block w-full cursor-grab active:cursor-grabbing
          ${blockConfig.bgColor} ${blockConfig.textColor}
          shadow-lg hover:shadow-xl transition-all duration-300
          ${isDragging ? "opacity-50 rotate-2 scale-105" : "hover:scale-105 hover:-translate-y-1"}
          backdrop-blur-sm border border-white/20 rounded-2xl
        `}
        style={{
          clipPath: blockConfig.clipPath,
          ...style,
        }}
      >
        <div className="px-4 py-3 rounded-2xl">
          <div className="font-medium text-sm flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <span>{blockConfig.prefix}</span>
            <span className="opacity-90 italic text-xs">{defaultContent}</span>
          </div>
        </div>
        {/* Glass overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl"></div>
      </div>
      <p className="text-xs text-gray-600/80 mt-2 px-2 font-medium">{description}</p>
    </div>
  )
}

export function BlockPalette() {
  return (
    <div className="pt-4 px-6 pb-6 relative z-10 h-full overflow-y-auto">
      {" "}
      {/* Adjusted padding */}
      <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-6 mb-4 border border-white/20 shadow-lg">
        {" "}
        {/* Adjusted mb */}
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <span className="text-2xl">🧩</span>
          Block Palette
        </h2>
        <p className="text-sm text-gray-600/80 font-medium">Drag blocks to build your prompt</p>
      </div>
      {blockCategories.map((category) => (
        <div key={category.name} className="mb-8">
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <span className="text-xl">{category.emoji}</span>
              {category.name}
            </h3>
          </div>

          <div className="space-y-4 pl-2">
            {category.blocks.map((block) => (
              <ScratchStyleBlock
                key={block.type}
                type={block.type}
                label={block.label}
                emoji={block.emoji}
                defaultContent={block.defaultContent}
                description={block.description}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
