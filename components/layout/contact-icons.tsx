import Link from "next/link"

import { BlueskyIcon } from "@/assets/images/bluesky"
import { LinkedInIcon } from "@/assets/images/linkedin"
import { MailIcon } from "lucide-react"

export const ContactIcons = () => {
  return (
    <div className="flex gap-3 mx-auto justify-center">
      <Link href="mailto:w.sleegers@me.com">
        <MailIcon className="hover:text-primary" />
      </Link>
      <Link
        href="https://www.linkedin.com/in/willem-sleegers-262a0350/"
        target="_blank"
      >
        <LinkedInIcon className="w-6 h-6 hover:text-primary" />
      </Link>
      <Link
        href="https://bsky.app/profile/willemsleegers.bsky.social"
        target="_blank"
      >
        <BlueskyIcon className="w-6 h-6 hover:text-primary" />
      </Link>
    </div>
  )
}
