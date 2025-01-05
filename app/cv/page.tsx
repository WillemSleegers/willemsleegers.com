import { Metadata } from "next"

import data from "@/assets/data/cv.csv"
import { ContactIcons } from "@/components/contact-icons"

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
        I’m a Senior Behavioral Scientist at Rethink Priorities. As part of the
        survey and data analysis team, I conduct research on attitude
        assessments and attitude change, using surveys and experimental designs.
        Before joining Rethink Priorities, I was an assistant professor in the
        Department of Social Psychology at Tilburg University, where I maintain
        an academic affiliation.
      </p>

      <h3>Employment</h3>
      <table>
        <tbody>
          {data
            .filter((d) => d.section == "Employment")
            .filter((d) => d.include)
            .map((d, i) => (
              <tr key={d.section.toLowerCase() + "-" + i}>
                <td className="whitespace-nowrap">{d.year}</td>
                <td>{d.content}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h3>Education</h3>
      <table>
        <tbody>
          {data
            .filter((d) => d.section == "Education")
            .filter((d) => d.include)
            .map((d, i) => (
              <tr key={d.section.toLowerCase() + "-" + i}>
                <td className="whitespace-nowrap">{d.year}</td>
                <td>{d.content}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h3>Skills</h3>

      <h4>Research</h4>
      <ul>
        {data
          .filter((d) => d.section == "Skills")
          .filter((d) => d.subsection == "Research")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>

      <h4>Statistics</h4>
      <ul>
        {data
          .filter((d) => d.section == "Skills")
          .filter((d) => d.subsection == "Statistics")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>

      <h4>Software</h4>
      <ul>
        {data
          .filter((d) => d.section == "Skills")
          .filter((d) => d.subsection == "Software")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>

      <h4>Programming</h4>
      <ul>
        {data
          .filter((d) => d.section == "Skills")
          .filter((d) => d.subsection == "Programming")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>

      <h4>Survey platforms</h4>
      <ul>
        {data
          .filter((d) => d.section == "Skills")
          .filter((d) => d.subsection == "Survey platforms")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>

      <h3>Publications</h3>
      <h4>Preprints</h4>
      <ul>
        {data
          .filter((d) => d.section == "Publications")
          .filter((d) => d.subsection == "Preprints")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>
      <h4>Peer-reviewed journals</h4>
      <ul>
        {data
          .filter((d) => d.section == "Publications")
          .filter((d) => d.subsection == "Peer-reviewed journals")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>

      <h4>Book chapters</h4>
      <ul>
        {data
          .filter((d) => d.section == "Publications")
          .filter((d) => d.subsection == "Book chapters")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>

      <h4>Book chapters</h4>
      <ul>
        {data
          .filter((d) => d.section == "Publications")
          .filter((d) => d.subsection == "Book chapters")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>

      <h4>Dissertation</h4>
      <ul>
        {data
          .filter((d) => d.section == "Publications")
          .filter((d) => d.subsection == "Dissertation")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>

      <h4>Software</h4>
      <ul>
        {data
          .filter((d) => d.section == "Publications")
          .filter((d) => d.subsection == "Software")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>

      <h3>Presentations</h3>
      <h4>Invited talks</h4>
      <ul>
        {data
          .filter((d) => d.section == "Presentations")
          .filter((d) => d.subsection == "Invited talks")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>
      <h4>Conference presentations</h4>
      <ul>
        {data
          .filter((d) => d.section == "Presentations")
          .filter((d) => d.subsection == "Conference presentations")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>
      <h4>Small meetings</h4>
      <ul>
        {data
          .filter((d) => d.section == "Presentations")
          .filter((d) => d.subsection == "Small meetings")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>
      <h4>Poster presentations</h4>
      <ul>
        {data
          .filter((d) => d.section == "Presentations")
          .filter((d) => d.subsection == "Poster presentations")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>
      <h4>Valorization presentations</h4>
      <ul>
        {data
          .filter((d) => d.section == "Presentations")
          .filter((d) => d.subsection == "Valorization presentations")
          .filter((d) => d.include)
          .map((d, i) => (
            <li key={d.section.toLowerCase() + "-" + i}>{d.content}</li>
          ))}
      </ul>

      <h3>Journals</h3>
      <p>
        I have reviewed for{" "}
        {data
          .filter((d) => d.section == "Journals")
          .map((d, i, j) =>
            i == j.length - 1 ? "and " + d.content + "." : d.content + ", "
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
          {data
            .filter((d) => d.section == "Teaching")
            .filter((d) => d.subsection == "Courses")
            .filter((d) => d.include)
            .map((d, i) => (
              <tr key={d.section.toLowerCase() + "-" + i}>
                <td className="whitespace-nowrap">{d.year}</td>
                <td>{d.content}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h4>Seminars</h4>
      <table>
        <tbody>
          {data
            .filter((d) => d.section == "Teaching")
            .filter((d) => d.subsection == "Seminars")
            .filter((d) => d.include)
            .map((d, i) => (
              <tr key={d.section.toLowerCase() + "-" + i}>
                <td className="whitespace-nowrap">{d.year}</td>
                <td>{d.content}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h4>Individual lectures</h4>
      <table>
        <tbody>
          {data
            .filter((d) => d.section == "Teaching")
            .filter((d) => d.subsection == "Individual lectures")
            .filter((d) => d.include)
            .map((d, i) => (
              <tr key={d.section.toLowerCase() + "-" + i}>
                <td className="whitespace-nowrap">{d.year}</td>
                <td>{d.content}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h4>Supervision</h4>
      <table>
        <tbody>
          {data
            .filter((d) => d.section == "Teaching")
            .filter((d) => d.subsection == "Supervision")
            .filter((d) => d.include)
            .map((d, i) => (
              <tr key={d.section.toLowerCase() + "-" + i}>
                <td className="whitespace-nowrap">{d.year}</td>
                <td>{d.content}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h4>Coordination</h4>
      <table>
        <tbody>
          {data
            .filter((d) => d.section == "Teaching")
            .filter((d) => d.subsection == "Coordination")
            .filter((d) => d.include)
            .map((d, i) => (
              <tr key={d.section.toLowerCase() + "-" + i}>
                <td className="whitespace-nowrap">{d.year}</td>
                <td>{d.content}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <h4>Other</h4>
      <table>
        <tbody>
          {data
            .filter((d) => d.section == "Teaching")
            .filter((d) => d.subsection == "Other")
            .filter((d) => d.include)
            .map((d, i) => (
              <tr key={d.section.toLowerCase() + "-" + i}>
                <td className="whitespace-nowrap">{d.year}</td>
                <td>{d.content}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
