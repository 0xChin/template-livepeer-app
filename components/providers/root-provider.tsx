"use client"

import { ReactNode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"

import { useIsMounted } from "@/lib/hooks/use-is-mounted"
import { Privy } from "@/components/providers/privy"
import { Livepeer } from "@/integrations/siwe/livepeer/components/livepeer"

const queryClient = new QueryClient()
interface RootProviderProps {
  children: ReactNode
}

export default function RootProvider({ children }: RootProviderProps) {
  const isMounted = useIsMounted()
  return isMounted ? (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Privy>
          <Livepeer> {children} </Livepeer>
        </Privy>
      </QueryClientProvider>
    </ThemeProvider>
  ) : null
}
