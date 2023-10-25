"use client"

import { usePathname } from "next/navigation"
import { Player } from "@livepeer/react"

export default function PlaybackPage() {
  const pathname = usePathname()
  const playbackId = pathname.split("/")[2]

  return <Player playbackId={playbackId} autoPlay={true} />
}
