import type { ClientTheme } from "./types";

export function themeToCssVariables(theme: ClientTheme): Record<string, string> {
  return {
    "--background": theme.colors.background,
    "--foreground": theme.colors.foreground,
    "--card": theme.colors.card,
    "--card-foreground": theme.colors.cardForeground,
    "--popover": theme.colors.popover,
    "--popover-foreground": theme.colors.popoverForeground,
    "--primary": theme.colors.primary,
    "--primary-foreground": theme.colors.primaryForeground,
    "--secondary": theme.colors.secondary,
    "--secondary-foreground": theme.colors.secondaryForeground,
    "--muted": theme.colors.muted,
    "--muted-foreground": theme.colors.mutedForeground,
    "--accent": theme.colors.accent,
    "--accent-foreground": theme.colors.accentForeground,
    "--destructive": theme.colors.destructive,
    "--destructive-foreground": theme.colors.destructiveForeground,
    "--border": theme.colors.border,
    "--input": theme.colors.input,
    "--ring": theme.colors.ring,
    "--font-sans": theme.fonts.sans,
    "--font-mono": theme.fonts.mono,
    "--radius-sm": theme.radius.sm,
    "--radius-md": theme.radius.md,
    "--radius-lg": theme.radius.lg,
    "--radius-xl": theme.radius.xl,
    "--spacing-xs": theme.spacing.xs,
    "--spacing-sm": theme.spacing.sm,
    "--spacing-md": theme.spacing.md,
    "--spacing-lg": theme.spacing.lg,
    "--spacing-xl": theme.spacing.xl,
  };
}

export function cssVariablesText(theme: ClientTheme): string {
  return Object.entries(themeToCssVariables(theme))
    .map(([name, value]) => `${name}: ${value};`)
    .join("\n");
}

export function applyTheme(theme: ClientTheme, target: HTMLElement = document.documentElement) {
  const variables = themeToCssVariables(theme);

  Object.entries(variables).forEach(([name, value]) => {
    target.style.setProperty(name, value);
  });

  target.dataset.theme = theme.id;
}
