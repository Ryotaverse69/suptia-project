"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode, forwardRef } from "react";
import {
  appleWebColors,
  subtleSpring,
  typography,
  touchTargets,
} from "@/lib/design-system";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";
type ButtonSize = "small" | "medium" | "large";

interface AppleButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  "aria-label"?: string;
}

const sizeStyles: Record<ButtonSize, { height: number; padding: string }> = {
  small: { height: 34, padding: "px-3" },
  medium: { height: touchTargets.minimum, padding: "px-4" },
  large: { height: 56, padding: "px-8" },
};

const variantStyles: Record<
  ButtonVariant,
  { bg: string; text: string; hoverBg: string }
> = {
  primary: {
    bg: appleWebColors.blue,
    text: "#FFFFFF",
    hoverBg: appleWebColors.blueHover,
  },
  secondary: {
    bg: appleWebColors.textPrimary,
    text: "#FFFFFF",
    hoverBg: "#333336",
  },
  tertiary: {
    bg: "transparent",
    text: appleWebColors.blue,
    hoverBg: `${appleWebColors.blue}15`,
  },
  destructive: {
    bg: "transparent",
    text: "#FF3B30",
    hoverBg: "rgba(255, 59, 48, 0.1)",
  },
};

/**
 * Apple HIG Button Component
 *
 * Supports primary, secondary, tertiary, and destructive variants.
 * All sizes meet the 44pt minimum touch target requirement.
 */
export const AppleButton = forwardRef<HTMLButtonElement, AppleButtonProps>(
  function AppleButton(
    {
      children,
      href,
      variant = "primary",
      size = "large",
      icon,
      iconPosition = "right",
      disabled = false,
      fullWidth = false,
      onClick,
      type = "button",
      className = "",
      "aria-label": ariaLabel,
    },
    ref,
  ) {
    const { height, padding } = sizeStyles[size];
    const { bg, text, hoverBg } = variantStyles[variant];

    const buttonContent = (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`
          inline-flex items-center justify-center gap-2
          ${padding}
          ${typography.headline}
          rounded-full
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        style={{
          minHeight: height,
          minWidth: touchTargets.minimum,
          backgroundColor: bg,
          color: text,
        }}
        whileHover={disabled ? {} : { scale: 1.02, backgroundColor: hoverBg }}
        whileTap={disabled ? {} : { scale: 0.97 }}
        transition={subtleSpring}
      >
        {icon && iconPosition === "left" && (
          <span aria-hidden="true">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span aria-hidden="true">{icon}</span>
        )}
      </motion.button>
    );

    if (href && !disabled) {
      return <Link href={href}>{buttonContent}</Link>;
    }

    return buttonContent;
  },
);

export default AppleButton;
