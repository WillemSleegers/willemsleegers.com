# willemsleegers.com

Personal website and blog for Willem Sleegers (Senior Behavioral Scientist). Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, KaTeX, and Shiki.

## Content Pipeline

`.qmd` (Quarto) → `.md` → Velite (copies figures to `/public/figures/[slug]/`, rewrites image paths) → Next.js (static generation).

## Rules for Claude Code

**DO NOT start dev servers.** The user manages their own.

**Multiple dev servers**: If changes aren't showing, check `lsof -ti:3000`. If multiple PIDs, kill with `lsof -ti:3000 | xargs kill -9`.

**Complex changes**: Use TodoWrite, read all affected files first, implement in one coherent edit per file.

**Debugging**: Ask clarifying questions before diving into code inspection. A quick "what exactly do you see?" saves time.

**Writing style**: Do not suggest em dashes unless asked. The user finds them overused.

## Project Structure

```
app/           # Next.js App Router (blog, projects, about, cv)
components/    # React components (ui, navigation, post, theme, math)
content/posts/ # .qmd and .md source files
public/figures/# Post figures (managed by Velite)
lib/           # Utility functions
config/        # Site metadata
```
