"use client"

import { usePathname } from "next/navigation"
import { Player, useAsset } from "@livepeer/react"

export default function PlaybackPage() {
  const pathname = usePathname()
  const id = pathname.split("/")[2]

  const { data: asset } = useAsset(id)

  return asset ? (
    <div className="flex w-full justify-center">
      <div className="w-[85%]">
        <Player
          playbackId={asset?.playbackId}
          autoPlay={true}
          objectFit="cover"
        />
      </div>
    </div>
  ) : null
}
