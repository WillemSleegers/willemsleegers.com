import { posts } from "#site/content"

/**
 * Post type inferred from Velite-generated content.
 * This ensures the type stays in sync with the Velite schema.
 */
export type Post = (typeof posts)[number]

/**
 * Tag counts mapping tag names to their occurrence counts
 */
export type TagCounts = Record<string, number>
