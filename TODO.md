# Website Improvement TODOs

## High Priority - Blog Post Rendering

### Markdown Rendering Improvements

- [x] **Keep markdown-to-jsx** (Decision: Recent updates, works well for our use case)

  - Current implementation is optimal for Quarto → Markdown → JSX workflow
  - Simple override system handles all needs without heavy plugin ecosystem
  - Better performance than react-markdown for our use case

- [ ] **Investigate markdown processing inefficiencies**

  - Current: Runtime `replaceClassWithClassName()` converts Quarto's `class=` to `className=`
  - Current: `reconstructMarkdown()` converts React elements back to markdown strings for KaTeX
  - Consider: Processing `class` → `className` during Velite build step instead of runtime
  - Consider: Alternative math rendering that doesn't require markdown reconstruction
  - Files: `lib/markdown/reconstruction.ts`, `lib/markdown/transforms.ts`
  - Impact: Could improve performance and simplify rendering pipeline

- [x] **Implement proper code block component with shadcn styling**

  - Created: `components/post/code-block.tsx` with interactive features
  - Added: Copy-to-clipboard button with tooltip
  - Added: Language badge that appears on hover
  - Uses: shadcn/ui Button + Tooltip components
  - Integrated: With Shiki syntax highlighting

- [x] **Add table of contents component for long posts**

  - Generate TOC from markdown headings (h2, h3)
  - Sticky sidebar on desktop, shows at top on mobile
  - Respects Quarto `toc: false` frontmatter setting
  - File: `components/post/table-of-contents.tsx`
  - **Future enhancement**: Support additional Quarto TOC settings (`toc-depth`, `toc-title`, `toc-location`)

- [ ] **Improve image handling in blog posts**

  - Add: Image captions from alt text or figure attributes
  - Add: Lightbox/zoom functionality for images
  - File: Enhance `components/post/markdown-image.tsx`

- [ ] **Add callout/admonition components**
  - Create: Info, Warning, Tip, Note callout boxes
  - Use: shadcn Alert component as base
  - Support: Markdown extension for `:::tip`, `:::warning` syntax
  - File: Create `components/post/callout.tsx`

### Post Metadata & Navigation

- [ ] **Improve post metadata display**
  - Current: Simple text display
  - Use: shadcn Badge for tags with hover effects
  - File: Update `app/blog/[slug]/page.tsx`

## High Priority - UI/UX Improvements

### Component Migration to shadcn

- [ ] **Audit and replace custom components with shadcn equivalents**

  - Current custom: hero.tsx, projects-list.tsx, contact-icons.tsx
  - Evaluate: Which can use shadcn Card, Button, Badge variants
  - File: `components/layout/hero.tsx`, `components/projects/projects-list.tsx`

- [ ] **Add shadcn Separator component**

  - Replace: Custom dividers and borders throughout site
  - Use: Consistent separator styling
  - File: Create `components/ui/separator.tsx`

- [ ] **Add shadcn Tooltip component**

  - Use: Social media icons, action buttons, code blocks
  - File: Create `components/ui/tooltip.tsx`

- [ ] **Implement shadcn Dialog component**

  - Use: Image lightbox, full post preview modal
  - File: Create `components/ui/dialog.tsx`

- [ ] **Add shadcn Input and Textarea components**
  - Use: Search functionality (future), contact form
  - File: Create `components/ui/input.tsx`, `components/ui/textarea.tsx`

### Navigation Improvements

- [ ] **Enhance mobile navigation with shadcn Sheet**

  - Current: Custom hamburger menu
  - Replace: shadcn Sheet (slide-out drawer) for better UX
  - File: Update `components/navigation/nav-bar.tsx`

- [ ] **Add search functionality to blog**

  - UI: shadcn Command (⌘K menu) for fuzzy search
  - Index: Post titles, descriptions, tags, content
  - File: Create `components/blog/search-command.tsx`

- [ ] **Improve tag navigation UI**
  - Current: Simple badge list in sidebar
  - Add: Tag cloud with size based on post count
  - Add: shadcn HoverCard for tag descriptions/post count
  - File: Update `app/blog/page.tsx`, create `components/post/tag-cloud.tsx`

