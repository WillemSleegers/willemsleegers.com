import { defineConfig, defineCollection, s } from "velite"

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slug: data.slug.split("/").slice(2).join("/"),
})

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.md",
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      date: s.isodate(),
      updated: s.isodate().optional(),
      tags: s.array(s.string()).optional(),
      draft: s.boolean().optional(),
      content: s.raw(),
    })
    .transform(computedFields),
})

export default defineConfig({
  root: "content",
  collections: { posts },

})
