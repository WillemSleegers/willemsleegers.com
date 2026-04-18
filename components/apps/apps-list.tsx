import Link from "next/link"
import { siGithub } from "simple-icons"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { apps } from "@/config/site"

export const Apps = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
      {apps.map((app) => {
        return (
          <Card key={app.id}>
            <CardHeader className="gap-3">
              <CardTitle className="text-center text-xl">{app.title}</CardTitle>
              <CardDescription className="text-base">
                {app.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-2">
              <Button asChild>
                <Link href={app.url} target="_blank" rel="noopener noreferrer">
                  Visit app
                </Link>
              </Button>
              <Button asChild variant="outline" size="icon">
                <Link
                  href={app.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View on GitHub"
                >
                  <svg
                    role="img"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-current"
                  >
                    <path d={siGithub.path} />
                  </svg>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
