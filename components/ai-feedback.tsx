import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Lightbulb } from "lucide-react"

interface AiFeedbackProps {
  feedback: string
  isLoading: boolean
}

export function AiFeedback({ feedback, isLoading }: AiFeedbackProps) {
  return (
    <Card className="backdrop-blur-sm bg-white/40 p-4 rounded-2xl border border-white/30 text-sm font-medium shadow-inner">
      <CardHeader className="pb-2 px-0 pt-0">
        <CardTitle className="font-bold text-gray-800 flex items-center gap-2">
          <Brain className="w-4 h-4" /> Fray's Internal AI Feedback
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-0">
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-600 animate-pulse">
            <Lightbulb className="w-4 h-4" />
            <span>Analyzing prompt...</span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-gray-700">{feedback}</p>
        )}
      </CardContent>
    </Card>
  )
}
