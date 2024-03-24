"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Player, useAsset } from "@livepeer/react"
import { Chat } from "@orbisclub/components"
import { Orbis } from "@orbisclub/orbis-sdk"
import { FaRedo, FaShareAlt } from "react-icons/fa" // Import the share and refresh icons

export default function ClipPage() {
  // Changed function name for clarity
  const pathname = usePathname()
  const id = pathname.split("/")[2]

  const { data: asset } = useAsset(id)
  const [copied, setCopied] = useState(false)
  const [showChat, setShowChat] = useState(true) // Default to true to show chat next to video
  const [chatKey, setChatKey] = useState(0) // Key to force re-rendering of the chat component

  // eslint-disable-next-line
  const orbis = new Orbis({})
  const apiBaseUrl = "http://localhost:5173" // Replace this with your actual API base URL

  const buildQueryParams = (data: any) => {
    let queryParams = ""
    const numComments = Math.min(data.length, 4) // Get the number of comments (up to 4)
    for (let i = 0; i < numComments; i++) {
      const message = data[i].content.body
      queryParams += `&message${i + 1}=${encodeURIComponent(message)}`
    }
    return queryParams
  }

  const copyToClipboard = async () => {
    // eslint-disable-next-line
    const { data } = await orbis.getPosts({
      context: `kjzl6cwe1jw147lgmx261ulk4ajfyqt0gs7wlqhgtks6148hoi2axziydysbku6:${
        asset?.playbackId ?? ""
      }`,
    })
    console.log(data)

    const queryParams = `?asset=${asset?.id ?? ""}` + buildQueryParams(data)
    const shareUrl =
      typeof window !== "undefined"
        ? `${apiBaseUrl}/api/dev?url=${encodeURIComponent(
            `${apiBaseUrl}/api${queryParams}`
          )}`
        : ""

    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  console.log(asset?.id)

  return asset ? (
    <div className="flex w-full items-center justify-center p-4">
      <div className="flex w-full max-w-6xl">
        <div className="w-full lg:w-3/4">
          <h2 className="mb-4 text-2xl font-bold">Clip</h2>
          <Player
            playbackId={asset.playbackId}
            autoPlay={true}
            objectFit="cover"
          />
          <div className="mt-4 flex">
            <button
              onClick={copyToClipboard}
              className="flex items-center rounded bg-blue-500 p-2 text-white"
              aria-label="Share Clip"
            >
              <FaShareAlt className="mr-2" />
              {copied ? "Copied!" : "Share frame"}
            </button>
            {/* Refresh Chat Button, shown only when chat is visible */}
          </div>
        </div>
        {showChat && (
          <div className="w-full lg:w-1/4 lg:pl-4">
            <Chat
              key={chatKey}
              context={`kjzl6cwe1jw147lgmx261ulk4ajfyqt0gs7wlqhgtks6148hoi2axziydysbku6:${
                asset?.playbackId ?? ""
              }`}
            />
          </div>
        )}
      </div>
    </div>
  ) : null
}
