interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ description, eyebrow, title }: SectionHeadingProps) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase text-accent-foreground">{eyebrow}</p>
      <h1 className="text-3xl font-bold tracking-normal">{title}</h1>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
