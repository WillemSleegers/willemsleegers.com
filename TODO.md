# Website Improvement TODOs

## High Priority - Blog Post Rendering

### Markdown Rendering Improvements
- [x] **Keep markdown-to-jsx** (Decision: Recent updates, works well for our use case)
  - Current implementation is optimal for Quarto → Markdown → JSX workflow
  - Simple override system handles all needs without heavy plugin ecosystem
  - Better performance than react-markdown for our use case

- [ ] **Implement proper code block component with shadcn styling**
  - Current: Pre-styled HTML from Shiki without interactive features
  - Add: Copy-to-clipboard button, language badge, line highlighting
  - Use: shadcn/ui Button + Tooltip for copy functionality
  - File: Create `components/post/code-block.tsx`

- [ ] **Add table of contents component for long posts**
  - Generate TOC from markdown headings (h2, h3)
  - Sticky sidebar on desktop, collapsible on mobile
  - Use: shadcn Collapsible + ScrollArea
  - File: Create `components/post/table-of-contents.tsx`

- [ ] **Improve image handling in blog posts**
  - Add: Image captions from alt text or figure attributes
  - Add: Lightbox/zoom functionality for images
  - Add: Loading skeletons with shadcn Skeleton
  - File: Enhance `components/post/markdown-image.tsx`

- [ ] **Add callout/admonition components**
  - Create: Info, Warning, Tip, Note callout boxes
  - Use: shadcn Alert component as base
  - Support: Markdown extension for `:::tip`, `:::warning` syntax
  - File: Create `components/post/callout.tsx`

### Post Metadata & Navigation

- [ ] **Improve post metadata display**
  - Current: Simple text display
  - Add: Icons from lucide-react (Calendar, Clock, Tag)
  - Use: shadcn Badge for tags with hover effects
  - File: Update `app/blog/[slug]/page.tsx`

## High Priority - UI/UX Improvements

### Component Migration to shadcn
- [ ] **Audit and replace custom components with shadcn equivalents**
  - Current custom: hero.tsx, projects.tsx, contact-icons.tsx
  - Evaluate: Which can use shadcn Card, Button, Badge variants
  - File: `components/hero.tsx`, `components/projects.tsx`

- [ ] **Add shadcn Separator component**
  - Replace: Custom dividers and borders throughout site
  - Use: Consistent separator styling
  - File: Create `components/ui/separator.tsx`

- [ ] **Add shadcn Skeleton component**
  - Use: Loading states for images, post previews
  - File: Create `components/ui/skeleton.tsx`

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
- [ ] **Add explicit types for post metadata**
  - Current: Implicit types from Velite schema
  - Create: Explicit TypeScript interfaces in `lib/types.ts`
  - Use: Throughout app for better type checking

- [ ] **Extract repeated Tailwind classes to component variants**
  - Use: CVA more extensively for container, heading, text variants
  - File: Create `lib/component-variants.ts`

- [ ] **Refactor post rendering logic**
  - Extract: Markdown processing utilities to separate file
  - Create: Reusable markdown renderer hook
  - File: Create `lib/markdown-renderer.tsx`

### Code Organization
- [ ] **Reorganize components directory**
  - Current: Mixed flat and nested structure
  - Group: ui/ (shadcn), blog/ (post-related), layout/ (nav, footer)
  - File: Restructure `components/` directory

- [ ] **Create shared constants file**
  - Extract: Magic numbers (pagination size, excerpt length, etc.)
  - File: Create `lib/constants.ts`

- [ ] **Add component documentation**
  - Format: JSDoc comments with prop descriptions
  - Tool: Consider Storybook for component showcase

### Performance Optimizations
- [ ] **Implement view transitions API**
  - Use: Native browser view transitions for page navigation
  - Fallback: For browsers without support
  - File: Update `app/layout.tsx`

- [ ] **Optimize image loading strategy**
  - Review: Next.js Image priority and loading attributes
  - Add: Blur placeholders for post images
  - File: Update `components/post/markdown-image.tsx`

- [ ] **Add suspense boundaries for post content**
  - Use: React Suspense with loading skeletons
  - File: Update `app/blog/[slug]/page.tsx`

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

- [ ] **Add post reactions/feedback**
  - Simple: Emoji reactions (👍/💡/❤️)
  - Storage: Client-side only or integrate with service
  - File: Create `components/post/reactions.tsx`

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

### Developer Experience
- [ ] **Add ESLint and Prettier configurations**
  - Ensure: Consistent code formatting
  - Add: Pre-commit hooks with husky + lint-staged
  - File: Create `.eslintrc.js`, `.prettierrc`

- [ ] **Create component templates/generators**
  - Tool: Plop.js for scaffolding new components
  - Templates: shadcn component, blog post, page
  - File: Create `plopfile.js`

- [ ] **Add unit tests for utilities**
  - Framework: Vitest or Jest
  - Coverage: Post sorting, date formatting, slug generation
  - File: Create `lib/__tests__/` directory

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

## Notes

- **Priority**: Focus on blog post rendering improvements first (biggest UX impact)
- **shadcn**: Gradually migrate to shadcn components for consistency
- **Testing**: Test all changes on mobile devices (responsive design critical)
- **Performance**: Monitor build times and bundle size as features are added
- **Accessibility**: Keep WCAG AA compliance as minimum standard
