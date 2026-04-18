import Link from "next/link"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { projects } from "@/config/site"

export const Projects = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
      {projects.map((project) => {
        return (
          <Card key={project.id}>
            <CardHeader className="gap-3">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <CardDescription className="text-base">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href={project.url}
                className="text-sm text-primary hover:underline"
              >
                View project
              </Link>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
