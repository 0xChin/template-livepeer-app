"use client"

import { Stream } from "@/integrations/siwe/livepeer/components/stream"

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center">
      <Stream />
    </main>
  )
}
