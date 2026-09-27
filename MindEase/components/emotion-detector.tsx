"use client"

import { useState } from "react"
import { generateText } from "ai"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import EmotionResults from "./emotion-results"
import LanguageSelector from "./language-selector"
import VoiceInputButton from "./voice-input-button"

interface EmotionAnalysis {
  emotions: string[]
  sentiment: "positive" | "neutral" | "negative"
  sentimentScore: number
  insights: string
}

export default function EmotionDetector() {
  const [input, setInput] = useState("")
  const [analysis, setAnalysis] = useState<EmotionAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [language, setLanguage] = useState("en")

  const analyzeEmotion = async () => {
    if (!input.trim()) {
      setError("Please describe your feelings")
      return
    }

    setLoading(true)
    setError("")

    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `Analyze the following text for emotions and sentiment. Respond in JSON format with:
- emotions: array of detected emotions (e.g., ["joy", "anxiety", "hope"])
- sentiment: one of "positive", "neutral", or "negative"
- sentimentScore: number between -1 (very negative) and 1 (very positive)
- insights: brief supportive insight about the emotions expressed

Text to analyze: "${input}"

Respond ONLY with valid JSON, no additional text.`,
      })

      const parsed = JSON.parse(text)
      setAnalysis(parsed)
    } catch (err) {
      setError("Failed to analyze emotions. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInput((prev) => (prev ? prev + " " + transcript : transcript))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6 bg-card border border-border">
        <div className="mb-6">
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>

        <h2 className="text-xl font-semibold text-foreground mb-4">How are you feeling?</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share what's on your mind... Your feelings are valid and important."
          className="w-full h-32 p-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        {error && <p className="text-destructive text-sm mt-2">{error}</p>}

        <div className="flex gap-2 mt-4">
          <Button
            onClick={analyzeEmotion}
            disabled={loading}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Analyzing..." : "Analyze My Emotions"}
          </Button>
          <VoiceInputButton onTranscript={handleVoiceTranscript} language={language} disabled={loading} />
        </div>
      </Card>

      {analysis && <EmotionResults analysis={analysis} language={language} />}
    </div>
  )
}
