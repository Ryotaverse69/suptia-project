/**
 * Apple HIG Design System
 *
 * Based on Apple Human Interface Guidelines (HIG)
 * Reference: .claude/skills/apple-hig-design/
 *
 * This file provides a unified design system for the entire Suptia website.
 */

// ============================================================
// iOS System Colors
// ============================================================

export const systemColors = {
  // Primary Colors
  blue: "#007AFF",
  green: "#34C759",
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  pink: "#FF2D55",
  purple: "#AF52DE",
  indigo: "#5856D6",
  teal: "#5AC8FA",
  cyan: "#32ADE6",
  mint: "#00C7BE",
  brown: "#A2845E",

  // Grays (systemGray1-6)
  gray: {
    1: "#8E8E93",
    2: "#AEAEB2",
    3: "#C7C7CC",
    4: "#D1D1D6",
    5: "#E5E5EA",
    6: "#F2F2F7",
  },
} as const;

// ============================================================
// Apple Web Colors
// ============================================================

export const appleWebColors = {
  blue: "#0071e3",
  blueHover: "#0077ED",
  link: "#06c",
  pageBackground: "#fbfbfd",
  sectionBackground: "#f5f5f7",
  textPrimary: "#1d1d1f",
  textSecondary: "#515154", // コントラスト 8.5:1（元: #86868b = 4.5:1）
  textTertiary: "#86868b", // コントラスト 4.5:1（元: rgba(60,60,67,0.3) ≈ 2.5:1）
  separator: "rgba(60, 60, 67, 0.29)",
  borderSubtle: "rgba(0, 0, 0, 0.05)",
} as const;

// ============================================================
// Typography
// ============================================================

export const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif';
export const monoFontStack =
  '"SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace';

/**
 * Typography styles matching iOS Text Styles
 * Each style includes size, weight, line-height, and letter-spacing
 */
export const typography = {
  largeTitle: "text-[34px] font-bold leading-[41px] tracking-[0.37px]",
  title1: "text-[28px] font-bold leading-[34px] tracking-[0.36px]",
  title2: "text-[22px] font-bold leading-[28px] tracking-[0.35px]",
  title3: "text-[20px] font-semibold leading-[25px] tracking-[0.38px]",
  headline: "text-[17px] font-semibold leading-[22px] tracking-[-0.41px]",
  body: "text-[17px] font-normal leading-[22px] tracking-[-0.43px]",
  callout: "text-[16px] font-normal leading-[21px] tracking-[-0.32px]",
  subhead: "text-[15px] font-normal leading-[20px] tracking-[-0.24px]",
  footnote: "text-[13px] font-normal leading-[18px] tracking-[-0.08px]",
  caption1: "text-[12px] font-normal leading-[16px] tracking-[0px]",
  caption2: "text-[11px] font-normal leading-[13px] tracking-[0.07px]",
} as const;

/**
 * Raw typography values for style prop usage
 */
export const typographyValues = {
  largeTitle: {
    fontSize: "34px",
    fontWeight: 700,
    lineHeight: "41px",
    letterSpacing: "0.37px",
  },
  title1: {
    fontSize: "28px",
    fontWeight: 700,
    lineHeight: "34px",
    letterSpacing: "0.36px",
  },
  title2: {
    fontSize: "22px",
    fontWeight: 700,
    lineHeight: "28px",
    letterSpacing: "0.35px",
  },
  title3: {
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: "25px",
    letterSpacing: "0.38px",
  },
  headline: {
    fontSize: "17px",
    fontWeight: 600,
    lineHeight: "22px",
    letterSpacing: "-0.41px",
  },
  body: {
    fontSize: "17px",
    fontWeight: 400,
    lineHeight: "22px",
    letterSpacing: "-0.43px",
  },
  callout: {
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "21px",
    letterSpacing: "-0.32px",
  },
  subhead: {
    fontSize: "15px",
    fontWeight: 400,
    lineHeight: "20px",
    letterSpacing: "-0.24px",
  },
  footnote: {
    fontSize: "13px",
    fontWeight: 400,
    lineHeight: "18px",
    letterSpacing: "-0.08px",
  },
  caption1: {
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: "16px",
    letterSpacing: "0px",
  },
  caption2: {
    fontSize: "11px",
    fontWeight: 400,
    lineHeight: "13px",
    letterSpacing: "0.07px",
  },
} as const;

