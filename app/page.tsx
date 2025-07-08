"use client"

import { useState, useEffect, useRef } from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { BlockPalette } from "@/components/block-palette"
import { PromptCanvas } from "@/components/prompt-canvas"
import { PromptPreview } from "@/components/prompt-preview"
import { SuggestionPanel } from "@/components/suggestion-panel"
import { HistoryPanel } from "@/components/history-panel"
import type { Block, BlockType } from "@/types/blocks"
import { generateId } from "@/lib/utils"
import { getBlockConfig } from "@/lib/block-configs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { History, Lightbulb, DollarSign, Sun, Moon } from "lucide-react" // Import Sun and Moon
import { useTheme } from "next-themes" // Import useTheme

export default function PromptEngineeringTool() {
  const [activeBlock, setActiveBlock] = useState<Block | null>(null)
  const [canvasBlocks, setCanvasBlocks] = useState<Block[]>([])
  const [promptHistory, setPromptHistory] = useState<Block[][]>([[]])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)
  const [savedVersions, setSavedVersions] = useState<
    { id: string; name: string; blocks: Block[]; timestamp: string }[]
  >([])
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false)
  const [isSuggestionSheetOpen, setIsSuggestionSheetOpen] = useState(false)

  // New state and ref for scrolling and highlighting
  const canvasRef = useRef<{ scrollToBlock: (id: string) => void }>(null)
  const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(null)

  // New state for live token cost and count
  const [liveTokenCount, setLiveTokenCount] = useState(0)
  const [liveEstimatedCost, setLiveEstimatedCost] = useState(0)

  const isUpdatingHistoryRef = useRef(false)
  const { theme, setTheme } = useTheme() // Initialize useTheme

  // Effect to update history when canvasBlocks change due to user actions
  useEffect(() => {
    if (isUpdatingHistoryRef.current) {
      isUpdatingHistoryRef.current = false // Reset flag
      return
    }

    // Only add to history if the current state is different from the last history entry
    if (JSON.stringify(canvasBlocks) !== JSON.stringify(promptHistory[currentHistoryIndex])) {
      const newHistory = promptHistory.slice(0, currentHistoryIndex + 1)
      setPromptHistory([...newHistory, canvasBlocks])
      setCurrentHistoryIndex(newHistory.length)
    }
  }, [canvasBlocks]) // eslint-disable-line react-hooks/exhaustive-deps

  // Wrapper to update canvasBlocks and history
  const updateCanvasBlocks = (newBlocks: Block[]) => {
    setCanvasBlocks(newBlocks)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const blockType = active.data.current?.type as BlockType

    if (blockType) {
      setActiveBlock({
        id: generateId(),
        type: blockType,
        content: active.data.current?.defaultContent || "",
        category: active.data.current?.category || "instruction",
      })
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && over.id === "canvas" && activeBlock) {
      updateCanvasBlocks([...canvasBlocks, activeBlock])
    }

    setActiveBlock(null)
  }

  const updateBlock = (id: string, content: string) => {
    updateCanvasBlocks(canvasBlocks.map((block) => (block.id === id ? { ...block, content } : block)))
  }

  const removeBlock = (id: string) => {
    updateCanvasBlocks(canvasBlocks.filter((block) => block.id !== id))
  }

  const addSuggestedBlock = (blockType: BlockType, content: string) => {
    const newBlock: Block = {
      id: generateId(),
      type: blockType,
      content,
      category: "suggestion",
    }
    updateCanvasBlocks([...canvasBlocks, newBlock])
  }

  const undo = () => {
    if (currentHistoryIndex > 0) {
      isUpdatingHistoryRef.current = true
      const newIndex = currentHistoryIndex - 1
      setCurrentHistoryIndex(newIndex)
      setCanvasBlocks(promptHistory[newIndex])
    }
  }

  const redo = () => {
    if (currentHistoryIndex < promptHistory.length - 1) {
      isUpdatingHistoryRef.current = true
      const newIndex = currentHistoryIndex + 1
      setCurrentHistoryIndex(newIndex)
      setCanvasBlocks(promptHistory[newIndex])
    }
  }

  const saveVersion = (name: string) => {
    const newVersion = {
      id: generateId(),
      name,
      blocks: [...canvasBlocks], // Deep copy current blocks
      timestamp: new Date().toISOString(),
    }
    setSavedVersions((prev) => [...prev, newVersion])
  }

  const onLoadVersion = (versionId: string) => {
    const versionToLoad = savedVersions.find((v) => v.id === versionId)
    if (versionToLoad) {
      isUpdatingHistoryRef.current = true
      setPromptHistory([versionToLoad.blocks]) // Reset history to this point
      setCurrentHistoryIndex(0)
      setCanvasBlocks(versionToLoad.blocks)
    }
  }

  // New function to scroll to a specific block and highlight it
  const handleScrollToBlock = (blockId: string) => {
    if (canvasRef.current) {
      canvasRef.current.scrollToBlock(blockId)
      setHighlightedBlockId(blockId)
      // Remove highlight after a short delay
      setTimeout(() => {
        setHighlightedBlockId(null)
      }, 1000)
    }
  }

  // Callback to update live token count and cost from PromptPreview
  const handleUpdateEstimates = (tokenCount: number, estimatedCost: number) => {
    setLiveTokenCount(tokenCount)
    setLiveEstimatedCost(estimatedCost)
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Block Palette */}
        <div className="w-80 backdrop-blur-xl bg-white/20 border-r border-white/30 shadow-2xl relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-r-3xl"></div>
          <BlockPalette />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col relative z-10">
          <header className="backdrop-blur-xl bg-white/20 border-b border-white/30 px-8 py-6 shadow-lg flex items-center justify-between">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none rounded-b-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Prompt Engineering Studio
              </h1>
              <p className="text-gray-700/80 mt-2 font-medium">Build AI prompts visually with drag-and-drop blocks</p>
            </div>
            <div className="flex items-center gap-6 relative z-10">
              {" "}
              {/* Adjusted gap */}
              {/* Live Token Cost */}
              <div className="flex items-center gap-2 text-gray-700 font-medium text-sm backdrop-blur-sm bg-white/20 border border-white/30 rounded-2xl px-4 py-2 shadow-lg">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span>Cost: ${liveEstimatedCost.toFixed(5)}</span>
                <span className="ml-2 text-gray-500">({liveTokenCount} tokens)</span>
              </div>
              <div className="flex gap-3">
                {/* Dark Mode Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30 text-gray-700 rounded-2xl shadow-lg"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>

                {/* History Panel Trigger */}
                <Sheet open={isHistorySheetOpen} onOpenChange={setIsHistorySheetOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30 text-gray-700 rounded-2xl shadow-lg"
                    >
                      <History className="w-4 h-4 mr-2" />
                      History
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-80 sm:max-w-md p-0 backdrop-blur-xl bg-white/20 border-l border-white/30 shadow-2xl"
                  >
                    <HistoryPanel
                      blocks={canvasBlocks}
                      promptHistory={promptHistory}
                      currentHistoryIndex={currentHistoryIndex}
                      savedVersions={savedVersions}
                      onUndo={undo}
                      onRedo={redo}
                      onSaveVersion={saveVersion}
                      onLoadVersion={onLoadVersion}
                    />
                  </SheetContent>
                </Sheet>

                {/* Suggestion Panel Trigger */}
                <Sheet open={isSuggestionSheetOpen} onOpenChange={setIsSuggestionSheetOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30 text-gray-700 rounded-2xl shadow-lg"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Suggestions
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-80 sm:max-w-md p-0 backdrop-blur-xl bg-white/20 border-l border-white/30 shadow-2xl"
                  >
                    <SuggestionPanel blocks={canvasBlocks} onAddBlock={addSuggestedBlock} />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* Canvas */}
            <div className="flex-1 p-8">
              <SortableContext items={canvasBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                <PromptCanvas
                  ref={canvasRef} // Pass ref to PromptCanvas
                  blocks={canvasBlocks}
                  onUpdateBlock={updateBlock}
                  onRemoveBlock={removeBlock}
                  highlightedBlockId={highlightedBlockId} // Pass highlighted block ID
                />
              </SortableContext>
            </div>

            {/* Right Panel - Only Prompt Preview remains fixed */}
            <div className="w-80 flex flex-col overflow-y-auto">
              <div className="flex-1 backdrop-blur-xl bg-white/20 border-l border-white/30 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-tl-3xl"></div>
                <PromptPreview
                  blocks={canvasBlocks}
                  onScrollToBlock={handleScrollToBlock}
                  onUpdateEstimates={handleUpdateEstimates} // Pass the callback
                />
              </div>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeBlock && (
            <div className="opacity-90 transform rotate-2 scale-110">
              <ScratchBlock block={activeBlock} isPreview />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

// Mini preview component for drag overlay
function ScratchBlock({ block, isPreview = false }: { block: Block; isPreview?: boolean }) {
  const blockConfig = getBlockConfig(block.type)

  return (
    <div
      className={`
      relative inline-block min-w-48 cursor-pointer select-none
      ${blockConfig.bgColor} ${blockConfig.textColor}
      ${isPreview ? "shadow-2xl backdrop-blur-sm" : "shadow-xl hover:shadow-2xl backdrop-blur-sm"}
      transition-all duration-300 border border-white/20
    `}
      style={{
        clipPath: blockConfig.clipPath,
        borderRadius: "16px",
      }}
    >
      <div className="px-5 py-4 font-medium text-sm">
        <span className="text-lg mr-2">{blockConfig.emoji}</span>
        {blockConfig.prefix} {block.content || blockConfig.placeholder}
      </div>
    </div>
  )
}
