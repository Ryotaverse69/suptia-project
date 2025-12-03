"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";

interface ParallaxTextProps {
  children: React.ReactNode;
  className?: string;
  baseVelocity?: number;
  direction?: "left" | "right";
}

export function ParallaxText({
  children,
  className = "",
  baseVelocity = 50,
  direction = "left",
}: ParallaxTextProps) {
  const baseX = direction === "left" ? 0 : -100;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? [0, -baseVelocity * 2] : [-baseVelocity * 2, 0],
  );
  const springX = useSpring(x, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="inline-flex gap-8" style={{ x: springX }}>
        {[...Array(4)].map((_, i) => (
          <span key={i} className="inline-block">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function SplitText({
  text,
  className = "",
  delay = 0,
  staggerDelay = 0.03,
}: SplitTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const letters = text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ perspective: 1000 }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
          style={{ transformStyle: "preserve-3d" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function RevealText({
  children,
  className = "",
  delay = 0,
}: RevealTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.33, 1, 0.68, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ScaleTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ScaleText({ children, className = "" }: ScaleTextProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.div ref={ref} className={className} style={{ scale, opacity }}>
      {children}
    </motion.div>
  );
}

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute inset-0 text-[#00FFD1] z-0"
        animate={{
          x: [-2, 2, -2],
          opacity: [0.8, 0.4, 0.8],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        aria-hidden
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-[#FF2E97] z-0"
        animate={{
          x: [2, -2, 2],
          opacity: [0.8, 0.4, 0.8],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.1,
        }}
        aria-hidden
      >
        {text}
      </motion.span>
    </div>
  );
}
