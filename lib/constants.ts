/**
 * Pagination configuration
 */
export const POSTS_PER_PAGE = 5

/**
 * Route paths
 */
export const ROUTES = {
  HOME: "/",
  BLOG: "/blog",
  TAGS: "/tags",
  PROJECTS: "/projects",
  ABOUT: "/about",
  CV: "/cv",
} as const

/**
 * Syntax highlighting configuration (Shiki)
 */
export const SHIKI_CONFIG = {
  themes: {
    dark: "github-dark",
    light: "github-light",
  },
  colorReplacements: {
    "github-dark": { "#1f1f1f": "#1f2937" },
    "github-light": { "#fff": "#f3f4f6" },
  },
} as const

/**
 * Image defaults for blog posts
 */
export const IMAGE_DEFAULTS = {
  POST_WIDTH: 800,
  POST_HEIGHT: 600,
} as const

/**
 * Common layout class patterns
 */
export const LAYOUT_CLASSES = {
  CONTAINER: "container max-w-4xl py-6 lg:py-10",
  GRID_MAIN: "col-span-12 col-start-1 sm:col-span-8",
  GRID_SIDEBAR:
    "col-span-12 row-start-3 h-fit sm:col-span-4 sm:col-start-9 sm:row-start-1",
} as const
