import { PostItem } from "@/components/post/post-item"
import { PostsPagination } from "@/components/post/posts-pagination"
import { TagSidebar } from "@/components/post/tag-sidebar"
import { PageHeader } from "@/components/layout/page-header"
import { POSTS_PER_PAGE, LAYOUT_CLASSES } from "@/lib/constants"
import { getAllTags, sortPosts } from "@/lib/posts"

import { posts } from "#site/content"

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function BlogPage(props: BlogPageProps) {
  const searchParams = await props.searchParams
  const currentPage = Number(searchParams?.page) || 1
  const sortedPosts = sortPosts(
    posts.filter((post) =>
      process.env.NODE_ENV === "development" || !post.draft
    )
  )
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE)

  const displayPosts = sortedPosts.slice(
    POSTS_PER_PAGE * (currentPage - 1),
    POSTS_PER_PAGE * currentPage
  )

  const tags = getAllTags(posts)

  return (
    <div className={LAYOUT_CLASSES.CONTAINER}>
      <PageHeader title="Blog" />
      <div className="grid grid-cols-12 gap-6 mt-8">
        <div className={LAYOUT_CLASSES.GRID_MAIN}>
          {displayPosts?.length > 0 ? (
            <ul className="flex flex-col space-y-6">
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
          <PostsPagination totalPages={totalPages} className="justify-end mt-4" />
        </div>
        <aside className={LAYOUT_CLASSES.GRID_SIDEBAR}>
          <TagSidebar tags={tags} />
        </aside>
      </div>
    </div>
  )
}
