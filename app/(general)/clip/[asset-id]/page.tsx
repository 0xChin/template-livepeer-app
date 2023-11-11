"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Player, useAsset } from "@livepeer/react"
import { FaShareAlt } from "react-icons/fa" // Import the share icon

export default function PlaybackPage() {
  const pathname = usePathname()
  const id = pathname.split("/")[2]

  const { data: asset } = useAsset(id)
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== "undefined" ? window.location.href : ""

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
  }

  return asset ? (
    <div className="flex w-full flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-2xl font-bold">Clip</h2>
      <div className="w-[70%]">
        <Player
          playbackId={asset?.playbackId}
          autoPlay={true}
          objectFit="cover"
        />
        <button
          onClick={copyToClipboard}
          className="mt-4 flex items-center rounded bg-blue-500 p-2 text-white"
          aria-label="Share Clip"
        >
          <FaShareAlt className="mr-2" />
          {copied ? "Copied!" : "Share"}
        </button>
      </div>
    </div>
  ) : null
}
