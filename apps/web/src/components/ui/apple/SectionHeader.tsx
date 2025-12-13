"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  appleWebColors,
  fontStack,
  typography,
  appleEase,
} from "@/lib/design-system";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}

/**
 * Apple HIG Section Header Component
 *
 * Features optional eyebrow text, large title, and subtitle.
 * Supports light and dark variants with entrance animations.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
  className = "",
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <motion.div
      ref={ref}
      className={`mb-16 md:mb-20 ${align === "center" ? "text-center" : ""} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: appleEase }}
    >
      {eyebrow && (
        <motion.p
          className={`${typography.subhead} uppercase tracking-widest mb-4`}
          style={{
            color: dark
              ? "rgba(255,255,255,0.6)"
              : appleWebColors.textSecondary,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: appleEase }}
        >
          {eyebrow}
        </motion.p>
      )}
      <h2
        className="text-[32px] md:text-[48px] lg:text-[56px] font-bold leading-[1.05] tracking-[-0.015em] mb-4"
        style={{
          fontFamily: fontStack,
          color: dark ? "#FFFFFF" : appleWebColors.textPrimary,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`${typography.title3} max-w-3xl ${align === "center" ? "mx-auto" : ""}`}
          style={{
            color: dark
              ? "rgba(255,255,255,0.7)"
              : appleWebColors.textSecondary,
          }}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default SectionHeader;
