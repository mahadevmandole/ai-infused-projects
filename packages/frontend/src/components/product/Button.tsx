import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ children, className, icon, type = "button", variant = "primary", ...props }: ButtonProps) {
  const classes = ["ui-button", `ui-button--${variant}`, className].filter(Boolean).join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {icon ? <span className="ui-button__icon">{icon}</span> : null}
      {children ? <span>{children}</span> : null}
    </button>
  );
}
