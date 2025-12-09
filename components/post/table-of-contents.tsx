"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { TocItem } from "@/lib/markdown/transforms"

interface TableOfContentsProps {
  items: TocItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-80px 0px -80% 0px",
      }
    )

    const headings = document.querySelectorAll("article h2, article h3")
    headings.forEach((heading) => observer.observe(heading))

    return () => {
      headings.forEach((heading) => observer.unobserve(heading))
    }
  }, [items])

  if (items.length === 0) {
    return null
  }

  return (
    <nav className="xl:sticky xl:top-20 xl:max-h-[calc(100vh-8rem)] xl:overflow-auto p-4 border rounded-lg bg-muted/50">
      <h3 className="font-semibold text-sm mb-4">On this page</h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(item.level === 3 && "ml-4")}
          >
            <a
              href={`#${item.id}`}
              className={cn(
                "block py-1 transition-colors hover:text-primary",
                activeId === item.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
