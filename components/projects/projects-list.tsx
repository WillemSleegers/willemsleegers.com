import Link from "next/link"

import { projects } from "@/config/site"

export const Projects = () => {
  return (
    <ul className="flex flex-col space-y-(--fluid-ml)">
      {projects.map((project) => {
        return (
          <li key={project.id} className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <p className="text-muted-foreground">{project.description}</p>
            <div>
              <Link href={project.url} className="text-sm text-primary hover:underline">Read more</Link>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
