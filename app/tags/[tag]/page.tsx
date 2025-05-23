import { slug } from "github-slugger"

import { PostItem } from "@/components/post/post-item"
import { Tag } from "@/components/post/tag"

import { getAllTags, getPostsByTagSlug, sortTagsByCount } from "@/lib/posts"

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
  const displayPosts = allPosts.filter((post) => !post.draft)
  const tags = getAllTags(posts)
  const sortedTags = sortTagsByCount(tags)

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-black text-4xl lg:text-5xl capitalize">
            {title}
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-3 mt-8">
        <div className="col-span-12 col-start-1 sm:col-span-8">
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
        <div className="col-span-12 row-start-3 sm:col-span-4 sm:col-start-9 sm:row-start-1 border-none flex flex-col gap-2">
          <div className="font-bold text-xl">Tags</div>
          <div className="flex flex-wrap gap-2">
            {sortedTags?.map((t) => (
              <Tag tag={t} key={t} count={tags[t]} current={slug(t) === tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
