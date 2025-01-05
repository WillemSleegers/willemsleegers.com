import Link from "next/link"

import { Hero } from "@/components/hero"
import { Button } from "@/components/ui/button"
import { Projects } from "@/components/projects"
import { PostItem } from "@/components/post/post-item"

import { posts } from "#site/content"

const HomePage = () => {
  return (
    <main className="space-y-32 pt-32 items-center ">
      <section className="space-y-2 sm:space-y-4 md:space-y-6 lg:space-y-8 text-center">
        <Hero />
      </section>
      <section className="container max-w-3xl py-6 lg:py-10 flex flex-col space-y-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center">
          Projects
        </h2>
        <Projects />
      </section>
      <section className="container max-w-3xl py-6 lg:py-10 flex flex-col space-y-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center">
          Latest Posts
        </h2>
        <ul className="flex flex-col space-y-6">
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
          <Link href="/blog/">Older posts</Link>
        </Button>
      </section>
    </main>
  )
}

export default HomePage
