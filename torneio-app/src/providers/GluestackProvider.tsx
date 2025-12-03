import { GluestackUIProvider } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config"
import { ReactNode } from "react"

export function GluestackProvider({ children }: { children: ReactNode }) {
  return (
    <GluestackUIProvider config={config}>
      {children}
    </GluestackUIProvider>
  )
}
