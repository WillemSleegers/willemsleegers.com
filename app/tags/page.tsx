import { Tag } from "@/components/post/tag"
import { LAYOUT_CLASSES } from "@/lib/constants"
import { getAllTags, sortTagsByCount } from "@/lib/posts"

import { posts } from "#site/content"

export default async function TagsPage() {
  const tags = getAllTags(posts)
  const sortedTags = sortTagsByCount(tags)

  return (
    <div className={LAYOUT_CLASSES.CONTAINER}>
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-black text-4xl lg:text-5xl">Tags</h1>
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        {sortedTags?.map((tag) => (
          <Tag tag={tag} count={tags[tag]} key={tag} />
        ))}
      </div>
    </div>
  )
}
