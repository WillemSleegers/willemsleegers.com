import path from "path"
import Image from "next/image"
import Markdown from "markdown-to-jsx"
import React, { PropsWithChildren, ReactElement, ReactNode } from "react"

import { codeToHtml } from "shiki"

import "katex/dist/katex.min.css"
import { BlockMath, InlineMath } from "@/components/math/math"

import { Tag } from "@/components/post/tag"
import { CodeBlock } from "@/components/post/code-block"
import { CodeFold as CodeFoldComponent } from "@/components/post/code-fold"
import { TableOfContents } from "@/components/post/table-of-contents"

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
    <main className="p-6">
      <div className="mx-auto max-w-prose xl:max-w-none flex flex-col xl:flex-row xl:gap-8 xl:justify-center">
        {post.toc !== false && (
          <div className="mb-6 xl:mb-0 xl:w-64 xl:flex-shrink-0 xl:order-2">
            <TableOfContents content={content} />
          </div>
        )}
        <div className="xl:max-w-3xl xl:order-1">
          <article className="prose dark:prose-invert">
          <div className="flex flex-col gap-4">
          <div>
            <h1 className="mb-3">{post.title}</h1>
            {post.description && (
              <p className="text-muted-foreground mb-0 mt-0">
                {post.description}
              </p>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-row gap-2">
              {post.tags.map((tag: string) => (
                <Tag tag={tag} key={tag} />
              ))}
            </div>
          )}
          {post.date && (
            <div className="not-prose flex flex-row gap-4 text-sm">
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
          <hr className="mt-2 mb-0" />
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
        </div>
      </div>
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
    return <CodeFoldComponent defaultOpen={props.open}>{pre}</CodeFoldComponent>
  } else return
}

const Pre = async (props: PropsWithChildren) => {
  const children = props.children as ReactElement
  const code = children.props as { className?: string; children: string }

  // Extract language from className, handling various formats
  let language = "r" // default
  if (code.className) {
    const match = code.className.match(/lang-(\w+)/)
    if (match) {
      language = match[1]
    }
  }

  const html = await codeToHtml(code.children, {
    lang: language,
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

  return <CodeBlock html={html} language={language} />
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
      src={`/figures/${slug}/${fileName}`}
      className="rounded mx-auto my-4"
      alt="test"
      width={800}
      height={600}
    />
  )
}
