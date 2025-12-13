"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { forwardRef, ReactNode } from "react";
import { bouncySpring, liquidGlassClasses } from "@/lib/design-system";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "standard" | "light" | "subtle";
  className?: string;
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Apple HIG Liquid Glass Card Component (WWDC 2025)
 *
 * A Liquid Glass card with backdrop blur and translucent border.
 * Features optional hover animation with scale and shadow.
 *
 * @param variant - 'standard' (translucent), 'light' (bright bg), 'subtle' (minimal)
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard(
    {
      children,
      hover = true,
      padding = "none",
      variant = "light",
      className = "",
      ...props
    },
    ref,
  ) {
    const variantClasses = liquidGlassClasses[variant];

    const hoverAnimation = hover
      ? {
          whileHover: { scale: 1.02, y: -4 },
          transition: bouncySpring,
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={`${variantClasses} ${paddingMap[padding]} ${className}`}
        {...hoverAnimation}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

export default GlassCard;
