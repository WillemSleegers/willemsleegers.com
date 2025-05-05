"use client"

import { useState } from "react"

import { Nav } from "@/components/navigation/nav"
import { Logo } from "@/components/navigation/logo"
import { ModeToggle } from "@/components/theme/mode-toggle"
import { HamburgerButton } from "@/components/hamburger-button"

import { cn } from "@/lib/utils"

export const Navbar = () => {
  const [open, setOpen] = useState(false)
  return (
    <header className="w-full bg-background">
      <div className="container flex h-14 max-w-(--breakpoint-2xl) items-center px-8">
        <div className="flex gap-8 items-baseline">
          <Logo />
          <div className="hidden md:flex">
            <Nav />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ModeToggle />
        </div>
        <HamburgerButton open={open} setOpen={setOpen} />
      </div>

      <div
        className={cn(
          "flex justify-center md:hidden overflow-hidden transition-all",
          open ? "h-9" : "h-0"
        )}
      >
        <Nav />
      </div>
    </header>
  )
}
