import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PostItem } from "@/components/post/post-item"

import { posts } from "#site/content"

export const LatestPosts = () => {
  return (
    <>
      <ul className="flex flex-col space-y-(--fluid-sm)">
        {posts
          .filter((post) => {
            if (
              !process.env.NODE_ENV ||
              process.env.NODE_ENV === "development"
            ) {
              return post
            } else {
              return !post.draft
            }
          })
          .sort(function (a, b) {
            return new Date(b.date).valueOf() - new Date(a.date).valueOf()
          })
          .filter((post, i) => i < 3)
          .map((post) => {
            const { slug, date, title, description, tags } = post
            return (
              <PostItem
                key={slug}
                slug={slug}
                date={date}
                title={title}
                description={description}
                tags={tags}
              />
            )
          })}
      </ul>
      <Button asChild className="w-fit mx-auto">
        <Link href="/blog">Older posts</Link>
      </Button>
    </>
  )
}