### Layout & Responsive Design

- [ ] **Improve blog list layout with grid system**

  - Current: Single column list
  - Add: Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
  - Use: Tailwind grid with consistent spacing
  - File: Update `app/blog/page.tsx`

- [ ] **Add sticky navigation on scroll**

  - Behavior: Navbar becomes compact/sticky when scrolling down
  - Use: IntersectionObserver or scroll event
  - File: Update `components/navigation/nav-bar.tsx`

- [ ] **Improve footer design**
  - Current: Basic component
  - Add: Newsletter signup (if applicable), better social links
  - Use: shadcn components for consistency
  - File: Update `components/footer.tsx`

## Medium Priority - Codebase Quality

### Type Safety & Architecture

- [x] **Add explicit types for post metadata**

  - Created: `lib/types.ts` with Post type inferred from Velite using typeof
  - Added: TagCounts type for consistent tag handling
  - Used: Throughout app for better type checking

- [ ] **Extract repeated Tailwind classes to component variants**

  - Use: CVA more extensively for container, heading, text variants
  - File: Create `lib/component-variants.ts`

- [x] **Refactor post rendering logic**
  - Extracted: Markdown processing utilities to `lib/markdown/` directory
  - Created: `lib/markdown/reconstruction.ts` for KaTeX support
  - Created: `lib/markdown/transforms.ts` for HTML class conversion
  - Split: `lib/utils.ts` from 103 lines to 15 lines

### Code Organization

- [x] **Reorganize components directory**

  - Restructured with proper subdirectories:
    - `components/layout/` (hero, footer, contact-icons)
    - `components/navigation/` (hamburger-button, nav-bar, etc.)
    - `components/post/` (all blog post components)
    - `components/projects/` (projects-list)
    - `components/theme/` (mode-toggle, theme-provider)
    - `components/ui/` (shadcn components)

- [x] **Create shared constants file**

  - Created: `lib/constants.ts`
  - Extracted: Pagination size, routes, Shiki config, image defaults, layout classes
  - Used: Across 9+ files for consistent configuration

- [ ] **Add component documentation**
  - Format: JSDoc comments with prop descriptions
  - Tool: Consider Storybook for component showcase

### Performance Optimizations

- [ ] **Implement view transitions API**

  - Use: Native browser view transitions for page navigation
  - Fallback: For browsers without support
  - File: Update `app/layout.tsx`

## Low Priority - Features & Enhancements

### Content Features

- [ ] **Add RSS feed generation**

  - Use: next-rss or custom feed generation
  - File: Create `app/feed.xml/route.ts`

- [ ] **Add sitemap generation**

  - Use: next-sitemap package
  - File: Update `next.config.mjs`

- [ ] **Implement post series/collections**

  - Group: Multi-part posts (e.g., "Understanding Regression" series)
  - UI: Series navigation in post header
  - File: Update Velite schema, create series component

### Analytics & SEO

- [ ] **Add structured data for blog posts**

  - Use: JSON-LD schema for BlogPosting
  - File: Update `app/blog/[slug]/page.tsx` metadata

- [ ] **Improve Open Graph images**

  - Generate: Dynamic OG images per post with Next.js ImageResponse
  - File: Create `app/blog/[slug]/opengraph-image.tsx`

- [ ] **Add analytics tracking**
  - Consider: Privacy-focused analytics (Plausible, Umami)
  - Track: Page views, popular posts, tag usage
  - File: Update `app/layout.tsx`

### Accessibility

- [ ] **Audit with axe DevTools**

  - Fix: Any contrast, heading hierarchy, or ARIA issues
  - Ensure: Keyboard navigation works throughout

- [ ] **Add skip-to-content link**

  - Use: Hidden link for keyboard users
  - File: Update `app/layout.tsx`

- [ ] **Improve focus indicators**
  - Ensure: Visible focus rings on all interactive elements
  - Use: Tailwind focus utilities consistently
