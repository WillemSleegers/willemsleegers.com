import { Hero } from "@/components/layout/hero"
import { Projects } from "@/components/projects/projects-list"
import { LatestPosts } from "@/components/post/latest-posts"

const HomePage = () => {
  return (
    <main className="space-y-(--fluid-lg) my-(--fluid-lg) p-2">
      <section className="space-y-(--fluid-sm) text-center">
        <Hero />
      </section>

      <section className="container max-w-3xl flex flex-col space-y-(--fluid-sm)">
        <h2 className="text-[length:var(--fluid-heading)] font-black text-center">
          Projects
        </h2>
        <Projects />
      </section>

      <section className="container max-w-3xl flex flex-col space-y-(--fluid-sm)">
        <h2 className="text-[length:var(--fluid-heading)] font-black text-center">
          Latest Posts
        </h2>
        <LatestPosts />
      </section>
    </main>
  )
}

export default HomePage
