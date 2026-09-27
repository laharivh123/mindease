"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

interface VoiceOutputButtonProps {
  text: string
  language: string
}

export default function VoiceOutputButton({ text, language }: VoiceOutputButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech not supported in this browser")
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  return (
    <Button onClick={speak} variant={isSpeaking ? "destructive" : "outline"} size="sm" className="gap-2">
      {isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4" />
          Stop
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" />
          Listen
        </>
      )}
    </Button>
  )
}
