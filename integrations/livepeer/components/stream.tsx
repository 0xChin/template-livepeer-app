import { useState } from "react"
import { Broadcast, useCreateStream } from "@livepeer/react"
import { useAccount } from "wagmi"

import { absoluteUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
  const [tagInput, setTagInput] = useState("")
  const [urlCopied, setUrlCopied] = useState(false)
  const { address: user } = useAccount()

  const parsedStreamData = (): StreamData =>
    JSON.parse(streamData) as StreamData

  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream({ name: streamData })

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

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-[600px] rounded-lg bg-[#FAFAFA] p-8 shadow-md">
        {stream ? (
          // Display Broadcast and Share Stream Button if stream exists
          <>
            <h1 className="mb-4 text-3xl">Broadcasting</h1>
            <Broadcast streamKey={stream.streamKey} />
            <Button
              onClick={copyStreamLink}
              disabled={urlCopied}
              variant={"emerald"}
              className="mt-2 w-full rounded"
            >
              {urlCopied ? "Copied to clipboard!" : "Share Stream"}
            </Button>
          </>
        ) : (
          // Display Stream Creation Form if no stream exists
          <>
            <h1 className="mb-4 text-3xl">Create a New Stream</h1>
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
              onClick={() => createStream?.()}
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
