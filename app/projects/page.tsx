import { PageHeader } from "@/components/layout/page-header"
import { Projects } from "@/components/projects/projects-list"
import { LAYOUT_CLASSES } from "@/lib/constants"

export default function ProjectsPage() {
  return (
    <div className={LAYOUT_CLASSES.CONTAINER}>
      <PageHeader
        title="Projects"
        description="Various projects I'm involved in, including academic projects and software tools."
      />
      <div className="mt-(--fluid-md)">
        <Projects />
      </div>
    </div>
  )
}
