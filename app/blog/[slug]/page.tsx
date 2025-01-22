import path from "path"
import Image from "next/image"
import Markdown from "markdown-to-jsx"
import React, { PropsWithChildren, ReactElement, ReactNode } from "react"

import { codeToHtml } from "shiki"

import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "@/components/math/math"

import { Tag } from "@/components/post/tag"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  formatDate,
  reconstructMarkdown,
  replaceClassWithClassName,
} from "@/lib/utils"
import { Triangle } from "lucide-react"

import { posts } from "#site/content"

export const generateStaticParams = async () => {
  return posts.map((post) => ({ slug: post.slug, title: post.title }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const slug = await params.slug
  return {
    slug: slug,
  }
}

export default async function Page(props0: {
  params: Promise<{ slug: string }>
}) {
  const params = await props0.params
  const slug = params.slug
  const post = posts.find((post) => post.slug == slug)!
  const content = replaceClassWithClassName(post.content)

  return (
    <main className="prose dark:prose-invert container max-w-3xl mx-auto p-6">
      <article>
        <div className="space-y-3 mb-12">
          <h1 className="mb-0">{post.title}</h1>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag: string) => (
                <Tag tag={tag} key={tag} />
              ))}
            </div>
          )}
          {post.description && (
            <p className="mt-0 text-muted-foreground">{post.description}</p>
          )}
          {post.date && (
            <div className="not-prose flex gap-4 text-sm">
              <div>
                <span>Published</span>
                <dl>
                  <dt className="sr-only">Published On</dt>
                  <dd className="text-sm font-medium flex items-center gap-1">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </dd>
                </dl>
              </div>
              {post.updated && (
                <div>
                  <span>Last updated</span>
                  <dl>
                    <dt className="sr-only">Last Updated</dt>
                    <dd className="text-sm font-medium flex items-center gap-1">
                      <time dateTime={post.updated}>
                        {formatDate(post.updated)}
                      </time>
                    </dd>
                  </dl>
                </div>
              )}
            </div>
          )}
          <hr className="my-4" />
        </div>
        <Markdown
          options={{
            overrides: {
              img: {
                component: MarkdownImage,
                props: {
                  slug: slug,
                },
              },
              details: {
                component: CodeFold,
              },
              pre: {
                component: Pre,
              },
              code: {
                component: Code,
              },
              table: {
                component: Table,
              },
              math: { component: Math },
            },
          }}
        >
          {content}
        </Markdown>
      </article>
    </main>
  )
}

const CodeFold = (props: {
  open: boolean
  className?: string
  children: ReactNode[]
}) => {
  const className = props.className

  if (className == "code-fold") {
    const pre = props.children[1]
    return (
      <Collapsible defaultOpen={props.open} className="not-prose">
        <CollapsibleTrigger className="flex items-center gap-2">
          <Triangle
            height={10}
            width={10}
            className="rotate-90 [[data-state=open]_&]:rotate-180 transition fill-primary stroke-primary"
          />
          Code
        </CollapsibleTrigger>
        <CollapsibleContent>{pre}</CollapsibleContent>
      </Collapsible>
    )
  } else return
}

const Pre = async (props: PropsWithChildren) => {
  const children = props.children as ReactElement
  const code = children.props as { className?: string; children: string }

  const html = await codeToHtml(code.children, {
    lang: "r",
    themes: { dark: "github-dark", light: "github-light" },
    colorReplacements: {
      "github-dark": {
        "#1f1f1f": "#1f2937",
      },
      "github-light": {
        "#fff": "#f3f4f6",
      },
    },
  })

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

const Code = (props: PropsWithChildren) => {
  return (
    <code className="not-prose bg-muted p-1 rounded">{props.children}</code>
  )
}

const Table = (props: PropsWithChildren) => {
  return (
    <div className="overflow-auto">
      <table className="whitespace-nowrap max-w-fit mx-auto">
        {props.children}
      </table>
    </div>
  )
}

const Math = (props: PropsWithChildren) => {
  const math = reconstructMarkdown(props.children)

  if (math.startsWith("$$")) {
    return <BlockMath>{math.replace(/\$\$/g, "")}</BlockMath>
  } else {
    return <InlineMath>{math.replace(/\$/g, "")}</InlineMath>
  }
}

const MarkdownImage = (props: {
  slug: string
  src: string
  className?: string
}) => {
  const slug = props.slug
  const fileName = path.basename(props.src)

  return (
    <Image
      src={JSON.parse(
        JSON.stringify(require("/public/figures/" + slug + "/" + fileName))
      )}
      className="rounded mx-auto my-4"
      alt="test"
    />
  )
}
