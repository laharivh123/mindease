"use client"
import EmotionDetector from "@/components/emotion-detector"
import Header from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <EmotionDetector />
      </div>
    </main>
  )
}
