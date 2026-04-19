# willemsleegers.com

Personal website and blog.

## Content Pipeline

`.qmd` (Quarto) → `.md` → Velite (copies figures to `/public/figures/[slug]/`, rewrites image paths) → Next.js (static generation).

Quarto runs locally only — Vercel can't render `.qmd` files. Always commit the generated `.md` files so the production build has post content.

## Rules for Claude Code

**Debugging**: Ask clarifying questions before diving into code inspection. A quick "what exactly do you see?" saves time.

**Writing style**: Sparingly use em dashes.
