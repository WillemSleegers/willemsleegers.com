import { slug } from "github-slugger"

import { PostItem } from "@/components/post/post-item"
import { TagSidebar } from "@/components/post/tag-sidebar"
import { PageHeader } from "@/components/layout/page-header"
import { LAYOUT_CLASSES } from "@/lib/constants"
import { getAllTags, getPostsByTagSlug } from "@/lib/posts"

import { posts } from "#site/content"

interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

export const generateStaticParams = () => {
  const tags = getAllTags(posts)
  const paths = Object.keys(tags).map((tag) => ({ tag: slug(tag) }))
  return paths
}

export default async function TagPage(props: TagPageProps) {
  const params = await props.params;
  const { tag } = params

  const title = tag.split("-").join(" ")
  const allPosts = getPostsByTagSlug(posts, tag)
  const displayPosts = allPosts.filter((post) =>
    process.env.NODE_ENV === "development" || !post.draft
  )
  const tags = getAllTags(posts)

  return (
    <div className={LAYOUT_CLASSES.CONTAINER}>
      <PageHeader title={title} className="capitalize" />
      <div className="grid grid-cols-12 gap-6 mt-8">
        <div className={LAYOUT_CLASSES.GRID_MAIN}>
          <hr />
          {displayPosts?.length > 0 ? (
            <ul className="flex flex-col">
              {displayPosts.map((post) => {
                const { slug, date, title, description, tags } = post
                return (
                  <li key={slug}>
                    <PostItem
                      slug={slug}
                      date={date}
                      title={title}
                      description={description}
                      tags={tags}
                    />
                  </li>
                )
              })}
            </ul>
          ) : (
            <p>Nothing to see here yet</p>
          )}
        </div>
        <aside className={LAYOUT_CLASSES.GRID_SIDEBAR}>
          <TagSidebar tags={tags} currentTag={tag} variant="plain" />
        </aside>
      </div>
    </div>
  )
}
