import Link from "next/link"
import { slug } from "github-slugger"
import { badgeVariants } from "@/components/ui/badge"

interface TagProps {
  tag: string
  current?: boolean
  count?: number
}
export function Tag({ tag, current, count }: TagProps) {
  return (
    <Link
      className={badgeVariants({
        variant: current ? "default" : "secondary",
        className: "no-underline rounded-md",
      })}
      href={`/tags/${slug(tag)}`}
    >
      <span>
        {tag} {count ? `(${count})` : null}
      </span>
    </Link>
  )
}
