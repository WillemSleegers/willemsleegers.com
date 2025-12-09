/**
 * Replaces HTML 'class' attributes with 'className' for React compatibility
 */
export function replaceClassWithClassName(htmlString: string) {
  return htmlString.replace(
    /<([a-z][a-z0-9]*)\b([^>]*?)\bclass=(?=(?:[^"]*"[^"]*")*[^"]*$)/gi,
    "<$1$2className="
  )
}

export interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * Extracts Quarto-generated table of contents from markdown content
 * Returns both the parsed TOC items and the markdown with TOC removed
 */
export function extractQuartoToc(markdown: string): {
  toc: TocItem[]
  content: string
} {
  // Pattern: matches TOC block starting with "- [" and ending with blank line
  // Accounts for Quarto wrapping long entries across multiple lines
  const tocPattern = /^((?:- \[.+?\n(?:  .+?\n)*)+)\n/m
  const match = markdown.match(tocPattern)

  if (!match) {
    return { toc: [], content: markdown }
  }

  const tocBlock = match[1]

  // Join wrapped lines: lines starting with "  " (2 spaces) are continuations
  const normalizedToc = tocBlock.replace(/\n  /g, ' ')

  // Parse the TOC lines
  const tocLines = normalizedToc.trim().split('\n')
  const toc: TocItem[] = tocLines.map((line) => {
    // Count leading spaces to determine nesting level
    const leadingSpaces = line.match(/^(\s*)/)?.[1].length || 0
    const level = leadingSpaces === 0 ? 2 : 3 // H2 for top-level, H3 for nested

    // Extract link text and anchor
    const linkMatch = line.match(/- \[(.+?)\]\(#(.+?)\)/)
    if (!linkMatch) {
      return { id: '', text: '', level: 2 }
    }

    return {
      text: linkMatch[1],
      id: linkMatch[2],
      level,
    }
  }).filter(item => item.id !== '') // Remove any failed parses

  // Remove TOC from content
  const content = markdown.replace(tocPattern, '')

  return { toc, content }
}
