# willemsleegers.com - Codebase Summary

## Overview

Personal website and blog for Willem Sleegers, a Senior Behavioral Scientist at Rethink Priorities and Research Affiliate at Tilburg University. The site serves as a professional portfolio and publishing platform for statistical tutorials, data science content, and opinion pieces.

## Technology Stack

**Framework**: Next.js 16 with React 19, TypeScript 5, and Turbopack
**Styling**: Tailwind CSS v4.1 with shadcn/ui component library (Radix UI primitives)
**Content**: Quarto for scientific publishing + Velite for static content processing
**Features**: KaTeX math rendering, Shiki syntax highlighting, next-themes for dark mode

## Content Workflow

### Blog Post Creation Pipeline

1. **Author** creates `.qmd` (Quarto) file in `content/posts/[post-slug]/`
   - YAML frontmatter (title, date, description, tags, draft)
   - R code chunks with statistical analysis
   - Markdown content

2. **Quarto** renders `.qmd` → `.md`
   - Executes R code and generates outputs
   - Creates figures in `_files/figure-commonmark/` subdirectory
   - Outputs GitHub-flavored markdown

3. **Velite** processes markdown at build time
   - Custom loader extracts post slug from directory structure
   - Copies figures from Quarto output to `/public/figures/[slug]/`
   - Rewrites image paths in markdown for web serving
   - Validates against Post schema and generates TypeScript types
   - Outputs content to `.velite/` for build-time imports

4. **Next.js** renders posts
   - Static generation via `generateStaticParams`
   - Custom markdown-to-jsx with overrides for images, code, math, tables
   - Shiki pre-renders syntax highlighting with theme support
   - Radix Collapsible for code folding

### Development Commands

```bash
npm run dev              # Start dev server (Velite + Next.js)
npm run quarto:render    # Render .qmd files to .md
npm run quarto:preview   # Preview with Quarto
npm run build            # Production build
```

### Important Notes for Claude Code

**DO NOT start dev servers** - The user manages their own dev server.

**Multiple Dev Servers Issue**: If the user reports that changes aren't appearing in the browser, check for multiple dev servers running on port 3000 using `lsof -ti:3000`. If multiple PIDs are returned, kill them all with `lsof -ti:3000 | xargs kill -9` so the user can restart cleanly.

**Working Systematically on Complex Changes**: Any non-trivial task (layout, refactoring, multi-file changes, etc.) requires a systematic approach to avoid scattered, incremental edits that compound confusion. Always follow this process:
1. Use TodoWrite to track multi-step tasks - no exceptions
2. Read and document current state of ALL affected files
3. Write desired behavior in plain English
4. Design the complete solution before coding
5. Implement in ONE coherent edit per file
6. Verify the result

**Updating CLAUDE.md**: When you discover important patterns, gotchas, or workflow improvements during a session, proactively suggest adding them to this file. Future Claude sessions will benefit from documented lessons learned.

## Project Structure

```
app/                    # Next.js App Router pages
  ├── blog/            # Blog listing and individual posts
  ├── projects/        # Project showcase pages
  ├── about/           # About page
  └── cv/              # CV page
components/            # React components
  ├── ui/             # shadcn/ui primitives (buttons, cards, badges, etc.)
  ├── navigation/     # Header, nav links, logo
  ├── post/           # Post preview cards, pagination, tags
  ├── theme/          # Theme provider and mode toggle
  └── math/           # KaTeX math rendering
content/posts/         # Blog post .qmd and .md files (48+ posts)
public/figures/        # Blog post figures (copied by Velite)
lib/                   # Utility functions (post sorting, formatting, etc.)
config/                # Site metadata and configuration
```

## Key Features

- **48+ Blog Posts**: Statistics, R tutorials, Bayesian analysis, data science
- **Static Site Generation**: All posts pre-rendered at build time
- **Rich Content**: Math equations (KaTeX), syntax highlighting (Shiki), collapsible code
- **Tag System**: Category-based navigation and filtering
- **Theme Support**: Light/dark mode with system preference detection
- **Responsive Design**: Mobile-first with Tailwind breakpoints
- **Image Optimization**: Next.js Image component for post figures
- **Projects Showcase**: LIME, Cognitive Dissonance RRR, tidystats

## Content Types

- **Blog Posts**: Technical tutorials and opinion pieces with executable R code
- **Projects**: Detailed project pages with descriptions and links
- **Static Pages**: About, CV

## Styling Approach

- Tailwind CSS utility-first methodology
- CSS variables for theming (HSL color palette)
- CVA (class-variance-authority) for component variants
- shadcn/ui for consistent, accessible UI components
- Tailwind Typography plugin for prose styling
