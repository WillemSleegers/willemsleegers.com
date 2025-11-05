import { Tag } from "@/components/post/tag"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TagCounts } from "@/lib/types"
import { sortTagsByCount } from "@/lib/posts"

interface TagSidebarProps {
  tags: TagCounts
  currentTag?: string
  variant?: "card" | "plain"
}

export function TagSidebar({
  tags,
  currentTag,
  variant = "card",
}: TagSidebarProps) {
  const sortedTags = sortTagsByCount(tags)

  if (variant === "plain") {
    return (
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-xl">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {sortedTags.map((tag) => (
            <Tag tag={tag} key={tag} count={tags[tag]} current={currentTag === tag} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {sortedTags.map((tag) => (
          <Tag tag={tag} key={tag} count={tags[tag]} current={currentTag === tag} />
        ))}
      </CardContent>
    </Card>
  )
}
