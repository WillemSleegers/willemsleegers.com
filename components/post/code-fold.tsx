"use client"

import { useState, ReactNode } from "react"
import { Triangle } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface CodeFoldProps {
  defaultOpen: boolean
  children: ReactNode
}

export function CodeFold({ defaultOpen, children }: CodeFoldProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="not-prose my-4"
    >
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
        <Triangle
          height={10}
          width={10}
          className={`transition-transform duration-200 fill-primary stroke-primary ${
            isOpen ? "rotate-180" : "rotate-90"
          }`}
        />
        <span>Code</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">{children}</CollapsibleContent>
    </Collapsible>
  )
}
