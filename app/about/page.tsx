import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"

import { ContactIcons } from "@/components/layout/contact-icons"

import { siteConfig } from "@/config/site"

import avatar from "@/assets/images/avatar.png"

export const metadata: Metadata = {
  title: "About Me",
  description: "Information about me",
}

export default async function AboutPage() {
  return (
    <div className="container max-w-5xl py-6 lg:py-10">
      <h1 className="font-black text-4xl lg:text-5xl mb-12">About Me</h1>
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-20 items-center md:items-start">
        <div className="min-w-48 max-w-48 flex flex-col gap-6">
          <Image src={avatar} alt="Avatar of Willem" className="rounded-full mb-4" />
          <h2 className="text-2xl font-bold text-center break-words">
            {siteConfig.author}
          </h2>
          <ContactIcons />
        </div>
        <div className="prose dark:prose-invert max-w-full">
          <p className="text-muted-foreground text-lg">
            I'm a Methodologist at{" "}
            <Link href="https://www.cbs.nl">Statistics Netherlands</Link>
            . Statistics Netherlands is the national statistical office of the Netherlands,
            responsible for collecting, processing, and publishing statistical information
            about Dutch society. As a methodologist, I design and evaluate surveys, through desk research and user tests. 
          </p>
          <p className="text-muted-foreground text-lg">
            I maintain an affiliation with{" "}
            <Link href="https://www.tilburguniversity.edu">
              Tilburg University
            </Link>. I continue to be involved in several
            academic projects and still do the things that academics do (e.g., publish
            papers, present at conferences).
          </p>
          <p className="text-muted-foreground text-lg">
            Previously, I was a Senior Behavioral Scientist at{" "}
            <Link href="https://rethinkpriorities.org">Rethink Priorities</Link>
            {" "}and an assistant professor in the Department of Social Psychology at
            Tilburg University.
          </p>
          <p className="text-muted-foreground text-lg">
            On this website you can find information about some of the projects
            I'm involved in. Besides writing about these projects, I also blog
            about various topics, including tutorials and opinion pieces.
          </p>
          <p className="text-muted-foreground text-lg">
            This website's look was inspired by{" "}
            <Link href="https://www.youtube.com/@JollyCoding">
              Jolly Coding
            </Link>{" "}
            and is created using <Link href="https://nextjs.org">Next.js</Link>,{" "}
            <Link href="https://ui.shadcn.com">shadcn/ui</Link>,{" "}
            <Link href="https://velite.js.org">velite</Link>, and{" "}
            <Link href="https://quarto.org">Quarto</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
