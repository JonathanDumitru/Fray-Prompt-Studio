import type { Block } from "@/types/blocks"

/**
 * Generates simulated AI feedback based on prompt structure and content.
 * This function acts as Fray's internal "Prompt Doctor PhD".
 */
export function generateSimulatedAiFeedback(
  blocks: Block[],
  testInput: string,
  simulatedFinalAnswer: string,
  simulatedThoughtProcess?: string,
): string {
  let feedback = "Fray's Internal AI Feedback: "
  const blockTypes = new Set(blocks.map((b) => b.type))

  // General structure and completeness
  if (blocks.length === 0) {
    feedback += "Your canvas is empty! Start by dragging some blocks from the palette to build your prompt. "
  } else if (blocks.length < 3) {
    feedback += "Your prompt is quite concise. Consider adding more detail or specific blocks to guide the AI. "
  }

  // Essential blocks check
  const hasSystemOrPersona = blockTypes.has("system") || blockTypes.has("persona")
  if (!hasSystemOrPersona) {
    feedback += "A 'System Role' or 'Persona' block is highly recommended to set the AI's behavior and tone. "
  }

  const hasInstructionOrTask = blockTypes.has("instruction") || blockTypes.has("task")
  if (!hasInstructionOrTask) {
    feedback += "Clearly defining the 'Instruction' or 'Task' is crucial for the AI to understand its objective. "
  }

  // Quality and clarity
  if (!blockTypes.has("context") && blocks.length > 1) {
    feedback += "Adding a 'Context' block can provide essential background information, improving relevance. "
  }
  if (!blockTypes.has("format") && blocks.length > 2) {
    feedback += "Consider using a 'Format' block to specify the desired output structure (e.g., JSON, bullet points). "
  }
  if (!blockTypes.has("example") && !blockTypes.has("few-shot") && blocks.length > 2) {
    feedback += "Examples (single or few-shot) can significantly clarify expectations for the AI. "
  }

  // Advanced reasoning suggestions
  if (blocks.length >= 4 && !blockTypes.has("chain-of-thought") && !blockTypes.has("tree-of-thought")) {
    feedback += "For complex tasks, 'Chain-of-Thought' or 'Tree-of-Thought' blocks can encourage better reasoning. "
  }
  if (blockTypes.has("chain-of-thought") && !blockTypes.has("self-reflection")) {
    feedback += "Pairing 'Chain-of-Thought' with 'Self-Reflection' can lead to more robust outputs. "
  }

  // Constraints and safety
  const constraintBlocks = blocks.filter((b) => b.type === "constraint")
  if (constraintBlocks.length > 0 && constraintBlocks.length > 2) {
    feedback +=
      "Too many 'Constraint' blocks might make the prompt overly restrictive or lead to conflicts. Review them. "
  }
  if (!blockTypes.has("safety") && blocks.length > 3) {
    feedback += "For public-facing applications, a 'Safety' block is important to prevent undesirable outputs. "
  }

  // Test input analysis
  if (testInput.trim() === "") {
    feedback += "A meaningful 'Test Input' is vital for accurate simulation and debugging. "
  } else if (
    simulatedFinalAnswer.includes("I cannot fulfill this request") ||
    simulatedFinalAnswer.includes("I need more information")
  ) {
    feedback +=
      "The simulated response indicates a potential issue. Review your prompt for clarity or missing context. "
  } else if (simulatedFinalAnswer.length < 50 && testInput.length > 100) {
    feedback +=
      "The simulated response seems too short for the given test input. Consider if your prompt is too restrictive or ambiguous. "
  }

  // Check for redundancy (simple check)
  const contentMap = new Map<string, number>()
  blocks.forEach((block) => {
    const normalizedContent = block.content.toLowerCase().trim()
    contentMap.set(normalizedContent, (contentMap.get(normalizedContent) || 0) + 1)
  })
  for (const [content, count] of contentMap.entries()) {
    if (count > 1 && content.length > 10) {
      // Only flag longer, repeated content
      feedback += `You have repeated content: "${content}". Consider consolidating or rephrasing for conciseness. `
      break
    }
  }

  // If no specific feedback, provide general encouragement
  if (feedback === "Fray's Internal AI Feedback: ") {
    feedback += "Your prompt looks well-structured and clear! Keep experimenting to find optimal results. "
  }

  return feedback.trim()
}
