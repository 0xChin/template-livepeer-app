import { ReactNode } from "react"
import { env } from "@/env.mjs"
import {
  createReactClient,
  LivepeerConfig,
  studioProvider,
} from "@livepeer/react"

interface LivepeerProps {
  children: ReactNode
}

export const Livepeer = ({ children }: LivepeerProps) => {
  const client = createReactClient({
    provider: studioProvider({
      apiKey: env.NEXT_PUBLIC_LIVEPEER_API_KEY,
    }),
  })

  return <LivepeerConfig client={client}>{children}</LivepeerConfig>
}
