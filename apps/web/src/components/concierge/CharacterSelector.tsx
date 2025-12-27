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

import { useState } from "react";
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
  navi: [systemColors.green, systemColors.teal],
  mint: [systemColors.cyan, systemColors.blue],
  doc: [systemColors.purple, systemColors.indigo],
  haru: [systemColors.orange, systemColors.yellow],
};

interface CharacterSelectorProps {
  selectedCharacterId: CharacterId;
  onSelect: (characterId: CharacterId) => void;
  userPlan: string;
  disabled?: boolean;
  compact?: boolean; // ヘッダー用コンパクト表示
}

export function CharacterSelector({
  selectedCharacterId,
  onSelect,
  userPlan,
  disabled = false,
  compact = false,
}: CharacterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewCharacter, setPreviewCharacter] = useState<CharacterId | null>(
    null,
  );
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

  return (
    <div className="relative">
      {/* 選択ボタン */}
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

      {/* ドロップダウン */}
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* メニュー - モバイルでは画面中央に固定表示 */}
          <div
            className={cn(
              "z-50 rounded-2xl overflow-hidden shadow-xl",
              liquidGlassClasses.light,
              // モバイル: 画面中央に固定、デスクトップ: ボタンの下に表示
              "fixed inset-x-4 top-20 max-h-[70vh] overflow-y-auto",
              "sm:absolute sm:inset-auto sm:top-full sm:left-0 sm:mt-2 sm:w-80 sm:max-h-[60vh]",
            )}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: `1px solid ${appleWebColors.borderSubtle}`,
              backdropFilter: "blur(20px)",
            }}
          >
            {allCharacters.map((character, index) => {
              const isAvailable = availableCharacters.some(
                (c) => c.id === character.id,
              );
              const isSelected = character.id === selectedCharacterId;
              const weights = calculateWeightPercentages(character.id);
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
                    "w-full p-4 flex items-start gap-3 text-left transition-colors",
                    isAvailable
                      ? "hover:bg-black/5 active:bg-black/10"
                      : "opacity-60 cursor-not-allowed",
                    isSelected && "bg-black/5",
                  )}
                  style={{
                    borderBottom:
                      index < allCharacters.length - 1
                        ? `1px solid ${appleWebColors.borderSubtle}`
                        : undefined,
                  }}
                >
                  {/* アバター（タップで拡大表示） */}
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (avatarUrl) {
                          setPreviewCharacter(character.id);
                        }
                      }}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden transition-transform hover:scale-110 active:scale-100"
                      style={{
                        background: avatarUrl
                          ? undefined
                          : `linear-gradient(135deg, ${charGradient[0]} 0%, ${charGradient[1]} 100%)`,
                      }}
                      title="タップで拡大表示"
                    >
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={character.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-[16px] font-semibold">
                          {character.name.charAt(0)}
                        </span>
                      )}
                    </button>
                    {!isAvailable && (
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: systemColors.gray[4] }}
                      >
                        <Lock size={10} className="text-white" />
                      </div>
                    )}
                    {isSelected && isAvailable && (
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: systemColors.blue }}
                      >
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* キャラクター情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold text-[15px]"
                        style={{ color: appleWebColors.textPrimary }}
                      >
                        {character.name}
                      </span>
                      {!isAvailable && (
                        <span
                          className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: `${systemColors.purple}15`,
                            color: systemColors.purple,
                          }}
                        >
                          Pro限定
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[13px] mt-0.5"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      {character.personality}
                    </p>
                    <p
                      className="text-[12px] mt-1"
                      style={{ color: appleWebColors.textTertiary }}
                    >
                      {character.recommendationStyleLabel}
                    </p>

                    {/* 重み付けバー */}
                    {isAvailable && (
                      <div className="mt-3 space-y-1.5">
                        <WeightBar
                          label="価格"
                          value={weights.price}
                          color={systemColors.green}
                        />
                        <WeightBar
                          label="エビデンス"
                          value={weights.evidence}
                          color={systemColors.blue}
                        />
                        <WeightBar
                          label="安全性"
                          value={weights.safety}
                          color={systemColors.orange}
                        />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
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
              <p className="text-sm text-white/70 mt-1">
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
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-16" style={{ color: appleWebColors.textTertiary }}>
        {label}
      </span>
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
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
