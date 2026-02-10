import Image from "next/image"
import { MarkdownAsync } from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import React, { PropsWithChildren, ReactElement, ReactNode } from "react"

import { codeToHtml } from "shiki"

import "katex/dist/katex.min.css"

import { Tag } from "@/components/post/tag"
import { CodeBlock } from "@/components/post/code-block"
import { CodeFold as CodeFoldComponent } from "@/components/post/code-fold"
import { TableOfContents } from "@/components/post/table-of-contents"

import { SHIKI_CONFIG, IMAGE_DEFAULTS } from "@/lib/constants"
import { formatDate } from "@/lib/utils"
import { extractQuartoToc } from "@/lib/markdown/transforms"

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

  // Extract Quarto's TOC and remove it from content
  const { toc, content: contentWithoutToc } = extractQuartoToc(post.content)

  // Strip Quarto's <math> wrapper tags — remark-math handles $...$ and $$...$$ natively
  const content = contentWithoutToc
    .replaceAll("/<math>", "</math>") // fix typo in source first
    .replace(/<math>\s*/g, "")
    .replace(/\s*<\/math>/g, "")

  return (
    <main className="p-6">
      <div className="mx-auto max-w-prose xl:max-w-none flex flex-col xl:flex-row xl:gap-8 xl:justify-center">
        {post.toc !== false && toc.length > 0 && (
          <div className="mb-6 xl:mb-0 xl:w-64 xl:flex-shrink-0 xl:order-2">
            <TableOfContents items={toc} />
          </div>
        )}
        <div className="xl:max-w-3xl xl:order-1">
          <article className="prose dark:prose-invert">
          <div className="flex flex-col gap-3 mb-8">
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
            <div className="not-prose text-sm flex gap-4">
              <div>
                <div className="text-muted-foreground">Published</div>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              {post.updated && (
                <div>
                  <div className="text-muted-foreground">Last updated</div>
                  <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                </div>
              )}
            </div>
          )}
        </div>
        <MarkdownAsync
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={{
            img: Img,
            details: Details,
            pre: Pre,
            code: Code,
            table: Table,
          }}
        >
          {content}
        </MarkdownAsync>
          </article>
        </div>
      </div>
    </main>
  )
}

const Img = (props: { src?: string | Blob; alt?: string }) => {
  if (!props.src || typeof props.src !== "string") return null

  return (
    <Image
      src={props.src}
      className="rounded mx-auto my-4"
      alt={props.alt || ""}
      width={IMAGE_DEFAULTS.POST_WIDTH}
      height={IMAGE_DEFAULTS.POST_HEIGHT}
    />
  )
}

const Details = (props: {
  open?: boolean
  className?: string
  children?: ReactNode
  node?: unknown
}) => {
  if (props.className !== "code-fold") return null

  // Filter out summary element and whitespace, keep the code content
  const children = React.Children.toArray(props.children)
  const codeContent = children.filter((child) => {
    if (typeof child === "string" && child.trim() === "") return false
    if (React.isValidElement(child) && (child as ReactElement).type === "summary")
      return false
    return true
  })

  return (
    <CodeFoldComponent defaultOpen={props.open ?? false}>
      {codeContent}
    </CodeFoldComponent>
  )
}

const Pre = async (props: PropsWithChildren) => {
  const children = props.children as ReactElement
  const code = children.props as { className?: string; children: string }

  // Only apply syntax highlighting to code blocks with a language class.
  // Indented code blocks (e.g. R output) have no class and should render plain.
  const match = code.className?.match(/language-(\w+)/)

  if (!match) {
    return (
      <pre className="bg-muted rounded p-4 overflow-x-auto my-4 text-sm">
        <code>{code.children}</code>
      </pre>
    )
  }

  const language = match[1]

  const html = await codeToHtml(code.children, {
    lang: language,
    themes: SHIKI_CONFIG.themes,
    colorReplacements: SHIKI_CONFIG.colorReplacements,
  })

  return <CodeBlock html={html} language={language} />
}

const Code = (props: { className?: string; children?: ReactNode }) => {
  // Code blocks have language-* className — pass through for Pre to handle
  if (props.className) {
    return <code className={props.className}>{props.children}</code>
  }
  // Inline code
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