"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React from "react"
import { createPortal } from "react-dom"

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

  const logo = (
    <div
      className={`public-logo-arena ${
        isHome ? "public-logo-arena--home" : "public-logo-arena--auth"
      }`}
    >
      <Link href="/" onClick={handleClick} aria-label="Ir para página inicial">
        <Image
          src="/logo-arena.svg"
          alt="Logo Arena"
          width={120}
          height={38}
          className="public-logo-arena__image"
          priority
        />
      </Link>
    </div>
  )

  if (typeof document === "undefined") return null

  return createPortal(logo, document.body)
}
