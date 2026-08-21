import { baseTheme } from "./base";
import type { ClientTheme } from "./types";

export const clientATheme: ClientTheme = {
  ...baseTheme,
  id: "client-a",
  name: "Client A",
  logo: {
    src: "/themes/client-a/logo.svg",
    alt: "Client A",
  },
  colors: {
    ...baseTheme.colors,
    primary: "190 55% 32%",
    accent: "160 36% 92%",
    accentForeground: "166 64% 22%",
    ring: "190 55% 32%",
  },
  radius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
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
