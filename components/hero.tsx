import Image from "next/image"

import avatar from "@/assets/images/avatar.png"

export const Hero = () => {
  return (
    <>
      <Image
        className="rounded-full m-auto"
        src={avatar}
        alt="Avatar"
        width={150}
      />
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-balance">
        <span className="text-primary">dr.</span> Willem Sleegers
      </h1>
      <div className="mx-auto text-muted-foreground text-base sm:text-lg md:text-xl text-balance">
        <span>Senior Behavioral Scientist at Rethink Priorities</span>
        <br />
        <span>Research Affiliate at Tilburg University</span>
      </div>
    </>
  )
}
