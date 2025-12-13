"use client";

import { useEffect, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { ArrowRight, X, Zap } from "lucide-react";
import {
  systemColors,
  appleWebColors,
  typography,
  fontStack,
  appleEase,
  subtleSpring,
  liquidGlass,
  liquidGlassClasses,
} from "@/lib/design-system";

// Apple式：モバイル検出
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
};

interface StickyCTAProps {
  showAfterScroll?: number;
  href?: string;
  text?: string;
  subtext?: string;
}

export function StickyCTA({
  showAfterScroll = 0.3,
  href = "/diagnosis",
  text = "あなたに最適なサプリを診断",
  subtext = "無料で今すぐ診断",
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value > showAfterScroll && !isDismissed) {
        setIsVisible(true);
      } else if (value < showAfterScroll * 0.5) {
        setIsVisible(false);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, showAfterScroll, isDismissed]);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    setIsVisible(false);
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 sm:pb-6 pointer-events-none"
          style={{ fontFamily: fontStack }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={subtleSpring}
        >
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <motion.div
              className="relative overflow-hidden rounded-[24px] border"
              style={{
                ...liquidGlass.light,
              }}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, ease: appleEase }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Content */}
              <div className="relative p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  {/* Left Content */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Icon */}
                    <motion.div
                      className="hidden sm:flex w-12 h-12 rounded-2xl items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
                      }}
                      animate={isMobile ? {} : { scale: isHovered ? 1.05 : 1 }}
                      transition={{ duration: 0.3, ease: appleEase }}
                    >
                      <Zap className="w-6 h-6 text-white" aria-hidden="true" />
                    </motion.div>
                    <div>
                      <p
                        className={`${typography.headline} leading-tight`}
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {text}
                      </p>
                      <p
                        className="text-[13px] mt-0.5"
                        style={{ color: appleWebColors.textSecondary }}
                      >
                        {subtext}
                      </p>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="flex items-center gap-2">
                    <Link href={href}>
                      <motion.button
                        className="relative px-5 sm:px-6 py-2.5 sm:py-3 rounded-full min-h-[44px] overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${systemColors.green} 0%, ${systemColors.teal} 100%)`,
                        }}
                        whileHover={isMobile ? {} : { scale: 1.03 }}
                        whileTap={isMobile ? {} : { scale: 0.97 }}
                        transition={subtleSpring}
                      >
                        <span className="relative z-10 flex items-center gap-2 font-semibold text-[15px] text-white">
                          診断する
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </span>
                      </motion.button>
                    </Link>

                    {/* Dismiss Button */}
                    <motion.button
                      className="p-2 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"
                      style={{ backgroundColor: "transparent" }}
                      onClick={handleDismiss}
                      whileHover={
                        isMobile
                          ? {}
                          : {
                              backgroundColor: appleWebColors.sectionBackground,
                            }
                      }
                      whileTap={isMobile ? {} : { scale: 0.95 }}
                      transition={{ duration: 0.2, ease: appleEase }}
                      aria-label="閉じる"
                    >
                      <X
                        className="w-5 h-5"
                        style={{ color: appleWebColors.textSecondary }}
                        aria-hidden="true"
                      />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Bottom Accent Line */}
              {!isMobile && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[3px]"
                  style={{
                    background: `linear-gradient(90deg, ${systemColors.blue}, ${systemColors.indigo}, ${systemColors.green})`,
                    transformOrigin: "left",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: appleEase }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FloatingCTA({
  href = "/diagnosis",
  text = "診断する",
}: {
  href?: string;
  text?: string;
}) {
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setIsVisible(value > 0.2 && value < 0.9);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 right-8 z-[100] will-change-transform"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={
            isMobile
              ? { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              : { type: "spring", damping: 20 }
          }
          style={{ transform: "translateZ(0)" }}
        >
          <Link href={href}>
            <motion.div
              className="group relative will-change-transform"
              whileHover={isMobile ? {} : { scale: 1.1 }}
              whileTap={isMobile ? {} : { scale: 0.95 }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ transform: "translateZ(0)" }}
            >
              {/* Glow Ring - モバイルでは静的 */}
              {isMobile || prefersReducedMotion ? (
                <div
                  className="absolute -inset-3 rounded-full opacity-30"
                  style={{
                    background:
                      "linear-gradient(135deg, #7a98ec 0%, #64e5b3 100%)",
                    filter: "blur(15px)",
                  }}
                />
              ) : (
                <motion.div
                  className="absolute -inset-3 rounded-full will-change-transform"
                  style={{
                    background:
                      "linear-gradient(135deg, #7a98ec 0%, #64e5b3 100%)",
                    filter: "blur(15px)",
                    transform: "translateZ(0)",
                  }}
                  animate={{
                    scale: isHovered ? [1, 1.3, 1.2] : [1, 1.2, 1],
                    opacity: isHovered ? [0.6, 0.8, 0.6] : [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Pulse Ring - モバイルでは無効 */}
              {!isMobile && !prefersReducedMotion && (
                <motion.div
                  className="absolute -inset-2 rounded-full border-2 border-primary/30 will-change-transform"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ transform: "translateZ(0)" }}
                />
              )}

              {/* Button - Apple式モバイル最適化 */}
              {isMobile || prefersReducedMotion ? (
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#7a98ec] to-primary flex items-center justify-center shadow-2xl">
                  <Zap className="w-7 h-7 text-white" />
                </div>
              ) : (
                <motion.div
                  className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#7a98ec] to-primary flex items-center justify-center shadow-2xl will-change-transform"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    boxShadow: isHovered
                      ? "0 20px 40px -10px rgba(59, 102, 224, 0.5)"
                      : "0 10px 30px -10px rgba(59, 102, 224, 0.3)",
                  }}
                  transition={{
                    rotate: { duration: 3, repeat: Infinity },
                    boxShadow: { duration: 0.3 },
                  }}
                  style={{ transform: "translateZ(0)" }}
                >
                  <motion.div
                    animate={{
                      rotate: isHovered ? 180 : 0,
                      scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Zap className="w-7 h-7 text-white" />
                  </motion.div>
                </motion.div>
              )}

              {/* Tooltip - デスクトップのみ */}
              {!isMobile && (
                <motion.div
                  className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-white text-slate-800 text-sm font-semibold whitespace-nowrap shadow-xl border border-slate-100 will-change-transform"
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? 0 : 10,
                    scale: isHovered ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transform: "translateZ(0)" }}
                >
                  <span className="flex items-center gap-2">
                    {text}
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </span>
                  {/* Tooltip Arrow */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 bg-white border-r border-b border-slate-100 rotate-[-45deg]" />
                </motion.div>
              )}
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
