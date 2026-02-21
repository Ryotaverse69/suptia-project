/**
 * 診断結果カード - Satori用JSXコンポーネント
 *
 * @vercel/og (ImageResponse) はReactの制限されたサブセットのみ対応:
 * - style属性のみ (className不可)
 * - flexboxレイアウト
 * - <img> ではなく直接URLを背景に使用
 * - SVG非対応（CSSバーで代替）
 */

import {
  ogColors,
  tierColor,
  pillarLabels,
  tierToScore,
  type OgFormat,
  ogFormats,
} from "./shared";

export interface DiagnosisCardProps {
  goals: string[];
  topProduct: string;
  tierRank: string;
  pricePerDay: number;
  scores: {
    price?: string;
    content?: string;
    costEffectiveness?: string;
    evidence?: string;
    safety?: string;
  };
  format: OgFormat;
}

// 目的の日本語ラベル
const goalLabels: Record<string, string> = {
  immunity: "免疫力",
  energy: "エネルギー",
  sleep: "睡眠",
  skin: "美容・肌",
  bone: "骨・関節",
  muscle: "筋肉",
  focus: "集中力",
  stress: "ストレス",
  diet: "ダイエット",
  gut: "腸内環境",
};

function ScoreBar({
  label,
  rank,
  isVertical,
}: {
  label: string;
  rank: string;
  isVertical: boolean;
}) {
  const score = tierToScore(rank);
  const color = tierColor(rank);

  if (isVertical) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color,
          }}
        >
          {rank}
        </div>
        <div
          style={{
            width: "48px",
            height: "120px",
            backgroundColor: ogColors.border,
            borderRadius: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "48px",
              height: `${Math.round(score * 1.2)}px`,
              backgroundColor: color,
              borderRadius: "24px",
            }}
          />
        </div>
        <div
          style={{
            fontSize: "13px",
            color: ogColors.textSecondary,
            textAlign: "center",
          }}
        >
          {label}
        </div>
      </div>
    );
  }

  // Horizontal bar
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "80px",
          fontSize: "14px",
          color: ogColors.textSecondary,
          textAlign: "right",
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: "24px",
          backgroundColor: ogColors.border,
          borderRadius: "12px",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "24px",
            backgroundColor: color,
            borderRadius: "12px",
          }}
        />
      </div>
      <div
        style={{
          width: "32px",
          fontSize: "15px",
          fontWeight: 700,
          color,
        }}
      >
        {rank}
      </div>
    </div>
  );
}

