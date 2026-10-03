interface StatusPillProps {
  children: string;
  tone?: "idle" | "success" | "warning";
}

const toneClassName: Record<NonNullable<StatusPillProps["tone"]>, string> = {
  idle: "border-border bg-background text-muted-foreground",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
};

export function StatusPill({ children, tone = "idle" }: StatusPillProps) {
  return (
    <span className={`inline-flex h-7 items-center rounded-md border px-2 text-xs font-medium ${toneClassName[tone]}`}>
      {children}
    </span>
  );
}
