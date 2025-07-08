import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Block } from "@/types/blocks"
import { CanvasBlock } from "@/components/canvas-block"

interface PromptCanvasProps {
  blocks: Block[]
  onUpdateBlock: (id: string, content: string) => void
  onRemoveBlock: (id: string) => void
}

export function PromptCanvas({ blocks, onUpdateBlock, onRemoveBlock }: PromptCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-96 border-2 border-dashed rounded-3xl p-10 transition-all duration-500
        backdrop-blur-xl shadow-2xl relative overflow-y-auto // Changed from overflow-hidden to overflow-y-auto
        ${
          isOver
            ? "border-blue-400/60 bg-gradient-to-br from-blue-50/40 to-purple-50/40 scale-105 shadow-3xl"
            : "border-white/30 bg-gradient-to-br from-white/20 to-white/10"
        }
        ${blocks.length === 0 ? "flex items-center justify-center" : ""}
      `}
    >
      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-8 w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-12 right-6 w-1 h-1 bg-indigo-500 rounded-full animate-pulse delay-1000"></div>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center text-gray-600 relative z-10">
          <div className="text-7xl mb-6 animate-bounce">🧩</div>
          <div className="backdrop-blur-sm bg-white/20 rounded-3xl p-8 border border-white/30 shadow-lg">
            <p className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Drag blocks here to build your prompt
            </p>
            <p className="text-sm opacity-75 font-medium">Start with a System Role or Instruction block</p>
            <div className="mt-6 flex justify-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse delay-200 shadow-lg"></div>
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-pulse delay-400 shadow-lg"></div>
            </div>
          </div>
        </div>
      ) : (
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-6 relative z-10">
            {blocks.map((block, index) => (
              <div key={block.id} className="relative">
                {/* Connection line to next block */}
                {index < blocks.length - 1 && (
                  <div className="absolute left-1/2 -bottom-3 w-1 h-6 bg-gradient-to-b from-white/40 to-white/20 transform -translate-x-1/2 z-0 rounded-full shadow-sm"></div>
                )}
                <CanvasBlock block={block} index={index} onUpdate={onUpdateBlock} onRemove={onRemoveBlock} />
              </div>
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  )
}
