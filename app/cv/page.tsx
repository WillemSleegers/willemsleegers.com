import { Metadata } from "next"

import data from "@/assets/data/cv.json"
import { ContactIcons } from "@/components/layout/contact-icons"

export const metadata: Metadata = {
  title: "CV",
  description: "My resume",
}

export default async function CVPage() {
  return (
    <div className="container max-w-5xl py-6 lg:py-10 prose dark:prose-invert">
      <h1 className="text-center mb-4">CV</h1>
      <h2 className="text-center mt-0">Willem W. A. Sleegers</h2>

      <ContactIcons />

      <h3>Currently</h3>
      <p>
        I'm a Methodologist at Statistics Netherlands. Statistics Netherlands is the national statistical office of the Netherlands,
        responsible for collecting, processing, and publishing statistical information
        about Dutch society. As a methodologist, I design and evaluate surveys, through desk research and user tests.
      </p>
      <p>
        I maintain an affiliation with Tilburg University as an Affiliated Researcher. I continue to be involved in several
        academic projects and still do the things that academics do (e.g., publish
        papers, present at conferences).
      </p>
      <p>
        Previously, I was a Senior Behavioral Scientist at Rethink Priorities
        and an assistant professor in the Department of Social Psychology at
        Tilburg University.
      </p>

      <h3>Employment</h3>
      <table>
        <tbody>
          {data.Employment?.default?.map((d, i) => (
            <tr key={"employment-" + i}>
              <td className="whitespace-nowrap">{d.year}</td>
              <td>{d.content}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Education</h3>
      <table>
        <tbody>
          {data.Education?.default?.map((d, i) => (
            <tr key={"education-" + i}>
              <td className="whitespace-nowrap">{d.year}</td>
              <td>{d.content}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Skills</h3>

      <h4>Research</h4>
      <ul>
        {data.Skills?.Research?.map((d, i) => (
          <li key={"skills-research-" + i}>{d.content}</li>
        ))}
      </ul>

      <h4>Statistics</h4>
      <ul>
        {data.Skills?.Statistics?.map((d, i) => (
          <li key={"skills-statistics-" + i}>{d.content}</li>
        ))}
      </ul>

      <h4>Software</h4>
      <ul>
        {data.Skills?.Software?.map((d, i) => (
          <li key={"skills-software-" + i}>{d.content}</li>
        ))}
      </ul>

      <h4>Programming</h4>
      <ul>
        {data.Skills?.Programming?.map((d, i) => (
          <li key={"skills-programming-" + i}>{d.content}</li>
        ))}
      </ul>

      <h4>Survey platforms</h4>
      <ul>
        {data.Skills?.["Survey platforms"]?.map((d, i) => (
          <li key={"skills-survey-" + i}>{d.content}</li>
        ))}
      </ul>

      <h3>Publications</h3>
      <h4>Preprints</h4>
      <ul>
        {data.Publications?.Preprints?.map((d, i) => (
          <li key={"publications-preprints-" + i}>{d.content}</li>
        ))}
      </ul>
      <h4>Peer-reviewed journals</h4>
      <ul>
        {data.Publications?.["Peer-reviewed journals"]?.map((d, i) => (
          <li key={"publications-journals-" + i}>{d.content}</li>
        ))}
      </ul>

      <h4>Book chapters</h4>
      <ul>
        {data.Publications?.["Book chapters"]?.map((d, i) => (
          <li key={"publications-books-" + i}>{d.content}</li>
        ))}
      </ul>

      <h4>Dissertation</h4>
      <ul>
        {data.Publications?.Dissertation?.map((d, i) => (
          <li key={"publications-dissertation-" + i}>{d.content}</li>
        ))}
      </ul>

      <h4>Software</h4>
      <ul>
        {data.Publications?.Software?.map((d, i) => (
          <li key={"publications-software-" + i}>{d.content}</li>
        ))}
      </ul>

      <h3>Presentations</h3>
      <h4>Invited talks</h4>
      <ul>
        {data.Presentations?.["Invited talks"]?.map((d, i) => (
          <li key={"presentations-invited-" + i}>{d.content}</li>
        ))}
      </ul>
      <h4>Conference presentations</h4>
      <ul>
        {data.Presentations?.["Conference presentations"]?.map((d, i) => (
          <li key={"presentations-conference-" + i}>{d.content}</li>
        ))}
      </ul>
      <h4>Small meetings</h4>
      <ul>
        {data.Presentations?.["Small meetings"]?.map((d, i) => (
          <li key={"presentations-small-" + i}>{d.content}</li>
        ))}
      </ul>
      <h4>Poster presentations</h4>
      <ul>
        {data.Presentations?.["Poster presentations"]?.map((d, i) => (
          <li key={"presentations-poster-" + i}>{d.content}</li>
        ))}
      </ul>
      <h4>Valorization presentations</h4>
      <ul>
        {data.Presentations?.["Valorization presentations"]?.map((d, i) => (
          <li key={"presentations-valorization-" + i}>{d.content}</li>
        ))}
      </ul>

      <h3>Journals</h3>
      <p>
        I have reviewed for{" "}
        {data.Journals?.Reviewer?.map((d, i, arr) =>
          i == arr.length - 1 ? "and " + d.content + "." : d.content + ", "
        )}
      </p>
      <p>
        I'm a consulting editor for the Psychology of Human-Animal Intergroup
        Relations (PHAIR) journal.
      </p>

      <h3>Teaching</h3>

      <h4>Courses</h4>
      <table>
        <tbody>
          {data.Teaching?.Courses?.map((d, i) => (
            <tr key={"teaching-courses-" + i}>
              <td className="whitespace-nowrap">{d.year}</td>
              <td>{d.content}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Seminars</h4>
      <table>
        <tbody>
          {data.Teaching?.Seminars?.map((d, i) => (
            <tr key={"teaching-seminars-" + i}>
              <td className="whitespace-nowrap">{d.year}</td>
              <td>{d.content}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Individual lectures</h4>
      <table>
        <tbody>
          {data.Teaching?.["Individual lectures"]?.map((d, i) => (
            <tr key={"teaching-lectures-" + i}>
              <td className="whitespace-nowrap">{d.year}</td>
              <td>{d.content}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Supervision</h4>
      <table>
        <tbody>
          {data.Teaching?.Supervision?.map((d, i) => (
            <tr key={"teaching-supervision-" + i}>
              <td className="whitespace-nowrap">{d.year}</td>
              <td>{d.content}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Coordination</h4>
      <table>
        <tbody>
          {data.Teaching?.Coordination?.map((d, i) => (
            <tr key={"teaching-coordination-" + i}>
              <td className="whitespace-nowrap">{d.year}</td>
              <td>{d.content}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Other</h4>
      <table>
        <tbody>
          {data.Teaching?.Other?.map((d, i) => (
            <tr key={"teaching-other-" + i}>
              <td className="whitespace-nowrap">{d.year}</td>
              <td>{d.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