export function DiagnosisCard({
  goals,
  topProduct,
  tierRank,
  pricePerDay,
  scores,
  format,
}: DiagnosisCardProps) {
  const { width, height } = ogFormats[format];
  const isStory = format === "story";
  const isSquare = format === "square";

  const goalText = goals
    .map((g) => goalLabels[g] || g)
    .slice(0, 3)
    .join(" / ");

  const pillars = [
    { key: "price", label: pillarLabels.price, rank: scores.price || "-" },
    {
      key: "content",
      label: pillarLabels.content,
      rank: scores.content || "-",
    },
    {
      key: "costEffectiveness",
      label: pillarLabels.costEffectiveness,
      rank: scores.costEffectiveness || "-",
    },
    {
      key: "evidence",
      label: pillarLabels.evidence,
      rank: scores.evidence || "-",
    },
    { key: "safety", label: pillarLabels.safety, rank: scores.safety || "-" },
  ];

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        backgroundColor: ogColors.background,
        fontFamily: "sans-serif",
      }}
    >
      {/* ヘッダー: ブランドバー */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isStory ? "40px 40px 24px" : "24px 40px",
          background: `linear-gradient(135deg, ${ogColors.mint} 0%, ${ogColors.blue} 100%)`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: isStory ? "32px" : "24px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            Suptia
          </div>
          <div
            style={{
              fontSize: isStory ? "16px" : "13px",
              color: "rgba(255,255,255,0.85)",
              marginTop: "2px",
            }}
          >
            サプリメント診断結果
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "rgba(255,255,255,0.2)",
            padding: "6px 14px",
            borderRadius: "20px",
          }}
        >
          <div
            style={{
              fontSize: isStory ? "14px" : "12px",
              color: "#ffffff",
              fontWeight: 600,
            }}
          >
            AI監修済み
          </div>
        </div>
      </div>

      {/* 目的タグ */}
      <div
        style={{
          display: "flex",
          padding: isStory ? "24px 40px 16px" : "16px 40px 12px",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        {goals.slice(0, 3).map((g) => (
          <div
            key={g}
            style={{
              backgroundColor: ogColors.mintLight,
              color: ogColors.mint,
              fontSize: isStory ? "16px" : "13px",
              fontWeight: 600,
              padding: "6px 16px",
              borderRadius: "16px",
            }}
          >
            {goalLabels[g] || g}
          </div>
        ))}
      </div>

      {/* メインカード: 商品 + Tier */}
      <div
        style={{
          display: "flex",
          flexDirection: isStory ? "column" : "row",
          alignItems: isStory ? "stretch" : "center",
          margin: isStory ? "16px 40px" : "12px 40px",
          padding: isStory ? "32px" : "24px 32px",
          backgroundColor: ogColors.cardBackground,
          borderRadius: "20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          gap: isStory ? "24px" : "32px",
        }}
      >
        {/* Tier Badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: isStory ? "100px" : "80px",
              height: isStory ? "100px" : "80px",
              borderRadius: "20px",
              backgroundColor: tierColor(tierRank),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isStory ? "42px" : "34px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-1px",
            }}
          >
            {tierRank}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: ogColors.textSecondary,
            }}
          >
            総合ランク
          </div>
        </div>

        {/* 商品情報 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "8px",
          }}
        >
          <div
            style={{
              fontSize: isStory ? "24px" : "20px",
              fontWeight: 700,
              color: ogColors.textPrimary,
              lineHeight: 1.3,
            }}
          >
            {topProduct}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
            }}
          >
            <div
              style={{
                fontSize: isStory ? "36px" : "28px",
                fontWeight: 800,
                color: ogColors.blue,
              }}
            >
              ¥{pricePerDay}
            </div>
            <div
              style={{
                fontSize: isStory ? "16px" : "14px",
                color: ogColors.textSecondary,
              }}
            >
              /日
            </div>
          </div>
        </div>
      </div>

      {/* 5柱スコアバー */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          margin: isStory ? "8px 40px" : "4px 40px",
          padding: isStory ? "28px 32px" : "20px 32px",
          backgroundColor: ogColors.cardBackground,
          borderRadius: "20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          gap: isStory ? "20px" : "12px",
          justifyContent: isSquare ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            fontSize: isStory ? "17px" : "14px",
            fontWeight: 700,
            color: ogColors.textPrimary,
            marginBottom: "4px",
          }}
        >
          5柱評価
        </div>
        {isStory ? (
          // Story: 縦棒グラフ
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-end",
              flex: 1,
              paddingTop: "16px",
            }}
          >
            {pillars.map((p) => (
              <ScoreBar
                key={p.key}
                label={p.label}
                rank={p.rank}
                isVertical={true}
              />
            ))}
          </div>
        ) : (
          // OGP/Square: 横棒グラフ
          pillars.map((p) => (
            <ScoreBar
              key={p.key}
              label={p.label}
              rank={p.rank}
              isVertical={false}
            />
          ))
        )}
      </div>

      {/* フッター */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isStory ? "20px 40px 40px" : "12px 40px 20px",
        }}
      >
        <div
          style={{
            fontSize: isStory ? "14px" : "12px",
            color: ogColors.textSecondary,
          }}
        >
          suptia.com/diagnosis
        </div>
        <div
          style={{
            fontSize: isStory ? "14px" : "12px",
            color: ogColors.textSecondary,
          }}
        >
          5つの柱でサプリを科学的に比較
        </div>
      </div>
    </div>
  );
}
