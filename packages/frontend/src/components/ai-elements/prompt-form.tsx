import type { ComponentProps, FormHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "../../lib/utils";
import { ShadcnButton } from "../ui/button";

export function PromptForm({ className, ...props }: FormHTMLAttributes<HTMLFormElement>) {
  return <form className={cn("flex items-end gap-2 rounded-lg border border-input bg-background p-2", className)} {...props} />;
}

export function PromptInput({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "max-h-48 min-h-10 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground",
        className,
      )}
      rows={1}
      {...props}
    />
  );
}

export function PromptSubmit({ children = "Send", ...props }: ComponentProps<typeof ShadcnButton>) {
  return (
    <ShadcnButton size="sm" type="submit" {...props}>
      {children}
    </ShadcnButton>
  );
}
