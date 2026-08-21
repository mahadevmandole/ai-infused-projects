const hslVar = (name: string) => `hsl(var(${name}) / <alpha-value>)`;

const preset = {
  theme: {
    extend: {
      colors: {
        border: hslVar("--border"),
        input: hslVar("--input"),
        ring: hslVar("--ring"),
        background: hslVar("--background"),
        foreground: hslVar("--foreground"),
        primary: {
          DEFAULT: hslVar("--primary"),
          foreground: hslVar("--primary-foreground"),
        },
        secondary: {
          DEFAULT: hslVar("--secondary"),
          foreground: hslVar("--secondary-foreground"),
        },
        muted: {
          DEFAULT: hslVar("--muted"),
          foreground: hslVar("--muted-foreground"),
        },
        accent: {
          DEFAULT: hslVar("--accent"),
          foreground: hslVar("--accent-foreground"),
        },
        destructive: {
          DEFAULT: hslVar("--destructive"),
          foreground: hslVar("--destructive-foreground"),
        },
        card: {
          DEFAULT: hslVar("--card"),
          foreground: hslVar("--card-foreground"),
        },
        popover: {
          DEFAULT: hslVar("--popover"),
          foreground: hslVar("--popover-foreground"),
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
      spacing: {
        tokenXs: "var(--spacing-xs)",
        tokenSm: "var(--spacing-sm)",
        tokenMd: "var(--spacing-md)",
        tokenLg: "var(--spacing-lg)",
        tokenXl: "var(--spacing-xl)",
      },
    },
  },
};

export default preset;
