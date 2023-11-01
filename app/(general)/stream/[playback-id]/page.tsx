"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Player, useStream } from "@livepeer/react"
import { Chat } from "@orbisclub/components"

import { AvatarBlockie } from "@/components/avatar-blockie"

export default function PlaybackPage() {
  const pathname = usePathname()
  const id = pathname.split("/")[2]

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

  return stream ? (
    <div className="flex w-full justify-center">
      <div className="w-[60%]">
        <Player
          playbackId={stream.playbackId}
          clipLength={30}
          autoPlay={true}
          objectFit="cover"
        />
        {streamData && (
          <div className="mt-4 flex">
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
        )}
      </div>
      <div className="h-[80vh] w-[15%]">
        <Chat
          context={`kjzl6cwe1jw147lgmx261ulk4ajfyqt0gs7wlqhgtks6148hoi2axziydysbku6:${stream.playbackId}`}
        />
      </div>
    </div>
  ) : null
}
