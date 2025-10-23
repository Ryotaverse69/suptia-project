import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Resendクライアントの初期化
const resend = new Resend(process.env.RESEND_API_KEY);

// リクエストボディの型定義
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

// バリデーション関数
function validateContactForm(data: ContactFormData): string | null {
  // 必須フィールドのチェック
  if (!data.name || data.name.trim().length === 0) {
    return "お名前を入力してください";
  }

  if (!data.email || data.email.trim().length === 0) {
    return "メールアドレスを入力してください";
  }

  // メールアドレスの形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return "有効なメールアドレスを入力してください";
  }

  if (!data.subject || data.subject.trim().length === 0) {
    return "件名を入力してください";
  }

  if (!data.message || data.message.trim().length === 0) {
    return "お問い合わせ内容を入力してください";
  }

  // 文字数制限チェック
  if (data.name.length > 100) {
    return "お名前は100文字以内で入力してください";
  }

  if (data.subject.length > 200) {
    return "件名は200文字以内で入力してください";
  }

  if (data.message.length > 5000) {
    return "お問い合わせ内容は5000文字以内で入力してください";
  }

  return null;
}

// カテゴリ名の日本語変換
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    general: "一般的なお問い合わせ",
    product: "製品情報について",
    technical: "技術的な問題",
    partnership: "提携・ビジネス",
    media: "メディア・取材",
    data: "データの削除・修正",
    other: "その他",
  };
  return categoryMap[category] || category;
}

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得
    const body: ContactFormData = await request.json();

    // バリデーション
    const validationError = validateContactForm(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 },
      );
    }

    // RESEND_API_KEYの存在確認
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        {
          success: false,
          error: "メール送信サービスが設定されていません",
        },
        { status: 500 },
      );
    }

    // 受信メールアドレスの確認
    const adminEmail = process.env.CONTACT_EMAIL || "info@suptia.com";

    // メール本文の作成
    const emailHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>お問い合わせ</title>
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h1 style="color: #3b66e0; margin: 0 0 10px 0; font-size: 24px;">お問い合わせを受信しました</h1>
    <p style="color: #666; margin: 0; font-size: 14px;">サプティア お問い合わせフォーム</p>
  </div>

  <div style="background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0; border-bottom: 2px solid #3b66e0; padding-bottom: 10px;">送信者情報</h2>

    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; color: #666; font-weight: bold; width: 120px;">お名前:</td>
        <td style="padding: 10px 0;">${body.name}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #666; font-weight: bold;">メールアドレス:</td>
        <td style="padding: 10px 0;"><a href="mailto:${body.email}" style="color: #3b66e0; text-decoration: none;">${body.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #666; font-weight: bold;">カテゴリ:</td>
        <td style="padding: 10px 0;">${getCategoryName(body.category)}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #666; font-weight: bold;">件名:</td>
        <td style="padding: 10px 0;">${body.subject}</td>
      </tr>
    </table>
  </div>

  <div style="background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0; border-bottom: 2px solid #3b66e0; padding-bottom: 10px;">お問い合わせ内容</h2>
    <div style="white-space: pre-wrap; word-wrap: break-word; line-height: 1.8;">${body.message}</div>
  </div>

  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 15px; font-size: 12px; color: #666;">
    <p style="margin: 0 0 5px 0;"><strong>受信日時:</strong> ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}</p>
    <p style="margin: 0;"><strong>IP アドレス:</strong> ${request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "不明"}</p>
  </div>

  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999;">
    <p style="margin: 0;">このメールはサプティアのお問い合わせフォームから自動送信されました</p>
    <p style="margin: 5px 0 0 0;"><a href="https://suptia.com" style="color: #3b66e0; text-decoration: none;">https://suptia.com</a></p>
  </div>
</body>
</html>
    `.trim();

    // メール送信
    const { data, error } = await resend.emails.send({
      from: "サプティア お問い合わせ <noreply@suptia.com>",
      to: [adminEmail],
      replyTo: body.email,
      subject: `【お問い合わせ】${body.subject}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return NextResponse.json(
        {
          success: false,
          error:
            "メール送信に失敗しました。しばらくしてから再度お試しください。",
        },
        { status: 500 },
      );
    }

    console.log("Email sent successfully:", data);

    // 成功レスポンス
    return NextResponse.json(
      {
        success: true,
        message: "お問い合わせを受け付けました",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "サーバーエラーが発生しました。しばらくしてから再度お試しください。",
      },
      { status: 500 },
    );
  }
}
