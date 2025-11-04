# README

This is the personal website of Willem Sleegers.

## Development Workflow

This site uses Next.js with Quarto for blog posts containing R code.

### Development
```bash
npm run dev
```

Starts Velite (content processor) and Next.js dev server (typically at http://localhost:3000)

### Writing Posts

1. Create `.qmd` file in `content/posts/your-post-name/`
2. Add minimal frontmatter (title, description, date, tags)
3. Write content with R code chunks
4. Render `.qmd` → `.md` (IDE Preview or `quarto render`)
5. Velite copies figures and updates paths
6. View in browser at `/blog/your-post-name`
