import { LAYOUT_CLASSES } from "@/lib/constants"
import Link from "next/link"

const CognitiveDissonancePage = () => {
  return (
    <div className="container max-w-4xl py-6 lg:py-10 prose dark:prose-invert">
      <h1>Cognitive Dissonance</h1>
      <p>
        <span className="text-primary text-lg font-bold">Status: </span>
        <span>
          Complete; potentially interested in promising follow-up work
        </span>
      </p>
      <h2>Description</h2>
      <p>
        Together with many collaborators, particularly{" "}
        <Link href="https://scholar.google.com/citations?user=Q_RhxuoAAAAJ&hl=en">
          dr. David Vaidis
        </Link>
        , I conducted a large-scaled multi-lab replication study of the induced
        compliance paradigm based on cognitive dissonance theory.
      </p>
      <p>
        Cognitive dissonance refers to a state of aversive arousal that is
        experienced when people realize they possess mutually inconsistent
        cognitions. This state is the foundation of cognitive dissonance theory
        (CDT)—a theory developed by Leon Festinger in 1957. One of the most
        popular paradigms to test this theory is the induced compliance
        paradigm. In this paradigm, participants are induced to do something
        that is counterattitudinal for most people (e.g., students being asked
        to argue in favor of increasing their tuition). They are then asked for
        their attitude towards the counterattitudinal topic and, if cognitive
        dissonance theory is correct, it should result in the participants
        changing their attitude to be more in line with the position they argued
        for (e.g., raising the tuition). To make sure the change in attitude is
        driven by cognitive dissonance and not something else (e.g.,
        self-persuasion), experiments usually manipulate something that should
        cause more or less dissonance. Frequently, this favor is choice freedom.
        Participants are given either more or less choice over choosing to
        perform the counterattitudinal behavior. The idea is that those with
        more choice should experience more dissonance, as those with less choice
        can blame their behavior to the fact they were not given any other
        choice but to perform the counterattitudinal behavior.
      </p>
      <p>
        We tried to replicate this idea using a multi-lab approach. We, David
        and I, worked together with many other collaborators to run a typical
        induced compliance study. In total, we managed to convince 39 labs to do
        this. Together we recruited a total of 4,898 participants, making this
        the largest cognitive dissonance to date. Unfortunately, we did find
        that the counterattitudinal behavior of participants in the high-choice
        condition led to more attitude change compared to the participants in
        the low-choice condition. This is the crucial effect that cognitive
        dissonance theory predicts.
      </p>
      <h2>Why is this important?</h2>
      <p>
        The theory of cognitive dissonance can explain many different phenomena
        that we should understand so that we may intervene and improve the lives
        of others. For example, cognitive dissonance theory has been used to
        explain religious beliefs, unhealthy behaviors, and people's attitude
        towards animals.
      </p>
      <p>
        Before applying the theory, we should be relatively confident that the
        theory holds up. We need to have sufficient evidence to believe in the
        theory. Surprisingly, the social psychological evidence we have for the
        theory is quite weak. A lot of the research that caused cognitive
        dissonance to become textbook material stems from relatively old
        research, mostly conducted in the 50s, 60s, and 70s. While this is not
        necessarily a problem, it is a problem in the case of social psychology.
        The original studies were conducted with extremely low sample sizes and
        without pre-registration, or other tools that limit p-hacking. This
        means that past findings may be false positives.
      </p>
      <p>
        The possibility that something as popular as cognitive dissonance theory
        might not be true is not as unlikely as you might think. There have now
        been several high-profile examples of social psychological findings that
        have failed to replicate.
      </p>
      <p>
        Our results cast significant doubt, in my opinion, on the credibility of
        cognitive dissonance theory. This means more work should be conducted to
        test if and when cognitive dissonance processes occur.
      </p>
      <h2>Links</h2>
      <ul>
        <li>
          <Link href="https://journals.sagepub.com/doi/full/10.1177/25152459231213375">
            Main paper
          </Link>
        </li>
        <li>
          <Link href="https://journals.sagepub.com/doi/10.1177/25152459241268197">
            Reply to commentaries
          </Link>
        </li>
        <li>Google Sheet of induced compliance studies (and more)</li>
      </ul>
    </div>
  )
}

export default CognitiveDissonancePage
