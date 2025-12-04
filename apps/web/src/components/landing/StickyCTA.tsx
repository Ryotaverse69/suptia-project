"use client";

import { useEffect, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, X } from "lucide-react";

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
          className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 sm:pb-6 pointer-events-none will-change-transform"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          style={{ transform: "translateZ(0)" }}
        >
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <motion.div
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-900/5 will-change-transform"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ transform: "translateZ(0)" }}
            >
              {/* Liquid Glass Background - Apple式モバイル最適化 */}
              <div className="absolute inset-0 bg-white/30" />
              {isMobile || prefersReducedMotion ? (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-[#7a98ec]/10 to-primary/5" />
              ) : (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 via-[#7a98ec]/10 to-primary/5 bg-[length:200%_100%] will-change-transform"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ transform: "translateZ(0)" }}
                />
              )}

              {/* Gradient Border Effect - デスクトップのみホバー連動 */}
              <div
                className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(122,152,236,0.3) 0%, transparent 50%, rgba(100,229,179,0.3) 100%)",
                }}
              />

              {/* Hover Glow Effect - デスクトップのみ */}
              {!isMobile && (
                <motion.div
                  className="absolute -inset-1 rounded-2xl sm:rounded-3xl pointer-events-none will-change-transform"
                  style={{
                    background:
                      "linear-gradient(135deg, #7a98ec40 0%, transparent 50%, #64e5b340 100%)",
                    filter: "blur(20px)",
                    transform: "translateZ(0)",
                  }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />
              )}

              {/* Content */}
              <div className="relative p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  {/* Left Content */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Apple式：モバイルでは連続アニメーション無効 */}
                    {isMobile || prefersReducedMotion ? (
                      <div className="hidden sm:flex w-12 h-12 rounded-xl bg-gradient-to-br from-[#7a98ec] to-primary items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <motion.div
                        className="hidden sm:flex w-12 h-12 rounded-xl bg-gradient-to-br from-[#7a98ec] to-primary items-center justify-center shadow-lg shadow-primary/20 will-change-transform"
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: isHovered ? 1.1 : 1,
                        }}
                        transition={{
                          rotate: { duration: 2, repeat: Infinity, delay: 1 },
                          scale: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                        }}
                        style={{ transform: "translateZ(0)" }}
                      >
                        <Sparkles className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                    <div>
                      <p className="text-xs sm:text-base font-semibold text-slate-800 leading-tight">
                        {text}
                      </p>
                      <p className="text-[10px] sm:text-xs text-slate-500">
                        {subtext}
                      </p>
                    </div>
                  </div>

                  {/* Right Content */}
                  <div className="flex items-center gap-2">
                    <Link href={href}>
                      <motion.button
                        className="group relative px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl overflow-hidden will-change-transform"
                        whileHover={isMobile ? {} : { scale: 1.05 }}
                        whileTap={isMobile ? {} : { scale: 0.95 }}
                        style={{ transform: "translateZ(0)" }}
                      >
                        {/* Button Background - Apple式モバイル最適化 */}
                        {isMobile || prefersReducedMotion ? (
                          <div className="absolute inset-0 bg-gradient-to-r from-[#64e5b3] to-primary" />
                        ) : (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-[#64e5b3] via-primary to-[#64e5b3] bg-[length:200%_100%] will-change-transform"
                            animate={{
                              backgroundPosition: [
                                "0% 50%",
                                "100% 50%",
                                "0% 50%",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            style={{ transform: "translateZ(0)" }}
                          />
                        )}

                        {/* Button Glow - デスクトップのみ */}
                        {!isMobile && (
                          <motion.div
                            className="absolute inset-0 will-change-transform"
                            style={{
                              background:
                                "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
                              transform: "translateZ(0)",
                            }}
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}

                        <span className="relative z-10 flex items-center gap-1.5 sm:gap-2 font-semibold text-xs sm:text-sm text-white">
                          診断する
                          {/* Apple式：モバイルではアロー連続アニメーション無効 */}
                          {isMobile || prefersReducedMotion ? (
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <motion.span
                              animate={{ x: [0, 4, 0] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </motion.span>
                          )}
                        </span>
                      </motion.button>
                    </Link>

                    {/* Dismiss Button - Apple式モバイル最適化 */}
                    <motion.button
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 transition-colors will-change-transform"
                      onClick={handleDismiss}
                      whileHover={isMobile ? {} : { scale: 1.1, rotate: 90 }}
                      whileTap={isMobile ? {} : { scale: 0.9 }}
                      style={{ transform: "translateZ(0)" }}
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Shine Effect - モバイルでは無効 */}
              {!isMobile && !prefersReducedMotion && (
                <motion.div
                  className="absolute inset-0 pointer-events-none will-change-transform"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 45%, rgba(255,255,255,0.4) 50%, transparent 55%)",
                    transform: "translateZ(0)",
                  }}
                  initial={{ x: "-100%" }}
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Bottom Accent Line - デスクトップのみ */}
              {!isMobile && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7a98ec] via-primary to-[#64e5b3]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "left" }}
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
                  <Sparkles className="w-7 h-7 text-white" />
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
                    <Sparkles className="w-7 h-7 text-white" />
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