// ============================================================
// Spacing
// ============================================================

export const spacing = {
  /** Screen edge margin for iPhone */
  screenEdge: 16,
  /** Screen edge margin for iPhone Max / iPad */
  screenEdgeLarge: 20,
  /** Between major sections */
  sectionGap: 35,
  /** Between items within a group */
  groupGap: 16,
  /** Between list items */
  listItemGap: 11,
  /** Between closely related elements */
  tightGap: 8,
} as const;

// ============================================================
// Touch Targets
// ============================================================

export const touchTargets = {
  /** Minimum touch target size for iOS */
  minimum: 44,
  /** Recommended touch target size */
  recommended: 48,
  /** Minimum touch target size for visionOS */
  visionOS: 60,
} as const;

// ============================================================
// Spring Animations (Framer Motion)
// ============================================================

/**
 * Standard Apple-style spring animation
 * Use for most interactive elements
 */
export const appleSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

/**
 * Subtle spring for UI controls
 * Use for buttons, toggles, and small UI elements
 */
export const subtleSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
};

/**
 * Bouncy spring for playful interactions
 * Use for cards, modals, and larger elements
 */
export const bouncySpring = {
  type: "spring" as const,
  stiffness: 200,
  damping: 15,
};

/**
 * Gentle spring for subtle movements
 * Use for hover states and micro-interactions
 */
export const gentleSpring = {
  type: "spring" as const,
  stiffness: 150,
  damping: 20,
};

// ============================================================
// Easing Curves
// ============================================================

/** Standard Apple easing curve */
export const appleEase = [0.25, 0.1, 0.25, 1] as const;

/** Fade in easing */
export const fadeInEase = [0.0, 0.0, 0.2, 1] as const;

/** Fade out easing */
export const fadeOutEase = [0.4, 0.0, 1, 1] as const;

// ============================================================
// Animation Durations
// ============================================================

export const duration = {
  /** Fast micro-interactions (100-200ms) */
  fast: 0.15,
  /** Standard transitions (200-300ms) */
  normal: 0.25,
  /** Slower animations (300-500ms) */
  slow: 0.4,
  /** Page transitions (400-600ms) */
  page: 0.5,
  /** Scroll fade-in animations (unified) */
  scrollFadeIn: 0.5,
} as const;

// ============================================================
// Border Radius
// ============================================================

export const borderRadius = {
  /** Small elements (buttons, inputs) */
  small: 10,
  /** Medium elements (cards, modals) */
  medium: 16,
  /** Large elements (sheets, panels) */
  large: 20,
  /** Extra large (hero sections) */
  xlarge: 24,
  /** Full rounded (pills, avatars) */
  full: 9999,
} as const;

// ============================================================
// Shadows
// ============================================================

export const shadows = {
  /** Subtle shadow for cards */
  card: "0 2px 8px rgba(0, 0, 0, 0.04)",
  /** Medium shadow for elevated elements */
  elevated: "0 4px 16px rgba(0, 0, 0, 0.08)",
  /** Large shadow for modals and popovers */
  modal: "0 8px 32px rgba(0, 0, 0, 0.12)",
  /** Glass effect shadow */
  glass: "0 8px 32px rgba(0, 0, 0, 0.06)",
} as const;

// ============================================================
// Liquid Glass Styles (WWDC 2025)
// ============================================================

