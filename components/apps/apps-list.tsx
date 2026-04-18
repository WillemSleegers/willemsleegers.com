import Link from "next/link"
import { siGithub } from "simple-icons"

import { Button } from "@/components/ui/button"
import { apps } from "@/config/site"

export const Apps = ({ limit }: { limit?: number }) => {
  const displayedApps = limit ? apps.slice(0, limit) : apps

  return (
    <>
      <ul className="flex flex-col space-y-(--fluid-ml)">
        {displayedApps.map((app) => {
          return (
            <li key={app.id} className="flex flex-col gap-3">
              <h2 className="text-2xl font-bold">{app.title}</h2>
              <p className="text-muted-foreground">{app.description}</p>
              <div className="flex items-center gap-4">
                <Link
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Visit app
                </Link>
                <Link
                  href={app.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View on GitHub"
                  className="flex items-center hover:opacity-70"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current"
                  >
                    <path d={siGithub.path} />
                  </svg>
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
      {limit && (
        <Button asChild className="w-fit mx-auto mt-(--fluid-sm)">
          <Link href="/apps">All apps</Link>
        </Button>
      )}
    </>
  )
}
