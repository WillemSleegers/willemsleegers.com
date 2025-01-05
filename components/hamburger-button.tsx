import { Button } from "@/components/ui/button"

export const HamburgerButton = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <Button
      className="flex md:hidden"
      variant="ghost"
      size="sm"
      onClick={() => setOpen(!open)}
    >
      <div className="flex flex-col items-center justify-center">
        <span
          className={`block h-0.5 w-5 rounded-sm bg-foreground transition-all duration-300 ease-out ${
            open ? "translate-y-1 rotate-45" : "-translate-y-0.5"
          }`}
        ></span>
        <span
          className={`my-0.5 block h-0.5 w-5 rounded-sm bg-foreground transition-all duration-300 ease-out ${
            open ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`block h-0.5 w-5 rounded-sm bg-foreground transition-all duration-300 ease-out ${
            open ? "-translate-y-1 -rotate-45" : "translate-y-0.5"
          }`}
        ></span>
        <span className="sr-only">Toggle</span>
      </div>
    </Button>
  )
}
