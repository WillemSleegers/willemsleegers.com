"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CodeBlockProps {
  html: string
  language?: string
}

export function CodeBlock({ html, language = "r" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const extractCodeFromHtml = (html: string): string => {
    const div = document.createElement("div")
    div.innerHTML = html
    return div.textContent || ""
  }

  const handleCopy = async () => {
    const code = extractCodeFromHtml(html)
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-4">
      <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
        {language && (
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200">
            {language.toUpperCase()}
          </span>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600 animate-in fade-in zoom-in duration-150" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {copied ? "Copied" : "Copy code"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy code"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
