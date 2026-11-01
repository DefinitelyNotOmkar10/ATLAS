export const theme = {
  colors: {
    background: "#FFF6CB",
    text: "#063559",
    accent: "#FFB100",
    secondary: "#295BA7",
    error: "#F85C50",
    surface: "#FFFFFF",

    accentHover: "#E69F00",
    secondaryHover: "#1E4A8A",
    textLight: "#0A4F7D",
    backgroundDark: "#F5E9A3",
  },
  gradients: {
    primary: "linear-gradient(135deg, #FFB100 0%, #FFC933 100%)",
    secondary: "linear-gradient(135deg, #295BA7 0%, #3A6CC2 100%)",
    hero: "linear-gradient(135deg, #FFB100 0%, #295BA7 100%)",
    surface: "linear-gradient(to bottom, #FFFFFF 0%, #FFF6CB 100%)",
  },
  spacing: {
    section: {
      mobile: "4rem",
      desktop: "6rem",
    },
  },
  typography: {
    fontFamily: {
      sans: "Inter, ui-sans-serif, system-ui, sans-serif",
      mono: "ui-monospace, monospace",
    },
  },
} as const;

export type Theme = typeof theme;

export const cssVariables = {
  '--color-background': theme.colors.background,
  '--color-text': theme.colors.text,
  '--color-accent': theme.colors.accent,
  '--color-secondary': theme.colors.secondary,
  '--color-error': theme.colors.error,
  '--color-surface': theme.colors.surface,
  '--color-accent-hover': theme.colors.accentHover,
  '--color-secondary-hover': theme.colors.secondaryHover,
  '--color-text-light': theme.colors.textLight,
  '--color-background-dark': theme.colors.backgroundDark,
} as const;


