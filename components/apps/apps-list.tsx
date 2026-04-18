import Link from "next/link"
import { siGithub } from "simple-icons"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { apps } from "@/config/site"

export const Apps = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
      {apps.map((app) => {
        return (
          <Card key={app.id}>
            <CardHeader className="gap-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{app.title}</CardTitle>
                <div className="flex items-center gap-4">
                  <Link href={app.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">Visit app</Link>
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
              </div>
              <CardDescription className="text-base">
                {app.description}
              </CardDescription>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
