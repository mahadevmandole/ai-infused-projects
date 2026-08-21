import type { ClientTheme } from "./types";

export const baseTheme: ClientTheme = {
  id: "base",
  name: "Base Theme",
  colors: {
    background: "0 0% 100%",
    foreground: "222 47% 11%",
    card: "0 0% 100%",
    cardForeground: "222 47% 11%",
    popover: "0 0% 100%",
    popoverForeground: "222 47% 11%",
    primary: "190 55% 32%",
    primaryForeground: "0 0% 100%",
    secondary: "210 40% 96%",
    secondaryForeground: "222 47% 11%",
    muted: "210 40% 96%",
    mutedForeground: "215 16% 47%",
    accent: "160 36% 92%",
    accentForeground: "166 64% 22%",
    destructive: "0 84% 60%",
    destructiveForeground: "0 0% 100%",
    border: "214 32% 91%",
    input: "214 32% 91%",
    ring: "190 55% 32%",
  },
  fonts: {
    sans: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    mono: "\"SFMono-Regular\", Consolas, \"Liberation Mono\", monospace",
  },
  radius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
};
