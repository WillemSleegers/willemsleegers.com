interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={`flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8 ${className || ""}`}>
      <div className="flex-1 space-y-4">
        <h1 className="inline-block font-black text-4xl lg:text-5xl">{title}</h1>
        {description && (
          <p className="text-xl text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}
