import type { HTMLAttributes } from "react";

export function ResponsePanel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const classes = ["ai-response-panel", className].filter(Boolean).join(" ");

  return <div className={classes} {...props} />;
}
