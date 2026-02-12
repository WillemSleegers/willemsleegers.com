import Image from "next/image"

import avatar from "@/assets/images/avatar.png"

export const Hero = () => {
  return (
    <>
      <Image
        className="rounded-full m-auto mb-(--fluid-sm)"
        src={avatar}
        alt="Avatar"
        width={150}
      />
      <h1 className="text-[length:var(--fluid-title)] font-black text-balance">
        <span className="text-primary">dr.</span> Willem Sleegers
      </h1>
      <div className="mx-auto text-muted-foreground text-base sm:text-lg text-balance">
        <div>Methodologist at Statistics Netherlands</div>
        <div>Affiliated Researcher at Tilburg University</div>
      </div>
    </>
  )
}
