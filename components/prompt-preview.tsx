"use client"

import { useState, useMemo, useEffect } from "react"
import type { Block } from "@/types/blocks"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Copy, Play, Download, Sparkles, Bug, Info, DollarSign, MessageSquare, LayoutList } from "lucide-react"
import { getBlockConfig } from "@/utils/block-config"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AiFeedback } from "./ai-feedback"
import { generateSimulatedAiFeedback } from "@/lib/simulated-ai" // Import the new simulated AI feedback function

interface PromptPreviewProps {
  blocks: Block[]
  onScrollToBlock: (blockId: string) => void
  onUpdateEstimates: (tokenCount: number, estimatedCost: number) => void
}

// Pricing constants for gpt-3.5-turbo (approximate, as of early 2024)
const GPT_3_5_TURBO_INPUT_COST_PER_1K_TOKENS = 0.0005
const GPT_3_5_TURBO_OUTPUT_COST_PER_1K_TOKENS = 0.0015
const ESTIMATED_OUTPUT_MULTIPLIER = 1.5 // Assume output is 1.5x input length for estimation

export function PromptPreview({ blocks, onScrollToBlock, onUpdateEstimates }: PromptPreviewProps) {
  const [isSimulating, setIsSimulating] = useState(false)
  const [result, setResult] = useState<{ final_answer: string; thought_process?: string } | null>(null)
  const [testInput, setTestInput] = useState("")
  const [activeTab, setActiveTab] = useState<"preview" | "analysis">("preview")
  const [isBlockFlowSheetOpen, setIsBlockFlowSheetOpen] = useState(false)
  const [isTestInputDialogOpen, setIsTestInputDialogOpen] = useState(false)
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<string | null>(null)
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)

  const assemblePrompt = (includeCoTInstruction = false) => {
    if (blocks.length === 0) return ""

    const systemBlocks = blocks.filter((b) => b.type === "system" || b.type === "persona")
    const otherBlocks = blocks.filter((b) => b.type !== "system" && b.type !== "persona")

    let prompt = ""

    // Add system/persona messages first
    if (systemBlocks.length > 0) {
      prompt += systemBlocks
        .map((b) => {
          const config = getBlockConfig(b.type)
          return `${config.promptPrefix} ${b.content}`
        })
        .join("\n\n")
      prompt += "\n\n"
    }

    // Add other blocks with their promptPrefixes
    prompt += otherBlocks
      .map((b) => {
        const config = getBlockConfig(b.type)
        return `${config.promptPrefix} ${b.content}`
      })
      .join("\n\n")

    // Add test input if provided
    if (testInput.trim()) {
      prompt += "\n\n" + testInput
    }

    // Add Chain-of-Thought instruction if requested and block is present
    const hasCoT = blocks.some((b) => b.type === "chain-of-thought")
    if (includeCoTInstruction && hasCoT) {
      prompt +=
        "\n\n" +
        "Please provide your thought process step-by-step before the final answer. " +
        "Format your response as a JSON object with two keys: 'thought_process' (string) and 'final_answer' (string)."
    }

    return prompt.trim()
  }

  const getEstimatedTokenCount = (text: string) => {
    // Simple approximation: 1 word ~ 0.75 tokens
    return Math.ceil(text.split(/\s+/).filter(Boolean).length * 0.75)
  }

  const prompt = useMemo(() => assemblePrompt(), [blocks, testInput])
  const tokenCount = getEstimatedTokenCount(prompt)

  const calculateEstimates = useMemo(() => {
    const estimatedOutputTokens = Math.ceil(tokenCount * ESTIMATED_OUTPUT_MULTIPLIER)
    const estimatedCost =
      (tokenCount / 1000) * GPT_3_5_TURBO_INPUT_COST_PER_1K_TOKENS +
      (estimatedOutputTokens / 1000) * GPT_3_5_TURBO_OUTPUT_COST_PER_1K_TOKENS
    const estimatedResponseWords = Math.ceil(estimatedOutputTokens / 0.75)

    return { estimatedCost, estimatedResponseWords }
  }, [tokenCount])

  const { estimatedCost, estimatedResponseWords } = calculateEstimates

  // Effect to send updated estimates to parent component
  useEffect(() => {
    onUpdateEstimates(tokenCount, estimatedCost)
  }, [tokenCount, estimatedCost, onUpdateEstimates])

  const handleSimulate = async () => {
    const hasCoT = blocks.some((b) => b.type === "chain-of-thought")
    const fullPrompt = assemblePrompt(hasCoT)

    if (!fullPrompt) return

    setIsSimulating(true)
    setResult(null) // Clear previous result
    setAiFeedback(null) // Clear previous AI feedback
    setIsTestInputDialogOpen(false) // Close the input dialog

    // Simulate a delay for demonstration
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let simulatedThoughtProcess = ""
    let simulatedFinalAnswer = ""

    if (hasCoT) {
      simulatedThoughtProcess = `Simulating thought process for: "${fullPrompt.substring(0, 100)}..."\n\nSteps:\n1. Analyze input and prompt blocks.\n2. Formulate a plan based on instructions.\n3. Generate response.`
      simulatedFinalAnswer = `This is a simulated response based on your prompt structure and test input. The actual AI output would vary.

Prompt:
${fullPrompt}

Test Input:
${testInput}`
    } else {
      simulatedFinalAnswer = `This is a simulated response based on your prompt structure and test input. The actual AI output would vary.

Prompt:
${fullPrompt}

Test Input:
${testInput}`
    }

    setResult({
      final_answer: simulatedFinalAnswer,
      thought_process: simulatedThoughtProcess,
    })

    setIsSimulating(false)
    setIsResultDialogOpen(true) // Open the result dialog

    // Generate AI feedback locally (simulated)
    setIsGeneratingFeedback(true)
    try {
      const generatedFeedback = generateSimulatedAiFeedback(
        blocks,
        testInput,
        simulatedFinalAnswer,
        simulatedThoughtProcess,
      )
      // Simulate a short delay for feedback generation
      await new Promise((resolve) => setTimeout(resolve, 500))
      setAiFeedback(generatedFeedback)
    } catch (error) {
      console.error("Error generating simulated AI feedback:", error)
      setAiFeedback("Could not generate simulated AI feedback at this time.")
    } finally {
      setIsGeneratingFeedback(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt)
  }

  const handleExport = () => {
    const promptData = {
      blocks,
      assembledPrompt: prompt,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(promptData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "prompt-engineering-project.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const getWarnings = () => {
    const warnings: string[] = []
    const blockTypes = blocks.map((b) => b.type)

    if (!blockTypes.includes("system") && !blockTypes.includes("persona")) {
      warnings.push("Consider adding a 'System Role' or 'Persona' block for clear AI behavior.")
    }
    if (!blockTypes.includes("instruction") && !blockTypes.includes("task")) {
      warnings.push("It's good practice to include an 'Instruction' or 'Task' block.")
    }
    if (blockTypes.filter((type) => type === "constraint").length > 2) {
      warnings.push("Too many 'Constraint' blocks might make the prompt overly restrictive.")
    }
    // Add more linting rules here
    return warnings
  }

  const warnings = getWarnings()

  return (
    <div className="h-full flex flex-col relative z-10">
      <div className="p-6 border-b border-white/30 backdrop-blur-sm bg-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-br-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              {activeTab === "preview" ? (
                <Sparkles className="w-6 h-6 text-purple-500" />
              ) : (
                <Bug className="w-6 h-6 text-red-500" />
              )}
              {activeTab === "preview" ? "Live Preview" : "Prompt Debugger"}
            </h3>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "preview" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("preview")}
                className={`rounded-2xl shadow-lg ${
                  activeTab === "preview"
                    ? "bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white"
                    : "backdrop-blur-sm bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                }`}
              >
                Preview
              </Button>
              <Button
                variant={activeTab === "analysis" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("analysis")}
                className={`rounded-2xl shadow-lg ${
                  activeTab === "analysis"
                    ? "bg-gradient-to-r from-red-500/90 to-orange-500/90 text-white"
                    : "backdrop-blur-sm bg-white/20 border-white/30 text-gray-700 hover:bg-white/30"
                }`}
              >
                Debug
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!prompt}
              className="backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30 text-gray-700 rounded-2xl shadow-lg"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={blocks.length === 0}
              className="backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30 text-gray-700 rounded-2xl shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {/* Block Flow Trigger */}
            <Sheet open={isBlockFlowSheetOpen} onOpenChange={setIsBlockFlowSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30 text-gray-700 rounded-2xl shadow-lg"
                >
                  <LayoutList className="w-4 h-4 mr-2" />
                  Block Flow
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 sm:max-w-md p-0 backdrop-blur-xl bg-white/20 border-l border-white/30 shadow-2xl"
              >
                <div className="h-full flex flex-col relative z-10">
                  <div className="p-6 border-b border-white/30 backdrop-blur-sm bg-white/10 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-br-3xl"></div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <LayoutList className="w-6 h-6 text-purple-500" />
                        Block Flow ({blocks.length} blocks)
                      </h3>
                      <p className="text-sm text-gray-600/80 font-medium mb-4">
                        Visual representation of your prompt blocks
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {blocks.length === 0 ? (
                      <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-50/40 to-purple-50/40 border-2 border-dashed border-blue-300/50 rounded-3xl shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
                        <CardContent className="p-8 text-center relative z-10">
                          <div className="text-4xl mb-4">🧩</div>
                          <h4 className="font-bold text-gray-700 mb-2">No Blocks Added</h4>
                          <p className="text-sm text-gray-600">Drag blocks to the canvas to see their flow here.</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="border-2 border-dashed border-purple-300/50 backdrop-blur-xl bg-gradient-to-br from-purple-50/40 to-pink-50/40 rounded-3xl shadow-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
                        <CardContent className="relative z-10 p-6">
                          <div className="space-y-3">
                            {blocks.map((block, index) => {
                              const config = getBlockConfig(block.type)
                              return (
                                <div
                                  key={block.id}
                                  className="flex items-center gap-3 text-sm backdrop-blur-sm bg-white/20 rounded-2xl p-3 border border-white/30 cursor-pointer hover:bg-white/30 transition-colors"
                                  onClick={() => {
                                    onScrollToBlock(block.id)
                                    setIsBlockFlowSheetOpen(false)
                                  }}
                                >
                                  <div className="w-7 h-7 rounded-2xl bg-gray-800 text-white text-xs flex items-center justify-center font-bold shadow-lg">
                                    {index + 1}
                                  </div>
                                  <span className="text-lg">{config.emoji}</span>
                                  <span className="font-bold text-gray-700">{config.prefix}</span>
                                  <span className="italic text-gray-600 truncate font-medium">
                                    {block.content || config.placeholder}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "preview" && (
          <>
            {/* Assembled Prompt */}
            <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-sm font-bold text-gray-700">📝 Final Prompt</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <Textarea
                  value={prompt}
                  readOnly
                  placeholder="Your assembled prompt will appear here..."
                  className="min-h-32 text-sm font-mono backdrop-blur-sm bg-white/30 border-white/40 rounded-2xl shadow-inner"
                />
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "analysis" && (
          <>
            {/* Prompt Breakdown */}
            <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Bug className="w-4 h-4" /> Prompt Breakdown ({tokenCount} tokens)
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                {blocks.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <div className="text-3xl mb-3">🔍</div>
                    <p className="text-sm font-medium">Add blocks to see the prompt breakdown.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blocks.map((block, index) => {
                      const config = getBlockConfig(block.type)
                      return (
                        <div
                          key={block.id}
                          className="backdrop-blur-sm bg-white/30 rounded-2xl p-3 border border-white/40 shadow-inner"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{config.emoji}</span>
                            <span className="font-bold text-gray-800 capitalize">{block.type.replace("-", " ")}</span>
                            <span className="ml-auto text-xs text-gray-500">
                              ({getEstimatedTokenCount(`${config.promptPrefix} ${block.content}`)} tokens)
                            </span>
                          </div>
                          <p className="text-sm font-mono text-gray-700 whitespace-pre-wrap">
                            <span className="font-semibold">{config.promptPrefix}</span> {block.content}
                          </p>
                        </div>
                      )
                    })}
                    {testInput && (
                      <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-3 border border-white/40 shadow-inner">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">💬</span>
                          <span className="font-bold text-gray-800">User Input</span>
                          <span className="ml-auto text-xs text-gray-500">
                            ({getEstimatedTokenCount(testInput)} tokens)
                          </span>
                        </div>
                        <p className="text-sm font-mono text-gray-700 whitespace-pre-wrap">{testInput}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost & Response Estimate */}
            <Card className="backdrop-blur-xl bg-blue-50/40 border border-blue-300/50 rounded-3xl shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-sm font-bold text-blue-800 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Cost & Response Estimate
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 space-y-3 text-sm font-medium text-gray-700">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-600" /> Estimated Response Length:
                  </span>
                  <span className="font-bold text-purple-700">{estimatedResponseWords} words</span>
                </div>
                <p className="text-xs text-gray-500 italic mt-2">
                  *Estimates based on gpt-3.5-turbo pricing and a {ESTIMATED_OUTPUT_MULTIPLIER}x output multiplier.
                  Actual costs may vary.
                </p>
              </CardContent>
            </Card>

            {/* Warnings/Linting */}
            {warnings.length > 0 && (
              <Card className="backdrop-blur-xl bg-red-50/40 border border-red-300/50 rounded-3xl shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
                <CardHeader className="pb-3 relative z-10">
                  <CardTitle className="text-sm font-bold text-red-800 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="list-disc pl-5 space-y-2 text-sm text-red-700 font-medium">
                    {warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Simulate Response Button and Dialogs */}
        <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
          <CardContent className="space-y-4 p-6 relative z-10">
            <Dialog open={isTestInputDialogOpen} onOpenChange={setIsTestInputDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={!prompt}
                  className="w-full bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-600/90 hover:to-pink-600/90 text-white rounded-2xl shadow-xl backdrop-blur-sm border border-white/20 font-bold"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Simulate Response
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] backdrop-blur-xl bg-white/80 border border-white/30 rounded-3xl shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">🧪 Enter Test Input</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Provide input to see how your assembled prompt performs.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="e.g., 'Summarize this article: [article text]'"
                    className="min-h-32 text-sm backdrop-blur-sm bg-white/30 border-white/40 rounded-2xl shadow-inner"
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleSimulate}
                    disabled={isSimulating}
                    className="bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-600/90 hover:to-purple-600/90 text-white rounded-2xl shadow-lg"
                  >
                    {isSimulating ? "Simulating..." : "Run Simulation"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Results Dialog */}
            <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
              <DialogContent className="sm:max-w-[700px] backdrop-blur-xl bg-white/80 border border-green-300/50 rounded-3xl shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-green-800">✨ Simulated Response</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    This is a simulated output based on your prompt and test input.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {result && (
                    <>
                      {result.thought_process && (
                        <div className="backdrop-blur-sm bg-white/40 p-4 rounded-2xl border border-white/30 text-sm font-medium shadow-inner">
                          <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <Bug className="w-4 h-4" /> Simulated Thought Process
                          </h4>
                          <p className="whitespace-pre-wrap">{result.thought_process}</p>
                        </div>
                      )}

                      <div className="backdrop-blur-sm bg-white/40 p-4 rounded-2xl border border-white/30 text-sm whitespace-pre-wrap font-medium shadow-inner">
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Simulated Final Answer
                        </h4>
                        <p className="whitespace-pre-wrap">{result.final_answer}</p>
                      </div>
                    </>
                  )}
                  {/* AI Feedback Section */}
                  <AiFeedback feedback={aiFeedback || ""} isLoading={isGeneratingFeedback} />
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => setIsResultDialogOpen(false)}
                    className="bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-600/90 hover:to-purple-600/90 text-white rounded-2xl shadow-lg"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
