/**
 * AIコンシェルジュ キャラクター選択コンポーネント
 *
 * v2.2.0 - Apple HIG準拠デザイン
 *
 * 設計原則:
 * - 重み付けを見せる（キャラクターの特徴可視化）
 * - DBに保存されたアバター画像を全ユーザー共通で使用
 */

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronDown, Lock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  systemColors,
  appleWebColors,
  liquidGlassClasses,
} from "@/lib/design-system";
import type { CharacterId } from "@/lib/concierge/types";
import {
  CHARACTERS,
  getAvailableCharacters,
  calculateWeightPercentages,
} from "@/lib/concierge/characters";
import { useCharacterAvatars } from "@/lib/concierge/useCharacterAvatars";

// キャラクター別のグラデーションカラー
const CHARACTER_GRADIENTS: Record<CharacterId, [string, string]> = {
  core: [systemColors.green, systemColors.teal],
  mint: [systemColors.cyan, systemColors.blue],
  repha: [systemColors.purple, systemColors.indigo],
  haku: [systemColors.orange, systemColors.yellow],
};

interface CharacterSelectorProps {
  selectedCharacterId: CharacterId;
  onSelect: (characterId: CharacterId) => void;
  userPlan: string;
  disabled?: boolean;
  compact?: boolean; // ヘッダー用コンパクト表示
  buttonLabel?: string; // カスタムボタンラベル（設定時はアバター/名前の代わりにテキストボタン表示）
}

