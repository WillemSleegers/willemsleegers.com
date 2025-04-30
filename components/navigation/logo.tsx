import Link from "next/link"

export const Logo = () => {
  return (
    <Link className="font-bold" href="/">
      <span className="text-xl">
        WillemSleegers<span className="text-base text-primary">.com</span>
      </span>
    </Link>
  )
}
