import Link from "next/link"

import { Hero } from "@/components/layout/hero"
import { Button } from "@/components/ui/button"
import { Projects } from "@/components/projects/projects-list"
import { PostItem } from "@/components/post/post-item"

import { posts } from "#site/content"

const HomePage = () => {
  return (
    <main className="space-y-16 my-16 sm:my-24 md:my-32 lg:my-40 xl:my-48 sm:space-y-24 md:space-y-32 lg:space-y-40 xl:space-y-48 p-2">
      <section className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 text-center">
        <Hero />
      </section>

      <section className="container max-w-3xl flex flex-col space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20 xl:space-y-24">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center">
          Projects
        </h2>
        <Projects />
      </section>

      <section className="container max-w-3xl flex flex-col space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20 xl:space-y-24">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center">
          Latest Posts
        </h2>
        <ul className="flex flex-col space-y-4">
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
        <Button asChild className="w-fit mx-auto">
          <Link href="/blog">Older posts</Link>
        </Button>
      </section>
    </main>
  )
}

export default HomePage
