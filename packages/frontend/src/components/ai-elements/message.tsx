import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/utils";

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  from: "user" | "assistant" | "system" | "tool" | string;
}

export function Message({ className, from, ...props }: MessageProps) {
  return (
    <article
      className={cn("flex w-full", from === "user" ? "justify-end" : "justify-start", className)}
      data-role={from}
      {...props}
    />
  );
}

export function MessageContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "max-w-[85%] rounded-lg border border-border bg-card px-4 py-3 text-card-foreground shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export interface MessageResponseProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function MessageResponse({ className, ...props }: MessageResponseProps) {
  return <div className={cn("prose prose-sm max-w-none text-foreground", className)} {...props} />;
}
