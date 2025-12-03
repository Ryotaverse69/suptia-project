"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface GradientOrbProps {
  className?: string;
  colors?: string[];
  size?: number;
  blur?: number;
  intensity?: number;
}

export function GradientOrb({
  className = "",
  colors = ["#3b66e0", "#5a7fe6", "#7a98ec", "#64e5b3"],
  size = 600,
  blur = 100,
  intensity = 0.6,
}: GradientOrbProps) {
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX - size / 2);
      mouseY.set(clientY - size / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, size]);

  const rotate = useTransform(x, [-500, 500], [0, 360]);

  if (!mounted) return null;

  return (
    <motion.div
      className={`pointer-events-none fixed z-0 ${className}`}
      style={{
        x,
        y,
        width: size,
        height: size,
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from ${rotate}deg, ${colors.join(", ")})`,
          filter: `blur(${blur}px)`,
          opacity: intensity,
        }}
      />
      <motion.div
        className="absolute inset-[20%] rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors[0]}80 0%, transparent 70%)`,
          filter: `blur(${blur / 2}px)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary orb - follows mouse */}
      <GradientOrb
        colors={["#3b66e0", "#7a98ec", "#64e5b3"]}
        size={800}
        blur={150}
        intensity={0.3}
      />

      {/* Static floating orbs */}
      <motion.div
        className="absolute top-[10%] right-[20%] w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(100, 229, 179, 0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(122, 152, 236, 0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          y: [0, 40, 0],
          x: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute top-[50%] left-[50%] w-[500px] h-[500px] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(circle, rgba(86, 71, 166, 0.25) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
