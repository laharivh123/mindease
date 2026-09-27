"use client"

import { Card } from "@/components/ui/card"
import VoiceOutputButton from "./voice-output-button"

interface EmotionAnalysis {
  emotions: string[]
  sentiment: "positive" | "neutral" | "negative"
  sentimentScore: number
  insights: string
}

interface EmotionResultsProps {
  analysis: EmotionAnalysis
  language: string
}

export default function EmotionResults({ analysis, language }: EmotionResultsProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-300"
      case "negative":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-blue-100 text-blue-800 border-blue-300"
    }
  }

  const getSentimentLabel = (score: number) => {
    if (score > 0.5) return "Very Positive"
    if (score > 0.2) return "Positive"
    if (score > -0.2) return "Neutral"
    if (score > -0.5) return "Negative"
    return "Very Negative"
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <Card className="p-6 bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Detected Emotions</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.emotions.map((emotion) => (
            <span
              key={emotion}
              className="px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium"
            >
              {emotion}
            </span>
          ))}
        </div>
      </Card>

      <Card className={`p-6 border ${getSentimentColor(analysis.sentiment)}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Sentiment Analysis</h3>
            <div className="space-y-3">
              <p className="text-sm font-medium">{getSentimentLabel(analysis.sentimentScore)}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    analysis.sentiment === "positive"
                      ? "bg-green-500"
                      : analysis.sentiment === "negative"
                        ? "bg-red-500"
                        : "bg-blue-500"
                  }`}
                  style={{
                    width: `${((analysis.sentimentScore + 1) / 2) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs opacity-75">Score: {analysis.sentimentScore.toFixed(2)}</p>
            </div>
          </div>
          <VoiceOutputButton
            text={`Your sentiment is ${getSentimentLabel(analysis.sentimentScore)}`}
            language={language}
          />
        </div>
      </Card>

      <Card className="p-6 bg-card border border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-3">Supportive Insight</h3>
            <p className="text-foreground leading-relaxed">{analysis.insights}</p>
          </div>
          <VoiceOutputButton text={analysis.insights} language={language} />
        </div>
      </Card>
    </div>
  )
}
