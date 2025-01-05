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
