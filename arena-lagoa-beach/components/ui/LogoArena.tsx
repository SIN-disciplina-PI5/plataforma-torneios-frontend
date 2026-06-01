"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React from "react"

export default function LogoArena() {
  const pathname = usePathname()
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname === "/") {
    
      if (typeof window !== "undefined") window.location.reload()
      return
    }
    router.push("/")
  }

  return (
    <div style={{position: 'fixed', top: 24, left: 48, zIndex: 9999, pointerEvents: 'auto'}}>
      <a href="/" onClick={handleClick} aria-label="Ir para página inicial">
        <Image
          src="/logo-arena.svg"
          alt="Logo Arena"
          width={120}
          height={38}
          style={{objectFit: 'contain', width: 'clamp(64px, 8vw, 160px)', height: 'auto', display: 'block'}}
          priority
        />
      </a>
    </div>
  )
}
