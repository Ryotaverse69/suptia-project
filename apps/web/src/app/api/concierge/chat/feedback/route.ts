/**
 * AIコンシェルジュ Feedback API
 *
 * メッセージに対するフィードバックを記録
 * 信頼KPI: ユーザー満足度の測定
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface FeedbackRequest {
  messageId: string;
  feedback: "helpful" | "not_helpful";
  reason?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackRequest = await request.json();

    if (!body.messageId || !body.feedback) {
      return NextResponse.json(
        { error: "messageIdとfeedbackは必須です" },
        { status: 400 },
      );
    }

    if (!["helpful", "not_helpful"].includes(body.feedback)) {
      return NextResponse.json(
        {
          error:
            "feedbackはhelpfulまたはnot_helpfulのいずれかである必要があります",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // ユーザー認証確認
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "フィードバックにはログインが必要です" },
        { status: 401 },
      );
    }

    // メッセージの存在確認と所有権チェック
    const { data: message, error: msgError } = await supabase
      .from("chat_messages")
      .select(
        `
        id,
        session_id,
        role,
        metadata,
        chat_sessions!inner(user_id)
      `,
      )
      .eq("id", body.messageId)
      .single();

    if (msgError || !message) {
      return NextResponse.json(
        { error: "メッセージが見つかりません" },
        { status: 404 },
      );
    }

    // セッションの所有者確認
    // Supabase returns joined data as array even with !inner
    const sessionData = message.chat_sessions as unknown;
    const session = Array.isArray(sessionData) ? sessionData[0] : sessionData;
    const sessionUserId = (session as { user_id: string })?.user_id;
    if (sessionUserId !== user.id) {
      return NextResponse.json(
        { error: "このメッセージにフィードバックする権限がありません" },
        { status: 403 },
      );
    }

    // アシスタントメッセージのみフィードバック可能
    if (message.role !== "assistant") {
      return NextResponse.json(
        { error: "アシスタントの回答のみフィードバックできます" },
        { status: 400 },
      );
    }

    // メタデータを更新
    const currentMetadata = (message.metadata as Record<string, unknown>) || {};
    const updatedMetadata = {
      ...currentMetadata,
      userFeedback: body.feedback,
      feedbackReason: body.reason || null,
      feedbackAt: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from("chat_messages")
      .update({ metadata: updatedMetadata })
      .eq("id", body.messageId);

    if (updateError) {
      console.error("[Feedback API] Update error:", updateError);
      return NextResponse.json(
        { error: "フィードバックの保存に失敗しました" },
        { status: 500 },
      );
    }

    // フィードバックログを記録（分析用）
    await supabase.from("usage_logs").insert({
      user_id: user.id,
      session_id: message.session_id,
      action: "feedback",
      metadata: {
        messageId: body.messageId,
        feedback: body.feedback,
        reason: body.reason || null,
        characterId: currentMetadata.characterId,
        model: currentMetadata.model,
      },
    });

    return NextResponse.json({
      success: true,
      message: "フィードバックを記録しました",
    });
  } catch (error) {
    console.error("[Feedback API] Error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}

/**
 * フィードバック統計を取得（管理者用）
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // ユーザー認証確認
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 管理者チェック
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    if (profile?.plan !== "admin") {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 },
      );
    }

    // 直近30日のフィードバック統計
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: feedbackLogs } = await supabase
      .from("usage_logs")
      .select("metadata")
      .eq("action", "feedback")
      .gte("created_at", thirtyDaysAgo.toISOString());

    const stats = {
      total: feedbackLogs?.length || 0,
      helpful: 0,
      notHelpful: 0,
      byCharacter: {} as Record<
        string,
        { helpful: number; notHelpful: number }
      >,
      byModel: {} as Record<string, { helpful: number; notHelpful: number }>,
    };

    feedbackLogs?.forEach((log) => {
      const metadata = log.metadata as {
        feedback: string;
        characterId?: string;
        model?: string;
      };

      if (metadata.feedback === "helpful") {
        stats.helpful++;
      } else {
        stats.notHelpful++;
      }

      // キャラクター別
      if (metadata.characterId) {
        if (!stats.byCharacter[metadata.characterId]) {
          stats.byCharacter[metadata.characterId] = {
            helpful: 0,
            notHelpful: 0,
          };
        }
        if (metadata.feedback === "helpful") {
          stats.byCharacter[metadata.characterId].helpful++;
        } else {
          stats.byCharacter[metadata.characterId].notHelpful++;
        }
      }

      // モデル別
      if (metadata.model) {
        if (!stats.byModel[metadata.model]) {
          stats.byModel[metadata.model] = { helpful: 0, notHelpful: 0 };
        }
        if (metadata.feedback === "helpful") {
          stats.byModel[metadata.model].helpful++;
        } else {
          stats.byModel[metadata.model].notHelpful++;
        }
      }
    });

    // 満足度を計算
    const satisfactionRate =
      stats.total > 0 ? Math.round((stats.helpful / stats.total) * 100) : null;

    return NextResponse.json({
      period: "last_30_days",
      stats: {
        ...stats,
        satisfactionRate,
      },
    });
  } catch (error) {
    console.error("[Feedback API] Stats error:", error);
    return NextResponse.json(
      { error: "統計の取得に失敗しました" },
      { status: 500 },
    );
  }
}
