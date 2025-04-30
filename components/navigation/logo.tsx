import Link from "next/link"

export const Logo = () => {
  return (
    <Link className="font-bold" href="/">
      <span className="text-xl">WillemSleegers</span>
      <span className="text-primary">.com</span>
    </Link>
  )
}
