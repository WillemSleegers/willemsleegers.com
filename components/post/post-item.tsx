import Link from "next/link"

import { Tag } from "@/components/post/tag"
import { buttonVariants } from "@/components/ui/button"

import { cn, formatDate } from "@/lib/utils"

interface PostItemProps {
  slug: string
  title: string
  description?: string
  date: string
  tags?: Array<string>
}

export function PostItem({
  slug,
  title,
  description,
  date,
  tags,
}: PostItemProps) {
  return (
    <li className="flex flex-col gap-2">
      <div>
        <h2 className="text-2xl font-bold">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>
      </div>
      <div className="flex gap-2">
        {tags?.map((tag) => (
          <Tag tag={tag} key={tag} />
        ))}
      </div>
      <div className="max-w-none text-muted-foreground">{description}</div>
      <div className="flex justify-between items-center">
        <dl>
          <dt className="sr-only">Published On</dt>
          <dd className="text-sm font-medium">
            <time dateTime={date}>{formatDate(date)}</time>
          </dd>
        </dl>
        <Link
          href={`/blog/${slug}`}
          className={cn(buttonVariants({ variant: "link" }), "py-0")}
        >
          Read more →
        </Link>
      </div>
    </li>
  )
}
