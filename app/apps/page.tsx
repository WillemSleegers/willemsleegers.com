import { PageHeader } from "@/components/layout/page-header"
import { Apps } from "@/components/apps/apps-list"
import { LAYOUT_CLASSES } from "@/lib/constants"

export default function AppsPage() {
  return (
    <div className={LAYOUT_CLASSES.CONTAINER}>
      <PageHeader
        title="Apps"
        description="A collection of interactive apps I've built."
      />
      <div className="mt-(--fluid-md)">
        <Apps />
      </div>
    </div>
  )
}
