"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square } from "lucide-react"

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void
  language: string
  disabled?: boolean
}

export default function VoiceInputButton({ onTranscript, language, disabled }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser")
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()

    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = language

    recognitionRef.current.onstart = () => {
      setIsListening(true)
    }

    recognitionRef.current.onresult = (event: any) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      if (event.results[event.results.length - 1].isFinal) {
        onTranscript(transcript)
      }
    }

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  return (
    <Button
      onClick={isListening ? stopListening : startListening}
      disabled={disabled}
      variant={isListening ? "destructive" : "default"}
      size="sm"
      className="gap-2"
    >
      {isListening ? (
        <>
          <Square className="w-4 h-4" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="w-4 h-4" />
          Voice Input
        </>
      )}
    </Button>
  )
}
