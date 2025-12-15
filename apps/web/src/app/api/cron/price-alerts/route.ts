/**
 * 価格アラート通知Cron API
 *
 * 毎日定期実行され、目標価格に達した商品のアラートを通知
 * Vercel Cronから呼び出される
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { sanityServer } from "@/lib/sanityServer";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // 最大60秒

// Supabaseサーバークライアント
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase credentials not configured");
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Resendクライアント
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(process.env.RESEND_API_KEY);
}

interface PriceAlert {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  target_price: number;
  current_price: number | null;
  is_active: boolean;
}

interface UserEmail {
  id: string;
  email: string;
}

/**
 * 商品の現在価格を取得
 */
async function getCurrentPrice(productId: string): Promise<number | null> {
  try {
    const product = await sanityServer.fetch(
      `*[_id == $productId][0]{ priceJPY, priceData }`,
      { productId },
    );

    if (!product) return null;

    // priceDataから最低価格を取得
    if (product.priceData && product.priceData.length > 0) {
      const prices = product.priceData.map((p: { amount: number }) => p.amount);
      return Math.min(...prices);
    }

    return product.priceJPY || null;
  } catch (error) {
    console.error(`[PriceAlerts] Failed to get price for ${productId}:`, error);
    return null;
  }
}

/**
 * アラート通知メールを送信
 */
async function sendAlertEmail(
  resend: Resend,
  userEmail: string,
  alerts: Array<{
    productName: string;
    targetPrice: number;
    currentPrice: number;
    productId: string;
  }>,
): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://suptia.com";

  const productList = alerts
    .map(
      (alert) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">
          <a href="${siteUrl}/products/${alert.productId}" style="color: #3b66e0; text-decoration: none; font-weight: bold;">
            ${alert.productName}
          </a>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right; color: #666;">
          ¥${alert.targetPrice.toLocaleString()}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e0e0e0; text-align: right; color: #22c55e; font-weight: bold;">
          ¥${alert.currentPrice.toLocaleString()}
        </td>
      </tr>
    `,
    )
    .join("");

  const emailHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>価格アラート通知</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #3b66e0 0%, #8b5cf6 100%); border-radius: 12px 12px 0 0; padding: 30px; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 24px;">価格が下がりました!</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">設定した目標価格に達した商品があります</p>
  </div>

  <div style="background-color: #fff; border-radius: 0 0 12px 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #f8f9fa;">
          <th style="padding: 12px; text-align: left; font-weight: bold; color: #666;">商品名</th>
          <th style="padding: 12px; text-align: right; font-weight: bold; color: #666;">目標価格</th>
          <th style="padding: 12px; text-align: right; font-weight: bold; color: #666;">現在価格</th>
        </tr>
      </thead>
      <tbody>
        ${productList}
      </tbody>
    </table>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${siteUrl}/mypage/alerts" style="display: inline-block; background: linear-gradient(135deg, #3b66e0 0%, #8b5cf6 100%); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
        アラート設定を確認
      </a>
    </div>

    <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">
      このメールはサプティアの価格アラート機能から自動送信されました。<br>
      <a href="${siteUrl}/mypage/alerts" style="color: #3b66e0;">アラート設定</a>から通知を管理できます。
    </p>
  </div>

  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
    <p style="margin: 0;"><a href="${siteUrl}" style="color: #3b66e0; text-decoration: none;">サプティア</a> - サプリメント比較サイト</p>
  </div>
</body>
</html>
  `.trim();

  try {
    const { error } = await resend.emails.send({
      from: "サプティア 価格アラート <alerts@suptia.com>",
      to: [userEmail],
      subject: `【価格アラート】${alerts.length}件の商品が目標価格に達しました`,
      html: emailHtml,
    });

    if (error) {
      console.error(
        `[PriceAlerts] Failed to send email to ${userEmail}:`,
        error,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`[PriceAlerts] Error sending email:`, error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  // Cron認証（Vercel Cron Security）- CRON_SECRET必須
  const cronSecret = process.env.CRON_SECRET;

  // 本番環境ではCRON_SECRET必須
  if (!cronSecret && process.env.NODE_ENV === "production") {
    console.error("[PriceAlerts Cron] CRON_SECRET is not configured");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  // シークレットが設定されている場合は認証チェック
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const startTime = Date.now();
  const stats = {
    alertsChecked: 0,
    alertsTriggered: 0,
    emailsSent: 0,
    errors: [] as string[],
  };

  try {
    const supabase = getSupabaseAdmin();
    const resend = getResendClient();

    // アクティブなアラートを取得
    const { data: alerts, error: alertsError } = await supabase
      .from("price_alerts")
      .select("*")
      .eq("is_active", true);

    if (alertsError) {
      throw new Error(`Failed to fetch alerts: ${alertsError.message}`);
    }

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active alerts",
        stats,
        duration: Date.now() - startTime,
      });
    }

    stats.alertsChecked = alerts.length;

    // ユーザーごとにグループ化
    const alertsByUser = new Map<string, PriceAlert[]>();
    for (const alert of alerts) {
      const userId = alert.user_id;
      if (!alertsByUser.has(userId)) {
        alertsByUser.set(userId, []);
      }
      alertsByUser.get(userId)!.push(alert);
    }

    // ユーザーのメールアドレスを取得
    const userIds = Array.from(alertsByUser.keys());
    const { data: users, error: usersError } =
      await supabase.auth.admin.listUsers();

    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    const userEmailMap = new Map<string, string>();
    for (const user of users.users) {
      if (user.email && userIds.includes(user.id)) {
        userEmailMap.set(user.id, user.email);
      }
    }

    // 各ユーザーのアラートをチェック
    for (const [userId, userAlerts] of alertsByUser) {
      const userEmail = userEmailMap.get(userId);
      if (!userEmail) {
        stats.errors.push(`User ${userId} has no email`);
        continue;
      }

      const triggeredAlerts: Array<{
        alertId: string;
        productName: string;
        targetPrice: number;
        currentPrice: number;
        productId: string;
      }> = [];

      // 各アラートの価格をチェック
      for (const alert of userAlerts) {
        const currentPrice = await getCurrentPrice(alert.product_id);

        if (currentPrice === null) {
          continue;
        }

        // 現在価格を更新
        await supabase
          .from("price_alerts")
          .update({ current_price: currentPrice })
          .eq("id", alert.id);

        // 目標価格に達したかチェック
        if (currentPrice <= alert.target_price) {
          triggeredAlerts.push({
            alertId: alert.id,
            productName: alert.product_name || "商品名不明",
            targetPrice: alert.target_price,
            currentPrice,
            productId: alert.product_id,
          });
        }
      }

      // トリガーされたアラートがあればメール送信
      if (triggeredAlerts.length > 0) {
        stats.alertsTriggered += triggeredAlerts.length;

        const emailSent = await sendAlertEmail(
          resend,
          userEmail,
          triggeredAlerts,
        );

        if (emailSent) {
          stats.emailsSent++;

          // 通知済みとしてマーク
          const alertIds = triggeredAlerts.map((a) => a.alertId);
          await supabase
            .from("price_alerts")
            .update({ notified_at: new Date().toISOString() })
            .in("id", alertIds);
        }
      }
    }

    return NextResponse.json({
      success: true,
      stats,
      duration: Date.now() - startTime,
    });
  } catch (error) {
    console.error("[PriceAlerts Cron] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        stats,
        duration: Date.now() - startTime,
      },
      { status: 500 },
    );
  }
}
