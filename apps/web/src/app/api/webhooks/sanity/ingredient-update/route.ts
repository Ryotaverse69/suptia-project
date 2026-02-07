/**
 * Sanity Webhook: 成分更新時のTierランク自動再計算
 *
 * トリガー条件:
 *   - ingredientドキュメントのevidenceLevelまたはsafetyLevelが更新された場合
 *
 * 処理内容:
 *   - GitHub Actions workflowをトリガーしてTierランク再計算を実行
 *   - または、ISRを使用して関連ページを再検証
 *
 * セキュリティ:
 *   - Sanity Webhook署名を検証
 *
 * 設定方法（Sanity管理画面）:
 *   1. sanity.io/manage でプロジェクトを選択
 *   2. API → Webhooks → Add webhook
 *   3. URL: https://suptia.com/api/webhooks/sanity/ingredient-update
 *   4. Trigger on: Update
 *   5. Filter: _type == "ingredient"
 *   6. Projection: {_id, name, evidenceLevel, safetyLevel}
 *   7. Secret: 環境変数 SANITY_WEBHOOK_SECRET と同じ値を設定
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Sanity Webhook ペイロードの型
interface SanityWebhookPayload {
  _id: string;
  _type: string;
  name?: string;
  evidenceLevel?: string;
  safetyLevel?: string;
  operation?: string;
  transactionId?: string;
}

// 署名検証関数
function verifySignature(
  payload: string,
  signature: string | null,
  secret: string,
): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. 環境変数チェック
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
    const githubToken = process.env.GITHUB_TOKEN;
    const revalidateSecret = process.env.REVALIDATE_SECRET;

    if (!webhookSecret) {
      console.error("[Webhook] SANITY_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 },
      );
    }

    // 2. ペイロード取得
    const rawPayload = await request.text();
    const signature = request.headers.get("x-sanity-signature");

    // 3. 署名検証
    if (!verifySignature(rawPayload, signature, webhookSecret)) {
      console.error("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 4. ペイロード解析
    const payload: SanityWebhookPayload = JSON.parse(rawPayload);

    console.log(
      `[Webhook] Received ingredient update: ${payload.name || payload._id}`,
    );
    console.log(
      `[Webhook] evidenceLevel: ${payload.evidenceLevel}, safetyLevel: ${payload.safetyLevel}`,
    );

    // 5. GitHub Actionsをトリガー（設定されている場合）
    if (githubToken) {
      try {
        const response = await fetch(
          "https://api.github.com/repos/suptia/suptia-project/actions/workflows/recalculate-tier-ranks.yml/dispatches",
          {
            method: "POST",
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${githubToken}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
            body: JSON.stringify({
              ref: "master",
              inputs: {
                ingredient_id: payload._id,
                ingredient_name: payload.name || "unknown",
                trigger: "webhook",
              },
            }),
          },
        );

        if (response.ok) {
          console.log(
            "[Webhook] GitHub Actions workflow triggered successfully",
          );
        } else {
          const errorText = await response.text();
          console.error(
            `[Webhook] GitHub Actions trigger failed: ${response.status} ${errorText}`,
          );
        }
      } catch (error) {
        console.error("[Webhook] Failed to trigger GitHub Actions:", error);
      }
    }

    // 6. ISR再検証をトリガー（商品ページを更新）
    if (revalidateSecret) {
      try {
        const revalidateUrl = new URL("/api/revalidate", request.url);

        await fetch(revalidateUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-revalidate-secret": revalidateSecret,
          },
          body: JSON.stringify({
            path: "/products",
          }),
        });

        console.log("[Webhook] ISR revalidation triggered for /products");
      } catch (error) {
        console.error("[Webhook] ISR revalidation failed:", error);
      }
    }

    const processingTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: `Ingredient update processed: ${payload.name || payload._id}`,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Webhook] Error processing request:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GETリクエストでヘルスチェック
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/webhooks/sanity/ingredient-update",
    description: "Sanity webhook for ingredient updates",
    triggers: [
      "GitHub Actions workflow (if GITHUB_TOKEN is set)",
      "ISR revalidation (if REVALIDATE_SECRET is set)",
    ],
  });
}
