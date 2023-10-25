import { useEffect, useState } from "react"
import { Broadcast, useCreateStream } from "@livepeer/react"

import { Button } from "@/components/ui/button"

export function Stream() {
  const [streamName, setStreamName] = useState("")

  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream({ name: streamName })

  useEffect(() => {
    console.log(stream?.playbackId)
    console.log(stream?.id)
  }, [stream])

  const copyStreamLink = async () => {
    const streamLink = `http://localhost:3000/stream/${
      stream?.playbackId ?? ""
    }`
    await navigator.clipboard.writeText(streamLink)
    alert("Stream URL copied to clipboard!")
  }

  return (
    <div>
      {!stream && (
        <>
          <input
            type="text"
            value={streamName}
            onChange={(e) => setStreamName(e.target.value)}
            className="rounded border p-2"
            placeholder="Enter stream name"
          />
          <button
            disabled={status === "loading" || !createStream}
            onClick={() => createStream?.()}
            className="ml-2 rounded bg-blue-500 p-2 text-white"
          >
            Create Stream
          </button>
        </>
      )}
      {stream && (
        <>
          <Broadcast title={stream.name} streamKey={stream.streamKey} />
          <Button onClick={copyStreamLink} variant={"emerald"}>
            Share Stream
          </Button>
        </>
      )}
    </div>
  )
}
