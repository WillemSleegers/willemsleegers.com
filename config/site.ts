export const siteConfig = {
  url: "https://willemsleegers.com",
  description: "My personal website.",
  author: "Willem Sleegers",
  job: "Senior behavioral scientist",
  links: {
    twitter: "https://twitter.com/willemsleegers",
    github: "https://github.com/willemsleegers",
  },
}

export type SiteConfig = typeof siteConfig

export const apps: {
  id: string
  title: string
  description: string
  url: string
  githubUrl: string
}[] = [
  {
    id: "three-point-project-planner",
    title: "Three-Point Project Planner",
    description:
      "A project estimation tool that uses three-point estimation and Monte Carlo simulation to predict realistic project completion times.",
    url: "https://three-point-project-planner.vercel.app",
    githubUrl: "https://github.com/WillemSleegers/three-point-project-planner",
  },
  {
    id: "test-survey-tool",
    title: "Test Survey Tool",
    description:
      "An application that converts structured text files into interactive survey questionnaires suitable for user testing.",
    url: "https://test-survey-tool.vercel.app",
    githubUrl: "https://github.com/WillemSleegers/test-survey-tool",
  },
  {
    id: "type-to-read",
    title: "Type to Read",
    description:
      "A typing practice app that lets you improve your typing speed and accuracy while reading content you want to read.",
    url: "https://type-to-read.vercel.app",
    githubUrl: "https://github.com/WillemSleegers/type-to-read",
  },
  {
    id: "touch-to-read",
    title: "Touch to Read",
    description:
      "A speed reading app using RSVP (Rapid Serial Visual Presentation). Words are displayed one at a time at a fixed point: touch and hold to read, release to pause.",
    url: "https://touch-to-read.vercel.app",
    githubUrl: "https://github.com/WillemSleegers/touch-to-read",
  },
  {
    id: "sample-stats",
    title: "Sample Stats",
    description:
      "Explore probability distributions through interactive real-time sampling. Draw samples, watch the histogram evolve, and compare the empirical distribution against the theoretical PDF.",
    url: "https://sample-stats.vercel.app",
    githubUrl: "https://github.com/WillemSleegers/sample-stats",
  },
]

export const projects = [
  {
    id: "lime",
    title: "LIME",
    description:
      "A website to explore and analyze intervention studies to reduce animal product consumption.",
    url: "projects/lime",
  },
  {
    id: "cognitive-dissonance",
    title: "Cognitive Dissonance RRR",
    description:
      "A large-scaled replication study of a seminal finding from the cognitive dissonance literature.",
    url: "projects/cognitive-dissonance",
  },
  {
    id: "tidystats",
    title: "tidystats",
    description:
      "A collection of software tools to reproducibly report statistics.",
    url: "projects/tidystats",
  },
]
