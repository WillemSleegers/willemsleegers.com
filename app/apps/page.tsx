import { Apps } from "@/components/apps/apps-list"

export default function AppsPage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10 space-y-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-black text-4xl lg:text-5xl">
            Apps
          </h1>
          <p className="text-muted-foreground text-lg py-4">
            A collection of interactive apps I've built. Feel free to explore
            them and get in touch if you have any questions.
          </p>
        </div>
      </div>
      <Apps />
    </div>
  )
}
