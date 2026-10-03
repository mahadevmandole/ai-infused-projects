import { baseTheme } from "./base";
import type { ClientTheme } from "./types";

export const clientATheme: ClientTheme = {
  ...baseTheme,
  id: "client-a",
  name: "AI Elements",
  logo: {
    src: "/themes/client-a/logo.svg",
    alt: "Client A",
  },
  colors: {
    ...baseTheme.colors,
    foreground: "0 0% 9%",
    cardForeground: "0 0% 9%",
    popoverForeground: "0 0% 9%",
    primary: "222 100% 56%",
    secondary: "0 0% 96%",
    secondaryForeground: "0 0% 13%",
    muted: "0 0% 96%",
    mutedForeground: "0 0% 44%",
    accent: "0 0% 96%",
    accentForeground: "0 0% 13%",
    border: "0 0% 90%",
    input: "0 0% 90%",
    ring: "0 0% 71%",
  },
  radius: {
    sm: "6px",
    md: "8px",
    lg: "10px",
    xl: "14px",
  },
};

export const clientBTheme: ClientTheme = {
  ...baseTheme,
  id: "client-b",
  name: "Client B",
  logo: {
    src: "/themes/client-b/logo.svg",
    alt: "Client B",
  },
  colors: {
    ...baseTheme.colors,
    primary: "264 44% 39%",
    accent: "35 88% 92%",
    accentForeground: "24 75% 26%",
    ring: "264 44% 39%",
  },
  fonts: {
    ...baseTheme.fonts,
    sans: "\"IBM Plex Sans\", Inter, ui-sans-serif, system-ui, sans-serif",
  },
  radius: {
    sm: "2px",
    md: "4px",
    lg: "6px",
    xl: "10px",
  },
};

export const clientThemes = {
  [clientATheme.id]: clientATheme,
  [clientBTheme.id]: clientBTheme,
} as const;

export type ClientThemeId = keyof typeof clientThemes;
