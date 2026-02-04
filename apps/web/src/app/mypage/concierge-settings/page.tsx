/**
 * AIコンシェルジュ設定ページ
 *
 * カスタム重み付け編集（Pro+Safety/Admin限定）
 */

"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { CustomWeightsEditor } from "@/components/concierge";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { appleWebColors, systemColors } from "@/lib/design-system";

interface CustomWeights {
  price: number;
  amount: number;
  costPerformance: number;
  evidence: number;
  safety: number;
}

export default function ConciergeSettingsPage() {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const [customWeights, setCustomWeights] = useState<CustomWeights | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // カスタム重み付けを取得
  useEffect(() => {
    const fetchCustomWeights = async () => {
      try {
        const response = await fetch("/api/concierge/custom-weights");
        if (response.ok) {
          const data = await response.json();
          setCustomWeights(data.customWeights);
        }
      } catch (error) {
        console.error("Failed to fetch custom weights:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (profile) {
      fetchCustomWeights();
    }
  }, [profile]);

  // 保存処理
  const handleSave = async (weights: CustomWeights) => {
    try {
      const response = await fetch("/api/concierge/custom-weights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weights }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "保存に失敗しました");
      }

      setCustomWeights(weights);
      console.log("カスタム重み付けを保存しました:", weights);
    } catch (error) {
      console.error("保存エラー:", error);
      alert(error instanceof Error ? error.message : "保存に失敗しました");
      throw error; // エラーを再スロー
    }
  };

  // リセット処理
  const handleReset = async () => {
    try {
      const response = await fetch("/api/concierge/custom-weights", {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "リセットに失敗しました");
      }

      setCustomWeights(null);
      console.log("カスタム重み付けをリセットしました");
    } catch (error) {
      console.error("リセットエラー:", error);
      alert(error instanceof Error ? error.message : "リセットに失敗しました");
      throw error; // エラーを再スロー
    }
  };

  if (profileLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${systemColors.blue} transparent` }}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pb-20"
      style={{ backgroundColor: appleWebColors.pageBackground }}
    >
      {/* ヘッダー */}
      <header
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.72)",
          borderColor: appleWebColors.borderSubtle,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/mypage"
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <ArrowLeft size={20} style={{ color: systemColors.blue }} />
            </Link>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${systemColors.purple} 0%, ${systemColors.blue} 100%)`,
                }}
              >
                <Sparkles size={16} className="text-white" />
              </div>
              <h1
                className="text-[17px] font-semibold"
                style={{ color: appleWebColors.textPrimary }}
              >
                AIコンシェルジュ設定
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 説明セクション */}
        <div
          className="p-4 rounded-2xl mb-6"
          style={{
            backgroundColor: appleWebColors.sectionBackground,
            border: `1px solid ${appleWebColors.borderSubtle}`,
          }}
        >
          <h2
            className="text-[15px] font-semibold mb-2"
            style={{ color: appleWebColors.textPrimary }}
          >
            カスタム重み付けについて
          </h2>
          <p
            className="text-[13px] leading-relaxed mb-3"
            style={{ color: appleWebColors.textSecondary }}
          >
            あなたの価値観に合わせて、AIコンシェルジュの推薦ロジックをカスタマイズできます。
            5つの柱（価格・成分量・コスパ・エビデンス・安全性）の重要度を調整して、
            あなた専用の最適な推薦を受けましょう。
          </p>
          <div
            className="flex items-start gap-2 p-3 rounded-lg"
            style={{ backgroundColor: `${systemColors.blue}10` }}
          >
            <span className="text-[12px]">💡</span>
            <p
              className="text-[11px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              カスタム重み付けは、すべてのキャラクター（コア・ミント・リファ・ハク）に適用されます。
              設定後は、AIの推薦がより正確にあなたの好みを反映します。
            </p>
          </div>
        </div>

        {/* カスタム重み付けエディター */}
        <CustomWeightsEditor
          userPlan={profile?.plan || "guest"}
          initialWeights={customWeights || undefined}
          onSave={handleSave}
          onReset={handleReset}
        />

        {/* AIコンシェルジュへのリンク */}
        <div className="mt-6 text-center">
          <Link
            href="/concierge"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-medium text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: systemColors.blue }}
          >
            <Sparkles size={16} />
            AIコンシェルジュで試す
          </Link>
        </div>
      </main>
    </div>
  );
}
