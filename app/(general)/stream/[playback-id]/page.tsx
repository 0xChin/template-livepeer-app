"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Asset, Player, useStream } from "@livepeer/react"
import { Chat } from "@orbisclub/components"
import { Orbis } from "@orbisclub/orbis-sdk"
import { FaRedo } from "react-icons/fa" // Import the refresh icon

import { absoluteUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AvatarBlockie } from "@/components/avatar-blockie"

// eslint-disable-next-line
const orbis = new Orbis({})

export default function PlaybackPage() {
  const pathname = usePathname()
  const id = pathname.split("/")[2]

  const [chatKey, setChatKey] = useState(0)
  const { data: stream } = useStream(id)
  const [streamData, setStreamData] = useState({
    name: "",
    category: "",
    user: "",
    tags: [],
  })

  useEffect(() => {
    if (stream) {
      const parsedData = JSON.parse(stream.name)
      setStreamData(parsedData)
    }
  }, [stream])

  const updateChat = () => setChatKey(chatKey + 1)

  return stream ? (
    <div className="flex w-full justify-center">
      <div className="w-[60%]">
        <Player
          playbackId={stream.playbackId}
          clipLength={30}
          autoPlay={true}
          onClipCreated={async (asset: Asset) => {
            // eslint-disable-next-line
            const res = await orbis.isConnected()
            if (res.status === 200) {
              // eslint-disable-next-line
              await orbis.createPost({
                body: `New clip created: ${absoluteUrl(`/clip/${asset.id}`)}`,
                context: `kjzl6cwe1jw147lgmx261ulk4ajfyqt0gs7wlqhgtks6148hoi2axziydysbku6:${stream.playbackId}`,
              })
              setTimeout(() => {
                updateChat()
              }, 2000)
            } else {
              alert("Connect to Ceramic to make clips")
            }
          }}
          objectFit="cover"
        />
        {streamData && (
          <div className="mt-4 flex justify-between">
            <div className="flex items-center">
              <AvatarBlockie
                className="mr-4 w-20 rounded-full"
                address={streamData.user}
              />
              <div>
                <h2 className="text-xl font-bold">{streamData.user}</h2>
                <p className="mt-2 font-bold">{streamData.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">{streamData.category}</p>
                  <div className="mt-2 flex flex-wrap">
                    {(streamData.tags as string[]).map((tag) => (
                      <span
                        key={tag}
                        className="mb-2 mr-2 rounded-md bg-gray-200 p-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={updateChat}
              className="rounded bg-gray-200 p-2 transition-colors duration-300 hover:bg-gray-300 focus:outline-none"
              aria-label="Refresh Chat"
            >
              Refresh chat
            </button>
          </div>
        )}
      </div>
      <div className="h-[80vh] w-[20%]">
        <Chat
          key={chatKey}
          context={`kjzl6cwe1jw147lgmx261ulk4ajfyqt0gs7wlqhgtks6148hoi2axziydysbku6:${stream.playbackId}`}
        />
      </div>
    </div>
  ) : null
}
