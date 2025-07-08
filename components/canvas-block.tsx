"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Block } from "@/types/blocks"
import { Button } from "@/components/ui/button"
import { GripVertical, X, Edit3 } from "lucide-react"
import { getBlockConfig } from "@/lib/block-configs"

interface CanvasBlockProps {
  block: Block
  index: number
  onUpdate: (id: string, content: string) => void
  onRemove: (id: string) => void
}

export function CanvasBlock({ block, index, onUpdate, onRemove }: CanvasBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(block.content)
  const inputRef = useRef<HTMLTextAreaElement>(null) // Changed to HTMLTextAreaElement

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const blockConfig = getBlockConfig(block.type)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      // Select all text when entering edit mode
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = () => {
    onUpdate(block.id, editValue)
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Allow Enter for new lines, save on Escape
    if (e.key === "Escape") {
      setEditValue(block.content) // Revert to original content
      setIsEditing(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group transition-all duration-300
        ${isDragging ? "opacity-60 rotate-2 scale-110 z-50" : "hover:scale-105 hover:-translate-y-2"}
      `}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-grab active:cursor-grabbing z-10"
      >
        <div className="backdrop-blur-sm bg-white/20 hover:bg-white/30 rounded-2xl p-2 border border-white/30 shadow-lg">
          <GripVertical className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(block.id)}
        className="absolute -right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 w-8 p-0 backdrop-blur-sm bg-red-500/90 hover:bg-red-600/90 text-white rounded-2xl border border-white/20 shadow-lg z-10"
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Main Block */}
      <div
        className={`
          relative inline-block min-w-80 max-w-3xl cursor-pointer select-none
          ${blockConfig.bgColor} ${blockConfig.textColor}
          shadow-2xl hover:shadow-3xl transition-all duration-300
          ${isEditing ? "ring-4 ring-white/50 scale-105" : ""}
          backdrop-blur-sm border border-white/20 rounded-3xl
        `}
        style={{
          clipPath: blockConfig.clipPath,
        }}
        onClick={() => !isEditing && setIsEditing(true)}
      >
        {/* Glass overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-3xl"></div>

        <div className="px-6 py-4 min-h-16 flex items-center gap-3 relative z-10">
          <span className="text-2xl drop-shadow-sm">{blockConfig.emoji}</span>
          <span className="font-bold text-lg drop-shadow-sm">{blockConfig.prefix}</span>

          {isEditing ? (
            <textarea // Changed from input to textarea
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave} // Save on blur
              onKeyDown={handleKeyPress}
              className="flex-1 bg-white/30 border border-white/40 rounded-2xl px-4 py-2 text-white placeholder-white/80 focus:outline-none focus:bg-white/40 focus:ring-2 focus:ring-white/50 backdrop-blur-sm font-medium resize-y min-h-[40px]" // Added resize-y and min-h
              placeholder={blockConfig.placeholder}
              rows={1} // Start with 1 row, will expand with resize-y
            />
          ) : (
            <span className="flex-1 italic font-medium drop-shadow-sm whitespace-pre-wrap">
              {block.content || blockConfig.placeholder}
            </span> // Added whitespace-pre-wrap to display newlines
          )}

          {!isEditing && (
            <Edit3 className="w-4 h-4 opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-sm" />
          )}
        </div>
      </div>

      {/* Block Number Badge */}
      <div className="absolute -top-3 -left-3 w-8 h-8 backdrop-blur-sm bg-gray-800/90 text-white text-sm rounded-2xl flex items-center justify-center font-bold shadow-xl border border-white/20 z-10">
        {index + 1}
      </div>

      {/* Subtle glow effect */}
      <div
        className={`absolute inset-0 ${blockConfig.glowColor} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl -z-10 rounded-3xl`}
      ></div>
    </div>
  )
}
