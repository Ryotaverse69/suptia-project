"use client";

import { useEffect, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { ArrowRight, X, MessageCircle, Zap } from "lucide-react";
import Image from "next/image";
import { useCharacterAvatars } from "@/lib/concierge/useCharacterAvatars";
import type { CharacterId } from "@/lib/concierge/types";
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
  buttonText?: string;
}

// キャラクターID一覧
const CHARACTER_IDS: CharacterId[] = ["core", "mint", "repha", "haku"];

// localStorage keys for dismiss state
const DISMISS_COUNT_KEY = "suptia_sticky_cta_dismiss_count";
const DISMISS_UNTIL_KEY = "suptia_sticky_cta_dismiss_until";
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function StickyCTA({
  showAfterScroll = 0.3,
  href = "/concierge",
  text = "AIに相談する",
  subtext = "理由・注意点まで一緒に整理",
  buttonText = "相談してみる",
}: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [dismissCount, setDismissCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const { getAvatarUrl } = useCharacterAvatars();

  // Load dismiss state from localStorage on mount
  useEffect(() => {
    try {
      const dismissUntil = localStorage.getItem(DISMISS_UNTIL_KEY);
      const count = localStorage.getItem(DISMISS_COUNT_KEY);

      // Check if 24-hour cooldown is active
      if (dismissUntil) {
        const until = parseInt(dismissUntil, 10);
        if (Date.now() < until) {
          // Still in cooldown period
          setIsDismissed(true);
        } else {
          // Cooldown expired, reset
          localStorage.removeItem(DISMISS_UNTIL_KEY);
          localStorage.removeItem(DISMISS_COUNT_KEY);
        }
      }

      if (count && !isDismissed) {
        setDismissCount(parseInt(count, 10));
      }
    } catch {
      // localStorage not available
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    try {
      const newCount = dismissCount + 1;
      setDismissCount(newCount);
      localStorage.setItem(DISMISS_COUNT_KEY, newCount.toString());

      // After 2nd dismiss, set 24-hour cooldown
      if (newCount >= 2) {
        const until = Date.now() + DISMISS_DURATION_MS;
        localStorage.setItem(DISMISS_UNTIL_KEY, until.toString());
      }
    } catch {
      // localStorage not available
    }
  }, [dismissCount]);

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
                    {/* 4人のアバター画像 */}
                    <div className="hidden sm:flex items-center -space-x-2">
                      {CHARACTER_IDS.map((charId, index) => {
                        const avatarUrl = getAvatarUrl(charId);
                        return (
                          <motion.div
                            key={charId}
                            className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md"
                            style={{
                              zIndex: CHARACTER_IDS.length - index,
                              background: avatarUrl
                                ? undefined
                                : `linear-gradient(135deg, ${systemColors.blue} 0%, ${systemColors.indigo} 100%)`,
                            }}
                            animate={
                              isMobile ? {} : { scale: isHovered ? 1.05 : 1 }
                            }
                            transition={{
                              duration: 0.3,
                              ease: appleEase,
                              delay: index * 0.05,
                            }}
                          >
                            {avatarUrl ? (
                              <Image
                                src={avatarUrl}
                                alt=""
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <MessageCircle
                                  className="w-4 h-4 text-white"
                                  aria-hidden="true"
                                />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
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
                      <div
                        className={`glow-wrapper ${isButtonHovered ? "glow-active" : ""}`}
                        onMouseEnter={() => setIsButtonHovered(true)}
                        onMouseLeave={() => setIsButtonHovered(false)}
                      >
                        {/* グローレイヤー（実際のdiv要素） */}
                        <div className="glow-layer" />
                        {/* ボタン本体 */}
                        <div className="glow-button-inner-sm">
                          <span className="relative z-10 flex items-center gap-2 font-semibold text-[15px]">
                            <MessageCircle
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                            {buttonText}
                            <ArrowRight
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Dismiss Button - smaller after first dismiss */}
                    <motion.button
                      className={`rounded-full flex items-center justify-center ${
                        dismissCount > 0
                          ? "p-1.5 min-w-[32px] min-h-[32px] opacity-50"
                          : "p-2 min-w-[44px] min-h-[44px]"
                      }`}
                      style={{ backgroundColor: "transparent" }}
                      onClick={handleDismiss}
                      whileHover={
                        isMobile
                          ? {}
                          : {
                              backgroundColor: appleWebColors.sectionBackground,
                              opacity: 1,
                            }
                      }
                      whileTap={isMobile ? {} : { scale: 0.95 }}
                      transition={{ duration: 0.2, ease: appleEase }}
                      aria-label="閉じる"
                    >
                      <X
                        className={dismissCount > 0 ? "w-4 h-4" : "w-5 h-5"}
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
