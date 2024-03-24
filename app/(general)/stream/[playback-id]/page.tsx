"use client"

import { useEffect, useState } from "react"
import error from "next/error"
import { usePathname } from "next/navigation"
import { Asset, Player, useStream } from "@livepeer/react"
import { Chat } from "@orbisclub/components"
import { Orbis } from "@orbisclub/orbis-sdk"
import { FaRedo } from "react-icons/fa" // Import the refresh icon

import { absoluteUrl } from "@/lib/utils"
import { shorten } from "@/lib/utils/shorten"
import { Button } from "@/components/ui/button"
import { AvatarBlockie } from "@/components/avatar-blockie"

// eslint-disable-next-line
const orbis = new Orbis({})

export default function PlaybackPage() {
  const pathname = usePathname()
  const id = pathname.split("/")[2]

  const [chatKey, setChatKey] = useState(0)
  const { data: stream } = useStream(id)
  const [showChat, setShowChat] = useState(false)
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

      setInterval(async () => {
        // eslint-disable-next-line
        const { data } = await orbis.getPosts({
          context: `kjzl6cwe1jw147lgmx261ulk4ajfyqt0gs7wlqhgtks6148hoi2axziydysbku6:${stream.playbackId}`,
        })

        console.log(data)
      }, 1500)
    }
  }, [stream])

  const toggleChat = () => setShowChat((prev) => !prev)

  const updateChat = () => setChatKey(chatKey + 1)
  3
  return stream ? (
    <div className="relative flex w-full justify-center">
      <div
        className={`w-full md:w-[60%] ${
          !showChat ? "block" : "hidden"
        } md:block`}
      >
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
          <div className="relative mt-4 flex">
            <div className="ml-2 flex items-center md:ml-0">
              <AvatarBlockie
                className="mr-4 w-20 rounded-full"
                address={streamData.user}
              />
              <div>
                <h2 className="text-xl font-bold">
                  {shorten(streamData.user)}
                </h2>
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
          </div>
        )}
      </div>
      <div
        className={`h-[80vh] w-full md:w-[20%] ${
          showChat ? "block" : "hidden"
        } md:block`}
      >
        <Chat
          key={chatKey}
          context={`kjzl6cwe1jw147lgmx261ulk4ajfyqt0gs7wlqhgtks6148hoi2axziydysbku6:${stream.playbackId}`}
        />
      </div>
      <div className="absolute inset-x-0 bottom-[-25px] flex justify-center pt-5 md:hidden">
        <Button
          onClick={toggleChat}
          variant={"emerald"}
          className="mx-2 rounded p-2 text-white"
        >
          {showChat ? "Hide Chat" : "Show Chat"}
        </Button>
        <Button
          onClick={updateChat}
          className={`mx-2 rounded bg-gray-200 p-2 transition-colors duration-300 hover:bg-gray-300 focus:outline-none ${
            showChat ? "block" : "hidden"
          } md:block`}
          aria-label="Refresh Chat"
        >
          <FaRedo className="text-lg" />
        </Button>
      </div>
    </div>
  ) : null
}
