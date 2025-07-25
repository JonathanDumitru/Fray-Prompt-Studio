import type { BlockType, BlockConfig } from "@/types/blocks"

export function getBlockConfig(type: BlockType): BlockConfig {
  const configs: Record<BlockType, BlockConfig> = {
    system: {
      bgColor: "bg-gradient-to-r from-orange-400/90 to-orange-500/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 10% 100%, 0 70%)",
      prefix: "You are",
      promptPrefix: "You are",
      placeholder: "a helpful assistant",
      emoji: "🎭",
      glowColor: "bg-orange-400",
    },
    instruction: {
      bgColor: "bg-gradient-to-r from-blue-500/90 to-blue-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      prefix: "Please",
      promptPrefix: "Please",
      placeholder: "help me with...",
      emoji: "📝",
      glowColor: "bg-blue-500",
    },
    task: {
      bgColor: "bg-gradient-to-r from-indigo-500/90 to-indigo-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      prefix: "Task:",
      promptPrefix: "Your task is to",
      placeholder: "analyze the following...",
      emoji: "🎯",
      glowColor: "bg-indigo-500",
    },
    persona: {
      bgColor: "bg-gradient-to-r from-cyan-500/90 to-cyan-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 70%, 90% 100%, 10% 100%, 0 70%)",
      prefix: "You are",
      promptPrefix: "You are a persona with the following traits:",
      placeholder: "an expert with specific traits...",
      emoji: "👨‍💼",
      glowColor: "bg-cyan-500",
    },
    context: {
      bgColor: "bg-gradient-to-r from-green-500/90 to-green-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
      prefix: "Context:",
      promptPrefix: "Context:",
      placeholder: "here is background info...",
      emoji: "📚",
      glowColor: "bg-green-500",
    },
    role: {
      bgColor: "bg-gradient-to-r from-emerald-500/90 to-emerald-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
      prefix: "Act as",
      promptPrefix: "Act as",
      placeholder: "a professional expert...",
      emoji: "👤",
      glowColor: "bg-emerald-500",
    },
    audience: {
      bgColor: "bg-gradient-to-r from-teal-500/90 to-teal-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
      prefix: "Audience:",
      promptPrefix: "The target audience is",
      placeholder: "explain for beginners...",
      emoji: "👥",
      glowColor: "bg-teal-500",
    },
    domain: {
      bgColor: "bg-gradient-to-r from-slate-500/90 to-slate-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
      prefix: "Domain:",
      promptPrefix: "In the domain of",
      placeholder: "in the field of...",
      emoji: "🏛️",
      glowColor: "bg-slate-500",
    },
    example: {
      bgColor: "bg-gradient-to-r from-purple-500/90 to-purple-600/90",
      textColor: "text-white",
      clipPath: "polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0 50%)",
      prefix: "Example:",
      promptPrefix: "Example:",
      placeholder: "Input: ... Output: ...",
      emoji: "💡",
      glowColor: "bg-purple-500",
    },
    "few-shot": {
      bgColor: "bg-gradient-to-r from-violet-500/90 to-violet-600/90",
      textColor: "text-white",
      clipPath: "polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0 50%)",
      prefix: "Examples:",
      promptPrefix: "Here are a few examples:",
      placeholder: "1. ... 2. ... 3. ...",
      emoji: "⚡",
      glowColor: "bg-violet-500",
    },
    analogy: {
      bgColor: "bg-gradient-to-r from-fuchsia-500/90 to-fuchsia-600/90",
      textColor: "text-white",
      clipPath: "polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0 50%)",
      prefix: "Think of it like:",
      promptPrefix: "Think of this problem like:",
      placeholder: "a library system...",
      emoji: "🔗",
      glowColor: "bg-fuchsia-500",
    },
    "counter-example": {
      bgColor: "bg-gradient-to-r from-rose-500/90 to-rose-600/90",
      textColor: "text-white",
      clipPath: "polygon(10% 0, 100% 0, 100% 100%, 10% 100%, 0 50%)",
      prefix: "Don't:",
      promptPrefix: "Do NOT do this:",
      placeholder: "avoid doing this...",
      emoji: "❌",
      glowColor: "bg-rose-500",
    },
    "chain-of-thought": {
      bgColor: "bg-gradient-to-r from-pink-500/90 to-pink-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
      prefix: "Think:",
      promptPrefix: "Let's think step by step:",
      placeholder: "let's work through this step by step...",
      emoji: "🧠",
      glowColor: "bg-pink-500",
    },
    "tree-of-thought": {
      bgColor: "bg-gradient-to-r from-lime-500/90 to-lime-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
      prefix: "Explore:",
      promptPrefix: "Explore multiple reasoning paths:",
      placeholder: "consider multiple approaches...",
      emoji: "🌳",
      glowColor: "bg-lime-500",
    },
    "self-reflection": {
      bgColor: "bg-gradient-to-r from-sky-500/90 to-sky-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
      prefix: "Reflect:",
      promptPrefix: "After generating your response, reflect and improve it:",
      placeholder: "review and improve your answer...",
      emoji: "🪞",
      glowColor: "bg-sky-500",
    },
    "step-back": {
      bgColor: "bg-gradient-to-r from-stone-500/90 to-stone-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
      prefix: "Step back:",
      promptPrefix: "Before answering, step back and consider the fundamental principles:",
      placeholder: "what are the fundamentals?...",
      emoji: "↩️",
      glowColor: "bg-stone-500",
    },
    format: {
      bgColor: "bg-gradient-to-r from-amber-500/90 to-amber-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)",
      prefix: "Format:",
      promptPrefix: "Format your response as:",
      placeholder: "respond in JSON format...",
      emoji: "📋",
      glowColor: "bg-amber-500",
    },
    constraint: {
      bgColor: "bg-gradient-to-r from-red-500/90 to-red-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)",
      prefix: "Rules:",
      promptPrefix: "Strictly adhere to these rules:",
      placeholder: "keep response under 100 words...",
      emoji: "⚠️",
      glowColor: "bg-red-500",
    },
    tone: {
      bgColor: "bg-gradient-to-r from-yellow-500/90 to-yellow-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)",
      prefix: "Tone:",
      promptPrefix: "Use a tone that is",
      placeholder: "use a friendly style...",
      emoji: "🎨",
      glowColor: "bg-yellow-500",
    },
    structure: {
      bgColor: "bg-gradient-to-r from-orange-600/90 to-orange-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)",
      prefix: "Structure:",
      promptPrefix: "Structure your response with the following sections:",
      placeholder: "organize with sections...",
      emoji: "🏗️",
      glowColor: "bg-orange-600",
    },
    validation: {
      bgColor: "bg-gradient-to-r from-green-600/90 to-green-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      prefix: "Validate:",
      promptPrefix: "First, validate the input:",
      placeholder: "check if input is valid...",
      emoji: "✅",
      glowColor: "bg-green-600",
    },
    safety: {
      bgColor: "bg-gradient-to-r from-blue-700/90 to-blue-800/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      prefix: "Safety:",
      promptPrefix: "Adhere to safety guidelines:",
      placeholder: "avoid harmful content...",
      emoji: "🛡️",
      glowColor: "bg-blue-700",
    },
    "fact-check": {
      bgColor: "bg-gradient-to-r from-indigo-600/90 to-indigo-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      prefix: "Verify:",
      promptPrefix: "Verify all claims and cite sources:",
      placeholder: "check facts and cite sources...",
      emoji: "🔍",
      glowColor: "bg-indigo-600",
    },
    uncertainty: {
      bgColor: "bg-gradient-to-r from-gray-500/90 to-gray-600/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      prefix: "If uncertain:",
      promptPrefix: "If you are uncertain about any part of the answer, state your confidence level:",
      placeholder: "acknowledge limitations...",
      emoji: "❓",
      glowColor: "bg-gray-500",
    },
    question: {
      bgColor: "bg-gradient-to-r from-purple-600/90 to-purple-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
      prefix: "Ask:",
      promptPrefix: "Ask clarifying questions if needed:",
      placeholder: "what would you like to know?...",
      emoji: "❓",
      glowColor: "bg-purple-600",
    },
    clarification: {
      bgColor: "bg-gradient-to-r from-violet-600/90 to-violet-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
      prefix: "Clarify:",
      promptPrefix: "Seek clarification on ambiguous points:",
      placeholder: "could you be more specific?...",
      emoji: "🤔",
      glowColor: "bg-violet-600",
    },
    options: {
      bgColor: "bg-gradient-to-r from-emerald-600/90 to-emerald-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
      prefix: "Options:",
      promptPrefix: "Provide multiple options or approaches:",
      placeholder: "here are different approaches...",
      emoji: "🔀",
      glowColor: "bg-emerald-600",
    },
    "follow-up": {
      bgColor: "bg-gradient-to-r from-teal-600/90 to-teal-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
      prefix: "Next:",
      promptPrefix: "Suggest next steps or follow-up questions:",
      placeholder: "would you like me to...",
      emoji: "➡️",
      glowColor: "bg-teal-600",
    },
    code: {
      bgColor: "bg-gradient-to-r from-slate-600/90 to-slate-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      prefix: "Code:",
      promptPrefix: "Generate clean, well-commented code:",
      placeholder: "write clean, documented code...",
      emoji: "💻",
      glowColor: "bg-slate-600",
    },
    creative: {
      bgColor: "bg-gradient-to-r from-pink-600/90 to-pink-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      prefix: "Create:",
      promptPrefix: "Be imaginative and engaging:",
      placeholder: "be imaginative and engaging...",
      emoji: "✍️",
      glowColor: "bg-pink-600",
    },
    analysis: {
      bgColor: "bg-gradient-to-r from-blue-600/90 to-blue-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      prefix: "Analyze:",
      promptPrefix: "Provide statistical insights and trends:",
      placeholder: "provide insights and trends...",
      emoji: "📊",
      glowColor: "bg-blue-600",
    },
    research: {
      bgColor: "bg-gradient-to-r from-indigo-700/90 to-indigo-800/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      prefix: "Research:",
      promptPrefix: "Approach this systematically with evidence:",
      placeholder: "approach systematically...",
      emoji: "🔬",
      glowColor: "bg-indigo-700",
    },
    "meta-prompt": {
      bgColor: "bg-gradient-to-r from-cyan-600/90 to-cyan-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
      prefix: "Meta:",
      promptPrefix: "Improve this prompt to get better results:",
      placeholder: "improve this prompt...",
      emoji: "🔄",
      glowColor: "bg-cyan-600",
    },
    performance: {
      bgColor: "bg-gradient-to-r from-green-700/90 to-green-800/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
      prefix: "Rate:",
      promptPrefix: "Rate the quality of your response from 1-10:",
      placeholder: "evaluate your response...",
      emoji: "📈",
      glowColor: "bg-green-700",
    },
    iteration: {
      bgColor: "bg-gradient-to-r from-yellow-600/90 to-yellow-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
      prefix: "Iterate:",
      promptPrefix: "Refine your answer based on this feedback:",
      placeholder: "refine based on feedback...",
      emoji: "🔁",
      glowColor: "bg-yellow-600",
    },
    benchmark: {
      bgColor: "bg-gradient-to-r from-amber-600/90 to-amber-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
      prefix: "Compare:",
      promptPrefix: "Benchmark your approach against industry best practices:",
      placeholder: "benchmark against best practices...",
      emoji: "🏆",
      glowColor: "bg-amber-600",
    },
    // New Logic & Dynamic Blocks
    if: {
      bgColor: "bg-gradient-to-r from-orange-700/90 to-red-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", // Standard rectangle for now
      prefix: "IF:",
      promptPrefix: "IF the following condition is met:",
      placeholder: "input contains 'urgent'",
      emoji: "❓",
      glowColor: "bg-orange-700",
    },
    then: {
      bgColor: "bg-gradient-to-r from-green-700/90 to-teal-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", // Standard rectangle for now
      prefix: "THEN:",
      promptPrefix: "THEN perform the following action:",
      placeholder: "summarize concisely",
      emoji: "✅",
      glowColor: "bg-green-700",
    },
    loop: {
      bgColor: "bg-gradient-to-r from-purple-700/90 to-indigo-700/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", // Standard rectangle for now
      prefix: "LOOP:",
      promptPrefix: "REPEAT the following action:",
      placeholder: "for each item in the list",
      emoji: "🔄",
      glowColor: "bg-purple-700",
    },
    inject: {
      bgColor: "bg-gradient-to-r from-gray-700/90 to-gray-800/90",
      textColor: "text-white",
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", // Standard rectangle for now
      prefix: "INJECT:",
      promptPrefix: "INJECT dynamic content here:",
      placeholder: "{{user_name}}",
      emoji: "💉",
      glowColor: "bg-gray-700",
    },
  }

  return configs[type] || configs.instruction
}