/**
 * Liquid Glass - Apple's new design language from WWDC 2025
 * Creates translucent, glass-like UI elements with real-time rendering
 */
export const liquidGlass = {
  /** Standard Liquid Glass */
  standard: {
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    borderRadius: "24px",
    boxShadow:
      "0 8px 32px rgba(31, 38, 135, 0.15), inset 0 2px 16px rgba(255, 255, 255, 0.2)",
  },
  /** Light variant - for bright backgrounds */
  light: {
    background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    borderRadius: "24px",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
  },
  /** Subtle variant - minimal effect */
  subtle: {
    background: "rgba(255, 255, 255, 0.4)",
    backdropFilter: "blur(16px) saturate(150%)",
    WebkitBackdropFilter: "blur(16px) saturate(150%)",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    borderRadius: "20px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
  },
  /** Tinted - with color accent */
  tinted: (color: string, opacity = 0.1) => ({
    background: `rgba(${hexToRgb(color)}, ${opacity})`,
    backdropFilter: "blur(20px) saturate(200%)",
    WebkitBackdropFilter: "blur(20px) saturate(200%)",
    border: `1px solid rgba(${hexToRgb(color)}, ${opacity * 2})`,
    borderRadius: "24px",
    boxShadow: `0 8px 32px rgba(${hexToRgb(color)}, ${opacity})`,
  }),
  /** Dark mode variant */
  dark: {
    background: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },
} as const;

/**
 * Liquid Glass Tailwind classes
 */
export const liquidGlassClasses = {
  /** Standard Liquid Glass */
  standard:
    "bg-white/15 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/50 rounded-[24px] shadow-[0_8px_32px_rgba(31,38,135,0.15),inset_0_2px_16px_rgba(255,255,255,0.2)]",
  /** Light variant */
  light:
    "bg-white/60 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/80 rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
  /** Subtle variant */
  subtle:
    "bg-white/40 backdrop-blur-[16px] backdrop-saturate-[150%] border border-white/60 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.04)]",
  /** With hover effect */
  withHover:
    "transition-all duration-300 hover:bg-white/25 hover:shadow-[0_12px_40px_rgba(31,38,135,0.2)] hover:-translate-y-1",
  /** Dark mode */
  dark: "bg-black/30 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/10 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
} as const;

// Legacy glassmorphism (deprecated - use liquidGlass instead)
export const glass = {
  /** @deprecated Use liquidGlass.light instead */
  background: "rgba(255, 255, 255, 0.8)",
  /** @deprecated Use liquidGlass.dark instead */
  backgroundDark: "rgba(0, 0, 0, 0.6)",
  /** Blur amount */
  blur: "blur(20px)",
  /** Saturation boost */
  saturate: "saturate(1.5)",
} as const;

// ============================================================
// Component Size Presets
// ============================================================

export const componentSizes = {
  /** Navigation bar height */
  navBar: 44,
  /** Large title navigation bar */
  navBarLarge: 96,
  /** Tab bar height (excluding safe area) */
  tabBar: 49,
  /** Standard list cell height */
  listCell: 44,
  /** List cell with subtitle */
  listCellSubtitle: 58,
  /** Large list cell */
  listCellLarge: 76,
  /** Toggle/Switch dimensions */
  toggle: { width: 51, height: 31 },
  /** Segmented control height */
  segmentedControl: 32,
  /** Action sheet action height */
  actionSheetAction: 57,
} as const;

// ============================================================
// Tier Colors (Suptia-specific)
// ============================================================

export const tierColors = {
  "S+": {
    bg: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    text: "#000000",
    border: "#FFD700",
  },
  S: {
    bg: systemColors.green,
    text: "#FFFFFF",
    border: systemColors.green,
  },
  A: {
    bg: systemColors.blue,
    text: "#FFFFFF",
    border: systemColors.blue,
  },
  B: {
    bg: systemColors.cyan,
    text: "#FFFFFF",
    border: systemColors.cyan,
  },
  C: {
    bg: systemColors.orange,
    text: "#FFFFFF",
    border: systemColors.orange,
  },
  D: {
    bg: systemColors.gray[1],
    text: "#FFFFFF",
    border: systemColors.gray[1],
  },
} as const;