export function CharacterSelector({
  selectedCharacterId,
  onSelect,
  userPlan,
  disabled = false,
  compact = false,
  buttonLabel,
}: CharacterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewCharacter, setPreviewCharacter] = useState<CharacterId | null>(
    null,
  );
  const [mounted, setMounted] = useState(false);
  const selectedCharacter = CHARACTERS[selectedCharacterId];
  const availableCharacters = getAvailableCharacters(userPlan);
  const allCharacters = Object.values(CHARACTERS);
  const gradient = CHARACTER_GRADIENTS[selectedCharacterId];
  const { getAvatarUrl } = useCharacterAvatars();
  const selectedAvatarUrl = getAvatarUrl(selectedCharacterId);
  const previewAvatarUrl = previewCharacter
    ? getAvatarUrl(previewCharacter)
    : null;
  const previewCharacterData = previewCharacter
    ? CHARACTERS[previewCharacter]
    : null;

  // SSR対応: クライアントサイドでのみPortalを使用
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative">
      {/* 選択ボタン */}
      {buttonLabel ? (
        /* カスタムラベルボタン（シンプルなテキストボタン） */
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
            "bg-black/5 hover:bg-black/10 active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isOpen && "bg-black/10",
          )}
        >
          <span
            className="text-[14px] font-medium"
            style={{ color: appleWebColors.textPrimary }}
          >
            {buttonLabel}
          </span>
          <ChevronDown
            size={14}
            className={cn("transition-transform", isOpen && "rotate-180")}
            style={{ color: appleWebColors.textTertiary }}
          />
        </button>
      ) : (
        /* デフォルトボタン（アバター + 名前） */
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex items-center transition-all duration-200",
            "hover:bg-black/5 active:scale-[0.98]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            compact
              ? "gap-1.5 px-2 py-1 rounded-full"
              : "gap-3 px-3 py-2 rounded-2xl",
            isOpen && "bg-black/5",
          )}
        >
          {/* アバター - compactでは小さく */}
          <div
            className={cn(
              "rounded-lg flex items-center justify-center overflow-hidden",
              compact ? "w-6 h-6" : "w-9 h-9 rounded-xl",
            )}
            style={{
              background: selectedAvatarUrl
                ? undefined
                : `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
            }}
          >
            {selectedAvatarUrl ? (
              <Image
                src={selectedAvatarUrl}
                alt={selectedCharacter.name}
                width={compact ? 24 : 36}
                height={compact ? 24 : 36}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className={cn(
                  "text-white font-semibold",
                  compact ? "text-[10px]" : "text-[13px]",
                )}
              >
                {selectedCharacter.name.charAt(0)}
              </span>
            )}
          </div>

          {/* 名前 - compactでは1行のみ */}
          {compact ? (
            <span
              className="text-[13px] font-medium"
              style={{ color: appleWebColors.textPrimary }}
            >
              {selectedCharacter.name}
            </span>
          ) : (
            <div className="text-left">
              <div
                className="text-[14px] font-medium"
                style={{ color: appleWebColors.textPrimary }}
              >
                {selectedCharacter.name}
              </div>
              <div
                className="text-[12px]"
                style={{ color: appleWebColors.textSecondary }}
              >
                {selectedCharacter.recommendationStyleLabel.slice(0, 15)}...
              </div>
            </div>
          )}

          <ChevronDown
            size={compact ? 14 : 16}
            className={cn("transition-transform", isOpen && "rotate-180")}
            style={{ color: appleWebColors.textTertiary }}
          />
        </button>
      )}

      {/* キャラクター選択モーダル - Portalで直接bodyにレンダリング */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="relative animate-in zoom-in-95 duration-200 w-[90vw] max-w-[600px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 閉じるボタン */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center z-10 hover:bg-gray-100 transition-colors"
              >
                <X size={20} style={{ color: appleWebColors.textSecondary }} />
              </button>

              {/* タイトル */}
              <h2 className="text-xl font-bold text-white text-center mb-6">
                キャラクターを選択
              </h2>

              {/* キャラクターグリッド */}
              <div className="grid grid-cols-2 gap-4">
                {allCharacters.map((character) => {
                  const isAvailable = availableCharacters.some(
                    (c) => c.id === character.id,
                  );
                  const isSelected = character.id === selectedCharacterId;
                  const charGradient = CHARACTER_GRADIENTS[character.id];
                  const avatarUrl = getAvatarUrl(character.id);

                  return (
                    <button
                      key={character.id}
                      onClick={() => {
                        if (isAvailable) {
                          onSelect(character.id);
                          setIsOpen(false);
                        }
                      }}
                      disabled={!isAvailable}
                      className={cn(
                        "relative flex flex-col items-center p-4 rounded-3xl transition-all duration-200",
                        isAvailable
                          ? "hover:scale-105 active:scale-100 cursor-pointer"
                          : "opacity-50 cursor-not-allowed",
                        isSelected
                          ? "bg-white/20 ring-2 ring-white"
                          : "bg-white/10 hover:bg-white/15",
                      )}
                    >
                      {/* 選択中バッジ */}
                      {isSelected && (
                        <div
                          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: systemColors.blue }}
                        >
                          <Check size={14} className="text-white" />
                        </div>
                      )}

                      {/* Pro限定バッジ */}
                      {!isAvailable && (
                        <div
                          className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-medium"
                          style={{
                            backgroundColor: systemColors.purple,
                            color: "white",
                          }}
                        >
                          Pro限定
                        </div>
                      )}

                      {/* アバター画像 */}
                      <div
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-xl mb-3"
                        style={{
                          background: avatarUrl
                            ? undefined
                            : `linear-gradient(135deg, ${charGradient[0]} 0%, ${charGradient[1]} 100%)`,
                        }}
                      >
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={character.name}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white text-3xl font-bold">
                              {character.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* キャラクター名 */}
                      <h3 className="text-lg font-bold text-white mb-0.5">
                        {character.name}
                      </h3>
                      <p className="text-[12px] text-white/50 mb-1">
                        {character.nameEn}
                      </p>

                      {/* こんな人向け（メイン説明） */}
                      <p className="text-[13px] text-white/90 text-center font-medium mb-1">
                        {character.targetAudience}
                      </p>

                      {/* 判断軸（サブ説明） */}
                      <p className="text-[11px] text-white/50 text-center">
                        {character.focusAxis}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* 安心メッセージ */}
              <p className="text-[13px] text-white/60 text-center mt-6">
                途中でいつでも変更できます
              </p>
            </div>
          </div>,
          document.body,
        )}

      {/* アバター拡大モーダル */}
      {previewCharacter && previewAvatarUrl && previewCharacterData && (
        <div
          className="fixed z-[100] bg-black/60 backdrop-blur-sm"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
          }}
          onClick={() => setPreviewCharacter(null)}
        >
          <div
            className="absolute animate-in zoom-in-95 duration-200"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 閉じるボタン */}
            <button
              onClick={() => setPreviewCharacter(null)}
              className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center z-10 hover:bg-gray-100 transition-colors"
            >
              <X size={20} style={{ color: appleWebColors.textSecondary }} />
            </button>

            {/* アバター画像 */}
            <div
              className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl"
              style={{
                backgroundColor: appleWebColors.sectionBackground,
              }}
            >
              <Image
                src={previewAvatarUrl}
                alt={previewCharacterData.name}
                width={320}
                height={320}
                className="w-full h-full object-cover"
              />
            </div>

            {/* キャラクター情報 */}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-white">
                {previewCharacterData.name}
              </h3>
              <p className="text-[13px] text-white/50 mt-0.5">
                {previewCharacterData.nameEn}
              </p>
              <p className="text-sm text-white/70 mt-2">
                {previewCharacterData.recommendationStyleLabel}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WeightBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5 text-[12px]">
      <span className="w-16" style={{ color: appleWebColors.textTertiary }}>
        {label}
      </span>
      <div
        className="flex-1 h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: `${color}20` }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${(value / 30) * 100}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <span
        className="w-8 text-right font-medium"
        style={{ color: appleWebColors.textTertiary }}
      >
        {value}%
      </span>
    </div>
  );
}
