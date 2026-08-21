import type { HTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export function Conversation({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={cn("flex h-full min-h-0 flex-col overflow-hidden", className)} {...props} />;
}

export function ConversationContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-1 flex-col gap-4 overflow-y-auto p-4", className)} {...props} />;
}
