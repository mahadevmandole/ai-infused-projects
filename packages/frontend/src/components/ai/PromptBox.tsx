import type { TextareaHTMLAttributes } from "react";

export interface PromptBoxProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function PromptBox({ className, id, label, ...props }: PromptBoxProps) {
  const fieldId = id ?? "prompt";
  const classes = ["ai-prompt-box", className].filter(Boolean).join(" ");

  return (
    <label className="ai-prompt-field" htmlFor={fieldId}>
      <span>{label}</span>
      <textarea className={classes} id={fieldId} {...props} />
    </label>
  );
}
