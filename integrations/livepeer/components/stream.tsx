import { useState } from "react"
import { Broadcast, Player, useCreateStream } from "@livepeer/react"
import { FaCopy, FaStop } from "react-icons/fa"
import { useAccount } from "wagmi"

import { absoluteUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface StreamData {
  name: string
  category: string
  user: string
  tags: string[]
}

export function Stream() {
  const initialStreamData = {
    name: "",
    category: "",
    user: "",
    tags: [],
  }
  const [streamData, setStreamData] = useState(
    JSON.stringify(initialStreamData)
  )
  const [streaming, setStreaming] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [urlCopied, setUrlCopied] = useState(false)
  const [streamSource, setStreamSource] = useState("browser")

  const { address: user } = useAccount()

  const parsedStreamData = (): StreamData =>
    JSON.parse(streamData) as StreamData

  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream({ name: streamData })

  const startStream = () => {
    createStream?.()
    setStreaming(true)
  }

  const stopStream = () => {
    setStreamData(JSON.stringify(initialStreamData))
    setStreaming(false)
  }

  const copyStreamLink = async () => {
    const streamLink = `${absoluteUrl(`/stream/${stream?.id ?? ""}`)}`
    await navigator.clipboard.writeText(streamLink)
    setUrlCopied(true)
    setTimeout(() => {
      setUrlCopied(false)
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedData = JSON.parse(streamData)
    parsedData[e.target.name] = e.target.value
    parsedData.user = user // Ensuring user's Ethereum address is integrated
    setStreamData(JSON.stringify(parsedData))
  }

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value)
  }

  const handleTagEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      const parsedData = parsedStreamData()
      parsedData.tags.push(tagInput.trim())
      setStreamData(JSON.stringify(parsedData))
      setTagInput("")
    }
  }

  const removeTag = (index: number) => {
    const parsedData = parsedStreamData()
    parsedData.tags.splice(index, 1)
    setStreamData(JSON.stringify(parsedData))
  }

  const copyRtmpUrlToClipboard = async () => {
    await navigator.clipboard.writeText("rtmp://rtmp.livepeer.com/live")
  }

  const copyStreamKeyToClipboard = async () => {
    if (stream?.streamKey) {
      await navigator.clipboard.writeText(stream.streamKey)
    }
  }

  const renderObsInstructions = () => {
    return (
      <div className="my-4">
        <h2 className="mb-2">OBS Configuration</h2>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <div className="flex flex-col gap-y-4">
              <div>
                <label>RTMP Ingest URL</label>
                <div className="mt-4 flex items-center gap-x-4">
                  <input
                    className="input"
                    value="rtmp://rtmp.livepeer.com/live"
                  />
                  <FaCopy
                    onClick={copyRtmpUrlToClipboard}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-neutral-100 p-2 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-900"
                  />
                </div>
              </div>
              <div>
                <label>Stream Key</label>
                <div className="mt-4 flex items-center gap-x-4">
                  <input className="input" value={stream?.streamKey} />
                  <FaCopy
                    onClick={copyStreamKeyToClipboard}
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-neutral-100 p-2 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-900"
                  />
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Show OBS Instructions</Button>
                </DialogTrigger>
                <DialogContent className="rounded-lg bg-white p-4 shadow-lg">
                  <h2>OBS Instructions:</h2>
                  <ol className="ml-5 list-decimal">
                    <li>
                      Download and install OBS from their official website.
                    </li>
                    <li>Launch OBS and go to Settings -{">"} Stream.</li>
                    <li>Select &quot;Custom&quot; in the service dropdown.</li>
                    <li>
                      Enter the RTMP URL:
                      &quot;rtmp://rtmp.livepeer.com/live&quot;.
                    </li>
                    <li>
                      Enter the provided stream key in the &quot;Stream
                      Key&quot; field.
                    </li>
                    <li>Click &quot;OK&quot; to save the settings.</li>
                    <li>
                      Add sources in OBS for video/audio and start the stream.
                    </li>
                  </ol>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold">Live Streaming</h1>
      <p className="mb-4 text-gray-600">
        Start or stop your live broadcast and manage stream settings.
      </p>
      <div className="mx-2 mt-5 w-full max-w-[600px] rounded-lg bg-white p-8 shadow-md">
        {streaming && stream ? (
          // Display Broadcast and Share Stream Button if stream exists
          <>
            <h2 className="mb-4 text-2xl font-semibold">Broadcasting</h2>
            {streamSource === "obs" ? (
              <>
                {renderObsInstructions()}
                <Player playbackId={stream.playbackId} />
              </>
            ) : (
              <Broadcast streamKey={stream.streamKey} />
            )}

            <Button
              onClick={copyStreamLink}
              disabled={urlCopied}
              variant={"emerald"}
              className="mt-2 w-full rounded"
            >
              {urlCopied ? "Copied to clipboard!" : "Share Stream"}
            </Button>
            <Button
              onClick={stopStream}
              variant={"destructive"}
              className="mt-2 w-full rounded"
            >
              <FaStop className="mr-2" />
              Stop Stream
            </Button>
          </>
        ) : (
          <>
            <h1 className="mb-4 text-3xl">Create a New Stream</h1>
            <label>Stream Source</label>
            <div className="mb-2 flex">
              <label className="mr-4">
                <input
                  type="radio"
                  name="streamSource"
                  value="browser"
                  checked={streamSource === "browser"}
                  onChange={() => setStreamSource("browser")}
                />{" "}
                Browser
              </label>
              <label>
                <input
                  type="radio"
                  name="streamSource"
                  value="obs"
                  checked={streamSource === "obs"}
                  onChange={() => setStreamSource("obs")}
                />{" "}
                OBS
              </label>
            </div>

            <label>Stream Name</label>
            <input
              value={parsedStreamData().name}
              onChange={handleInputChange}
              name="name"
              className="input mb-2 block rounded border p-2"
            />
            <label>Category</label>
            <input
              value={parsedStreamData().category}
              onChange={handleInputChange}
              name="category"
              className="input mb-2 block rounded border p-2"
            />
            <label>Tags</label>
            <div className="flex items-center rounded border p-2">
              {parsedStreamData().tags.map((tag, index) => (
                <div
                  key={index}
                  className="mr-2 flex items-center rounded-full bg-gray-200 px-2 py-1"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(index)}
                    className="ml-2 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                value={tagInput}
                onChange={handleTagInput}
                onKeyDown={handleTagEnter}
                placeholder="Add a tag and press Enter"
                className="input flex-1 bg-transparent"
              />
            </div>
            <Button
              disabled={status === "loading" || !createStream}
              onClick={startStream}
              className="mt-2 w-full rounded bg-emerald-500 p-2 text-white"
            >
              Create Stream
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
