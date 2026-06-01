import React from "react"
import LogoArena from "../../components/ui/LogoArena"

export const metadata = {
  title: "Arena Lagoa Beach",
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LogoArena />
      {children}
    </>
  )
}
