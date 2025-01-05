import Link from "next/link"

export default function ProjectPage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10 prose dark:prose-invert">
      <h1>LIME</h1>
      <p>
        <span className="text-primary text-lg font-bold">Status: </span>
        <span>Under active development</span>
      </p>
      <h2>Description</h2>
      <p>
        LIME is a <Link href="https://meat-lime.vercel.app">website</Link> to
        explore and analyze a continuously growing database of studies examining
        psychological interventions to reduce animal product consumption and
        improve attitudes towards animals. With LIME, you can explore individual
        studies, understand the current state of research, and evaluate which
        interventions have the strongest evidence behind them.
      </p>
      <h2>Why is this important?</h2>
      <p>
        The suffering of farmed animals is, in my opinion, one the most glaring
        moral blindspots of our time. Their suffering is so clear and so vast
        that much should be done to try and reduce the consumption of animal
        products (for more on this, see{" "}
        <Link href="https://80000hours.org/problem-profiles/factory-farming/">
          here
        </Link>
        ).
      </p>
      <p>
        One of the ways to reduce animal product consumption is through
        interventions based on psychological principles. Fortunately, a lot of
        scientific studies have been and are being conducted to see which
        interventions are effective. These include interventions such as
        leafleting, showing videos with factual or emotional content, changes in
        food labeling or menu design, and in-person classes and discussions.
      </p>
      <p>
        The trouble is, though, that it is difficult to find out what exactly is
        being tested and how strong the evidence is in favor of a particular
        type of intervention. Interventions are tested in different countries,
        with different samples, and using different methodologies. Results are
        also scattered across reports by advocacy groups and published and
        unpublished papers across various academic fields (e.g., psychology,
        economics, medicine). In other words, it is difficult to find,
        understand, and synthesize the evidence. For advocates and policy
        makers, who often have limited experience with searching the academic
        literature and who are not familiar with many methodological and
        statistical intricacies, actionable insights remain difficult to
        extract. Thus, a comprehensive and easily understandable summary of the
        literature is extremely valuable.
      </p>

      <p>
        Narrative reviews and meta-analyses attempt to summarize the evidence
        and both approaches have been applied to the literature on meat
        reduction interventions. However, these approaches have significant
        shortcomings that limit their usefulness. Studies differ on dozens of
        dimensions making it difficult to narratively compare them and to draw
        inferences about which factors contributed to the effectiveness of an
        intervention. Meta-analyses aim to address these shortcomings by
        synthesizing evidence in a quantitative way. They offer various
        additional insights into the strength of the evidence (e.g., tests of
        publication bias) and the role of different features in shaping the
        effectiveness of an intervention (e.g., meta-regression). However,
        existing reviews and meta-analyses of meat reduction interventions,
        which are usually published as research papers, have various
        shortcomings that limit their usefulness. They are often limited in
        scope, only focusing on one type of intervention. They contain a limited
        set of analyses that may not address many questions that readers may
        have (e.g., how effective are leafleting campaigns in Europe vs. the
        US?). Finally, they only provide a brief snapshot of a quickly
        accumulating evidence base.{" "}
      </p>

      <p>
        LIME is a potential solution for the limitations highlighted here
        because it is both an extensive database of randomized-controlled trials
        of meat reduction interventions that will be updated with results of
        future studies and a website consisting of customizable analysis tools
        for exploring and synthesizing the evidence in an accessible manner.
      </p>

      <p>
        LIME is definitely a work in progress still, so if you have any
        feedback, feel free to share it!
      </p>
      <h2>Links</h2>
      <ul>
        <li>
          <Link href="https://meat-lime.vercel.app">The LIME website</Link>
        </li>
        <li>
          <Link href="https://docs.google.com/spreadsheets/d/1asBfkq4AkTtdcb_yZTkN685LVeV5DYHNrO83g9N5HCU/edit?pli=1&gid=0#gid=0">
            The LIME database
          </Link>
        </li>
      </ul>
    </div>
  )
}
