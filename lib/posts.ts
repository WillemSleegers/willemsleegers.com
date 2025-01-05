import { slug } from "github-slugger"

type Post = {
  slug: string
  title: string
  description?: string
  tags?: string[]
  date: string
  updated?: string
  draft?: boolean
}
export function sortPosts(posts: Array<Post>) {
  return posts.sort((a, b) => {
    if (a.date > b.date) return -1
    if (a.date < b.date) return 1
    return 0
  })
}

export function getAllTags(posts: Array<Post>) {
  const tags: Record<string, number> = {}
  posts.forEach((post) => {
    if (!post.draft) {
      post.tags?.forEach((tag) => {
        tags[tag] = (tags[tag] ?? 0) + 1
      })
    }
  })

  return tags
}

export function sortTagsByCount(tags: Record<string, number>) {
  return Object.keys(tags).sort((a, b) => tags[b] - tags[a])
}

export function getPostsByTagSlug(posts: Array<Post>, tag: string) {
  return posts.filter((post) => {
    if (!post.tags) return false
    const slugifiedTags = post.tags.map((tag) => slug(tag))
    return slugifiedTags.includes(tag)
  })
}
