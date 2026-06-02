"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React from "react"

export default function LogoArena() {
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === "/"

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isHome) {
    
      if (typeof window !== "undefined") window.location.reload()
      return
    }
    router.push("/")
  }

  return (
    <div
      className={`fixed top-4 z-[9999] pointer-events-auto sm:left-12 sm:right-auto sm:top-6 ${
        isHome ? "left-4" : "right-4"
      }`}
    >
      <Link href="/" onClick={handleClick} aria-label="Ir para página inicial">
        <Image
          src="/logo-arena.svg"
          alt="Logo Arena"
          width={120}
          height={38}
          className="block h-auto w-[76px] object-contain sm:w-[clamp(64px,8vw,160px)]"
          priority
        />
      </Link>
    </div>
  )
}
