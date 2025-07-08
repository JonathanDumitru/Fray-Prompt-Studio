"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { History, Save, Undo2, Redo2, Clock } from "lucide-react"
import type { Block } from "@/types/blocks"

interface HistoryPanelProps {
  blocks: Block[]
  promptHistory: Block[][]
  currentHistoryIndex: number
  savedVersions: { id: string; name: string; blocks: Block[]; timestamp: string }[]
  onUndo: () => void
  onRedo: () => void
  onSaveVersion: (name: string) => void
  onLoadVersion: (versionId: string) => void
}

export function HistoryPanel({
  blocks,
  promptHistory,
  currentHistoryIndex,
  savedVersions,
  onUndo,
  onRedo,
  onSaveVersion,
  onLoadVersion,
}: HistoryPanelProps) {
  const [newVersionName, setNewVersionName] = useState("")
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)

  const handleSaveClick = () => {
    if (newVersionName.trim()) {
      onSaveVersion(newVersionName.trim())
      setNewVersionName("")
      setIsSaveDialogOpen(false)
    }
  }

  return (
    <div className="h-full flex flex-col relative z-10">
      <div className="p-6 border-b border-white/30 backdrop-blur-sm bg-white/10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-br-3xl"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <History className="w-6 h-6 text-blue-500" />
            History & Versions
          </h3>
          <p className="text-sm text-gray-600/80 font-medium mb-4">Manage your prompt's evolution</p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onUndo}
              disabled={currentHistoryIndex === 0}
              className="backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30 text-gray-700 rounded-2xl shadow-lg"
            >
              <Undo2 className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRedo}
              disabled={currentHistoryIndex === promptHistory.length - 1}
              className="backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30 text-gray-700 rounded-2xl shadow-lg"
            >
              <Redo2 className="w-4 h-4 mr-2" />
              Redo
            </Button>
            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={blocks.length === 0}
                  className="backdrop-blur-sm bg-white/20 border-white/30 hover:bg-white/30 text-gray-700 rounded-2xl shadow-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Version
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] backdrop-blur-xl bg-white/80 border border-white/30 rounded-3xl shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">Save Current Prompt Version</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Give your current prompt a name to save it for later.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="version-name" className="text-right text-gray-700">
                      Version Name
                    </Label>
                    <Input
                      id="version-name"
                      value={newVersionName}
                      onChange={(e) => setNewVersionName(e.target.value)}
                      className="col-span-3 backdrop-blur-sm bg-white/30 border-white/40 rounded-xl shadow-inner text-gray-800"
                      placeholder="e.g., 'Initial Draft', 'V2 with CoT'"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleSaveClick}
                    disabled={!newVersionName.trim()}
                    className="bg-gradient-to-r from-blue-500/90 to-purple-500/90 hover:from-blue-600/90 hover:to-purple-600/90 text-white rounded-2xl shadow-lg"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {savedVersions.length === 0 ? (
          <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-50/40 to-purple-50/40 border-2 border-dashed border-blue-300/50 rounded-3xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="text-4xl mb-4">💾</div>
              <h4 className="font-bold text-gray-700 mb-2">No Saved Versions</h4>
              <p className="text-sm text-gray-600">Save your current prompt to create a version history.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
            <CardHeader className="pb-3 relative z-10">
              <CardTitle className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Saved Versions ({savedVersions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-3">
              {savedVersions.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between backdrop-blur-sm bg-white/30 rounded-2xl p-3 border border-white/40 shadow-inner"
                >
                  <div>
                    <p className="font-bold text-gray-800">{version.name}</p>
                    <p className="text-xs text-gray-600">{new Date(version.timestamp).toLocaleString()}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLoadVersion(version.id)}
                    className="backdrop-blur-sm bg-blue-500/90 hover:bg-blue-600/90 text-white rounded-xl shadow-md border border-white/20"
                  >
                    Load
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
