"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  onClick,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [-50, 50], [10, -10]);
  const rotateY = useTransform(springX, [-50, 50], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const Component = href ? motion.a : motion.button;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className="relative inline-block"
      style={{ perspective: 1000 }}
    >
      <Component
        href={href}
        onClick={onClick}
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{
          x: springX,
          y: springY,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-primary via-[#00FFD1] to-[#FF2E97] opacity-0 blur-xl -z-10"
          animate={{
            opacity: isHovered ? 0.6 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] overflow-hidden -z-5"
          initial={false}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
            animate={{
              translateX: isHovered ? "200%" : "-100%",
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </motion.div>

        {children}
      </Component>
    </div>
  );
}

interface RippleButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function RippleButton({
  children,
  className = "",
  onClick,
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.();
  };

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {ripples.map(({ x, y, id }) => (
        <motion.span
          key={id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          initial={{
            width: 0,
            height: 0,
            x: x,
            y: y,
            opacity: 0.5,
          }}
          animate={{
            width: 500,
            height: 500,
            x: x - 250,
            y: y - 250,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
      {children}
    </motion.button>
  );
}