// ============================================================
// Utility Functions
// ============================================================

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): string {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

/**
 * Get a color with opacity
 */
export function withOpacity(color: string, opacity: number): string {
  if (color.startsWith("#")) {
    return `rgba(${hexToRgb(color)}, ${opacity})`;
  }
  return color;
}

/**
 * Generate Liquid Glass card classes (WWDC 2025)
 * @param variant - 'standard' | 'light' | 'subtle'
 * @param hover - Include hover effects
 */
export function liquidGlassCardClasses(
  variant: "standard" | "light" | "subtle" = "light",
  hover = true,
): string {
  const baseClasses = liquidGlassClasses[variant];
  return `${baseClasses}${hover ? ` ${liquidGlassClasses.withHover}` : ""}`;
}

/**
 * Generate glass card styles (legacy - use liquidGlassCardClasses instead)
 * @deprecated Use liquidGlassCardClasses instead
 */
export function glassCardStyles(hover = true): string {
  return `
    bg-white/80
    backdrop-blur-xl backdrop-saturate-150
    border border-black/5
    rounded-[20px]
    shadow-[0_8px_32px_rgba(0,0,0,0.06)]
    ${hover ? "transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1" : ""}
  `
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Generate section padding classes
 */
export function sectionPadding(size: "sm" | "md" | "lg" = "md"): string {
  switch (size) {
    case "sm":
      return "py-16 md:py-20";
    case "md":
      return "py-20 md:py-28";
    case "lg":
      return "py-24 md:py-32";
    default:
      return "py-20 md:py-28";
  }
}

/**
 * Generate container classes
 */
export function containerClasses(
  maxWidth: "sm" | "md" | "lg" | "xl" | "full" = "lg",
): string {
  const widths = {
    sm: "max-w-3xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    full: "max-w-7xl",
  };
  return `container mx-auto px-4 sm:px-6 ${widths[maxWidth]}`;
}

// ============================================================
// CSS Custom Properties (for global.css)
// ============================================================

export const cssVariables = `
:root {
  /* iOS System Colors */
  --color-blue: #007AFF;
  --color-green: #34C759;
  --color-red: #FF3B30;
  --color-orange: #FF9500;
  --color-yellow: #FFCC00;
  --color-pink: #FF2D55;
  --color-purple: #AF52DE;
  --color-indigo: #5856D6;
  --color-teal: #5AC8FA;
  --color-cyan: #32ADE6;
  --color-mint: #00C7BE;
  --color-brown: #A2845E;

  /* Apple Web Colors */
  --color-apple-blue: #0071e3;
  --color-apple-blue-hover: #0077ED;

  /* Background */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F2F2F7;
  --color-bg-page: #fbfbfd;
  --color-bg-section: #f5f5f7;

  /* Text */
  --color-text-primary: #1d1d1f;
  --color-text-secondary: #86868b;
  --color-text-tertiary: rgba(60, 60, 67, 0.3);

  /* Separator */
  --color-separator: rgba(60, 60, 67, 0.29);
  --color-border-subtle: rgba(0, 0, 0, 0.05);

  /* Font Family */
  --font-sf-pro: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  --font-sf-mono: "SF Mono", SFMono-Regular, ui-monospace, Menlo, Monaco, monospace;
}
`;

// ============================================================
// Accessibility Helpers
// ============================================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get animation props respecting reduced motion preference
 */
export function getAnimationProps<T extends object>(
  props: T,
  reducedMotionProps?: Partial<T>,
): T {
  if (prefersReducedMotion()) {
    return { ...props, ...reducedMotionProps };
  }
  return props;
}
