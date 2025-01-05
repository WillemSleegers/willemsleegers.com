import Link from "next/link";

export default function TidystatsPage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10 prose dark:prose-invert">
      <h1>
        tidystats
      </h1>
      <p>
        <span className="text-primary text-lg font-bold">Status: </span>
        <span>Under active (slow) development</span>
      </p>
      <h2>Description</h2>
      <p>
        tidystats refers to a collection of software solutions to improve how statistics are reported and shared in the field of (social) psychology.
      </p>
      <p>
        The first piece of software is an R package called tidystats that enables researchers to export the statistics from their analyses into a single file. It works by adding your analyses to a list (in R) and then exporting this list to a JSON file. This file will contain all the statistics from the analyses, in an organized format, ready to be used in other software.</p>

      <p>
        By storing the output of statistical tests into a separate file, rather than only in one’s manuscript, the researcher no longer needs to worry about which analyses to report in the space-limited manuscript. They can simply share the file together with the manuscript, on OSF or as supplemental material.</p>

      <p>
        An additional benefit is that because JSON files are easy to read for computers, it is (relatively) easy to write software that does cool things with these files.</p>

      <p>
        An example of software that can read the JSON file is the tidystats Microsoft Word add-in. This add-in can be installed via the Add-in Store from inside Word. With this add-in, researchers can upload the JSON file to reveal a user-friendly list of their analyses. Clicking on an analysis reveals the associated statistics and clicking on a statistic inserts it into the document. This add-in also comes with several time-saving features, such as inserting multiple statistics at once (immediately in APA style) and automatic updating of statistics.</p>

      <p>
        Besides working on the software itself, I also spent some time on making it accessible. I have given talks introducing tidystats and I’ve created a [website](https://tidystats.io) to help people become familiar with tidystats.</p>
      <h2>Why is this important?</h2>
      <p>
        With this project, I hope to address two problems in statistics reporting: Incorrect and incomplete statistics reporting.
      </p>
      <p>
        Statistics are often reported incorrectly ([Nuijten et al., 2016](https://doi.org/10.3758/s13428-015-0664-2)). I think this is because researchers do not have the necessary software tools to reliably take the output of statistics from their data analysis software and enter it into their text editor. Instead, researchers are likely to copy statistics from the output by hand or by copy-pasting the output. Both techniques are error-prone, resulting in many papers containing statistical typos. This is a problem because statistical output is used in meta-analyses to aggregate the statistical evidence for theories, which in turn may affect policy. In some cases, the errors may even be so large that it affects the conclusion drawn from the statistical test.
      </p>
      <p>
        There is also a more fundamental issue. Researchers usually only report the statistics in their manuscript and nowhere else. As a result, researchers face trade-offs between reporting all statistics, writing a legible text, and journal guidelines. Reporting all statistics makes results sections difficult (and boring) to read and it also takes up valuable space. Consequently, researchers are likely to only report the statistics that they deem to be relevant, rather than reporting all the statistics. While this is fine for someone who wants to simply read the paper and get the main takeaway, this is not desirable from a cumulative science perspective. All statistics should be easily available so they can be build on in future research.
      </p>
      <h2>Links</h2>
      <ul>
        <li>The tidystats <Link href="https://tidystats.io/">website</Link></li>
        <li>R package on <Link href="https://cran.r-project.org/web/packages/tidystats/index.html">CRAN</Link></li>
        <li>R package <Link href="https://github.com/WillemSleegers/tidystats">GitHun repository</Link></li>
        <li>The tidystats Word add-in in <Link href="https://appsource.microsoft.com/en-us/product/office/wa200002476?tab=overview">AppSource</Link> (the Office add-in store)</li>
        <li>Word add-in <Link href="https://github.com/WillemSleegers/tidystats-Word-add-in">GitHub</Link> repository</li>
      </ul>
    </div>
  )
}
