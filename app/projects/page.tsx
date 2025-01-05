import { Projects } from "@/components/projects"

export default function ProjectsPage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10 space-y-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-black text-4xl lg:text-5xl">
            Projects
          </h1>
          <p className="text-muted-foreground text-lg py-4">
            Welcome to my projects page. Here you can find more information
            about various projects that I'm involved in, including academic
            projects and software tools. My projects demonstrate my diverse
            skill set and experience, as well as what I'm passionate about.
            Explore the projects below and feel free to get in touch if you have
            any questions or simply want to have a chat about them.
          </p>
        </div>
      </div>
      <Projects />
    </div>
  )
}
