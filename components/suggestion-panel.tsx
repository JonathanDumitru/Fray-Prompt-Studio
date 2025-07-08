"use client"

import { useState, useEffect } from "react"
import type { Block, BlockType } from "@/types/blocks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Plus, Sparkles, Target, Shield, Zap, RefreshCw } from "lucide-react"

interface Suggestion {
  blockType: BlockType
  content: string
  reason: string
  category: "essential" | "quality" | "advanced" | "safety"
  priority: number
  emoji: string
}

interface SuggestionPanelProps {
  blocks: Block[]
  onAddBlock: (blockType: BlockType, content: string) => void
}

export function SuggestionPanel({ blocks, onAddBlock }: SuggestionPanelProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  // Rule-based suggestions
  const generateRuleBasedSuggestions = (): Suggestion[] => {
    const blockTypes = blocks.map((b) => b.type)
    const currentSuggestions: Suggestion[] = []

    // Essential blocks
    if (!blockTypes.includes("system") && !blockTypes.includes("persona")) {
      currentSuggestions.push({
        blockType: "system",
        content: "a helpful AI assistant",
        reason: "Every good prompt needs a clear system role to set expectations",
        category: "essential",
        priority: 10,
        emoji: "🎭",
      })
    }

    if (blockTypes.length > 0 && !blockTypes.includes("task") && !blockTypes.includes("instruction")) {
      currentSuggestions.push({
        blockType: "task",
        content: "analyze and summarize the key points",
        reason: "Define what you want the AI to actually do",
        category: "essential",
        priority: 9,
        emoji: "🎯",
      })
    }

    // Quality improvements
    if (blockTypes.includes("system") && !blockTypes.includes("context")) {
      currentSuggestions.push({
        blockType: "context",
        content: "this is for a business presentation",
        reason: "Context helps the AI understand the situation better",
        category: "quality",
        priority: 7,
        emoji: "📚",
      })
    }

    if (blockTypes.includes("task") && !blockTypes.includes("format")) {
      currentSuggestions.push({
        blockType: "format",
        content: "respond in bullet points with clear headings",
        reason: "Specify output format for consistent, usable results",
        category: "quality",
        priority: 6,
        emoji: "📋",
      })
    }

    if (blockTypes.includes("instruction") && !blockTypes.includes("example")) {
      currentSuggestions.push({
        blockType: "example",
        content: "Input: 'Market analysis' → Output: '• Key trends • Opportunities • Risks'",
        reason: "Examples dramatically improve AI understanding",
        category: "quality",
        priority: 8,
        emoji: "💡",
      })
    }

    // Advanced techniques
    if (blocks.length >= 3 && !blockTypes.includes("chain-of-thought")) {
      currentSuggestions.push({
        blockType: "chain-of-thought",
        content: "think through this step by step",
        reason: "Improves reasoning quality for complex tasks",
        category: "advanced",
        priority: 5,
        emoji: "🧠",
      })
    }

    if (blockTypes.includes("example") && !blockTypes.includes("self-reflection")) {
      currentSuggestions.push({
        blockType: "self-reflection",
        content: "review your answer and check for accuracy",
        reason: "Self-correction leads to higher quality outputs",
        category: "advanced",
        priority: 4,
        emoji: "🪞",
      })
    }

    // Safety considerations
    if (blocks.length >= 2 && !blockTypes.includes("safety")) {
      currentSuggestions.push({
        blockType: "safety",
        content: "avoid harmful, biased, or inappropriate content",
        reason: "Important for responsible AI use",
        category: "safety",
        priority: 6,
        emoji: "🛡️",
      })
    }

    if (blockTypes.includes("task") && !blockTypes.includes("uncertainty")) {
      currentSuggestions.push({
        blockType: "uncertainty",
        content: "if unsure, say so and explain your confidence level",
        reason: "Helps users understand AI limitations",
        category: "safety",
        priority: 3,
        emoji: "❓",
      })
    }

    return currentSuggestions.sort((a, b) => b.priority - a.priority).slice(0, 6)
  }

  useEffect(() => {
    setSuggestions(generateRuleBasedSuggestions())
  }, [blocks])

  const handleRefreshSuggestions = () => {
    setSuggestions(generateRuleBasedSuggestions())
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "essential":
        return <Target className="w-4 h-4" />
      case "quality":
        return <Sparkles className="w-4 h-4" />
      case "advanced":
        return <Zap className="w-4 h-4" />
      case "safety":
        return <Shield className="w-4 h-4" />
      default:
        return <Lightbulb className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "essential":
        return "bg-red-100 text-red-800 border-red-200"
      case "quality":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "advanced":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "safety":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="h-full flex flex-col relative z-10">
      <div className="p-6 border-b border-white/30 backdrop-blur-sm bg-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-br-3xl"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Smart Suggestions
          </h3>
          <p className="text-sm text-gray-600/80 font-medium mb-4">Recommendations to improve your prompt</p>
          <Button
            onClick={handleRefreshSuggestions}
            disabled={blocks.length === 0}
            size="sm"
            className="backdrop-blur-sm bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-600/90 hover:to-pink-600/90 text-white rounded-2xl shadow-lg border border-white/20"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Get Suggestions
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {blocks.length === 0 ? (
          <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-50/40 to-purple-50/40 border-2 border-dashed border-blue-300/50 rounded-3xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="font-bold text-gray-700 mb-2">Start Building!</h4>
              <p className="text-sm text-gray-600">
                Add your first block to get personalized suggestions for improving your prompt.
              </p>
            </CardContent>
          </Card>
        ) : suggestions.length === 0 ? (
          <Card className="backdrop-blur-xl bg-gradient-to-br from-green-50/40 to-emerald-50/40 border border-green-300/50 rounded-3xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
            <CardContent className="p-6 text-center relative z-10">
              <div className="text-3xl mb-3">🎉</div>
              <h4 className="font-bold text-gray-700 mb-2">Great Job!</h4>
              <p className="text-sm text-gray-600">Your prompt looks well-structured.</p>
            </CardContent>
          </Card>
        ) : (
          suggestions.map((suggestion, index) => (
            <Card
              key={`${suggestion.blockType}-${index}`}
              className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{suggestion.emoji}</span>
                    <CardTitle className="text-sm font-bold text-gray-700 capitalize">
                      {suggestion.blockType.replace("-", " ")}
                    </CardTitle>
                  </div>
                  <Badge className={`text-xs ${getCategoryColor(suggestion.category)} backdrop-blur-sm`}>
                    {getCategoryIcon(suggestion.category)}
                    <span className="ml-1 capitalize">{suggestion.category}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-sm text-gray-600 mb-3 font-medium">{suggestion.reason}</p>
                <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-3 mb-4 border border-white/40">
                  <p className="text-xs font-mono text-gray-700 italic">"{suggestion.content}"</p>
                </div>
                <Button
                  onClick={() => onAddBlock(suggestion.blockType, suggestion.content)}
                  size="sm"
                  className="w-full backdrop-blur-sm bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-600/90 hover:to-purple-600/90 text-white rounded-2xl shadow-lg border border-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add This Block
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
