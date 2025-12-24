/**
 * AIコンシェルジュ Chat API
 *
 * v2.1.0 - 信頼される判断補助エンジン
 *
 * 設計3原則:
 * 1. 断定しない - AIは判断者ではなく翻訳者
 * 2. 理由を説明する - 推薦には必ず根拠を提示
 * 3. 重み付けを見せる - ユーザーが選んでいる感覚を作る
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCharacter, CHARACTER_WEIGHTS } from "@/lib/concierge/characters";
import {
  type CharacterId,
  type AIModel,
  type ChatMessage,
  PLAN_CONFIGS,
  GUEST_CONFIG,
} from "@/lib/concierge/types";
import type { UserPlan } from "@/contexts/UserProfileContext";
import { checkCompliance, autoFixViolations } from "@/lib/compliance/checker";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ============================================
// リクエスト・レスポンス型
// ============================================

interface ChatRequest {
  message: string;
  sessionId?: string;
  characterId?: CharacterId;
  context?: {
    productId?: string;
    ingredientSlug?: string;
  };
}

interface ChatResponse {
  message: {
    id: string;
    role: "assistant";
    content: string;
    metadata: Record<string, unknown>;
  };
  userMessageId?: string;
  session: {
    id: string;
    title: string | null;
  };
  usage: {
    remaining: number;
    limit: number;
    resetAt: string;
  };
  upgradePrompt?: {
    type: "limit_reached" | "feature_locked";
    message: string;
  };
}

// ============================================
// ヘルパー関数
// ============================================

/**
 * 日本時間の日付文字列を取得
 */
function getTodayJST(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split("T")[0];
}

/**
 * 明日0時（JST）のISO文字列を取得
 */
function getTomorrowResetTime(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  jst.setDate(jst.getDate() + 1);
  jst.setHours(0, 0, 0, 0);
  return new Date(jst.getTime() - 9 * 60 * 60 * 1000).toISOString();
}

/**
 * モデルを選択（安全優先ルール適用）
 */
function selectModel(
  plan: UserPlan | "guest",
  hasSafetyContext: boolean,
): AIModel {
  // Safety強制フラグ: 健康リスクが絡む場合はOpus
  if (hasSafetyContext && plan === "pro_safety") {
    return "opus";
  }

  // プラン別選択
  switch (plan) {
    case "guest":
    case "free":
      return "haiku";
    case "pro":
      return "sonnet";
    case "pro_safety":
      return "sonnet";
    case "admin":
      return "sonnet";
    default:
      return "haiku";
  }
}

/**
 * Anthropicモデル名に変換
 */
function getAnthropicModel(model: AIModel): string {
  switch (model) {
    case "haiku":
      return "claude-3-haiku-20240307";
    case "sonnet":
      return "claude-sonnet-4-20250514";
    case "opus":
      return "claude-opus-4-20250514";
    default:
      return "claude-3-haiku-20240307";
  }
}

/**
 * システムプロンプトを構築
 */
function buildSystemPrompt(
  characterId: CharacterId,
  userPlan: UserPlan | "guest",
): string {
  const character = getCharacter(characterId);
  const weights = CHARACTER_WEIGHTS[characterId];

  const basePrompt = `
あなたはSuptia（サプティア）のAIコンシェルジュ「${character.name}」です。
サプリメント選びを「安全 × コスト × エビデンス」の観点からサポートします。

【Suptiaの立ち位置】
「AIが最適解を出す」のではなく、「人間が納得して選べる状態を作る」

【あなたのキャラクター: ${character.name}】
${character.personality}

【話し方のルール】
${character.tone}

【推薦スタイル】
${character.recommendationStyleLabel}

【5つの柱の重み付け】
- 価格: ${Math.round((weights.price / 5) * 100)}%
- 成分量: ${Math.round((weights.amount / 5) * 100)}%
- コスパ: ${Math.round((weights.costPerformance / 5) * 100)}%
- エビデンス: ${Math.round((weights.evidence / 5) * 100)}%
- 安全性: ${Math.round((weights.safety / 5) * 100)}%

【絶対に守るルール】
1. 医療効果を断定しない（「治る」「予防」「改善」は禁止）
2. 「〜をサポート」「〜に役立つ可能性」「研究では〜」という表現を使う
3. 重要な判断は必ず「医師・薬剤師にご相談ください」と添える
4. 価格について「買い時」「値下がりします」と断定しない
5. 出典がない情報を事実として提示しない
6. Safety情報は「判断」ではなく「注意喚起・情報の翻訳」として提示
7. 「避けるべき」「危険」などの断定表現は使用しない

【5つの柱で説明】
推薦理由は必ず以下の柱で可視化する：
- 💰 価格: 複数ECサイトでの価格を比較
- 📊 成分量: 1日あたりの有効成分量を比較
- 💡 コスパ: 成分量あたりの価格（¥/mg）を算出
- 🔬 エビデンス: S/A/B/C/Dの5段階で科学的根拠を評価
- 🛡️ 安全性: 添加物・成分の安全性を評価

【回答形式】
- 簡潔で分かりやすい日本語
- 専門用語は必ず説明を添える
- 推薦商品には「なぜこの商品なのか」を具体的に説明
- キャラクターの口調を維持しつつ、情報の正確性は犠牲にしない
`;

  return basePrompt;
}

/**
 * セッションタイトルを生成
 */
function generateSessionTitle(firstMessage: string): string {
  // 最初の30文字を抽出してタイトルに
  const title = firstMessage.trim().slice(0, 30);
  return title.length < firstMessage.trim().length ? `${title}...` : title;
}

// ============================================
// メインハンドラ
// ============================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // リクエストボディの取得
    const body: ChatRequest = await request.json();

    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json(
        { error: "メッセージを入力してください" },
        { status: 400 },
      );
    }

    if (body.message.length > 2000) {
      return NextResponse.json(
        { error: "メッセージは2000文字以内で入力してください" },
        { status: 400 },
      );
    }

    // Supabaseクライアント作成
    const supabase = await createClient();

    // ユーザー認証確認
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // プラン情報取得
    let userPlan: UserPlan | "guest" = "guest";
    let planConfig = GUEST_CONFIG;

    if (user) {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("plan")
        .eq("user_id", user.id)
        .single();

      userPlan = (profile?.plan as UserPlan) || "free";
      planConfig = PLAN_CONFIGS[userPlan] || PLAN_CONFIGS.free;
    }

    // 利用回数チェック
    const todayJST = getTodayJST();
    let todayUsage = 0;

    if (user) {
      const { count } = await supabase
        .from("usage_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("action", "chat")
        .gte("created_at", `${todayJST}T00:00:00+09:00`);

      todayUsage = count || 0;
    } else {
      // ゲストはIPベースで制限（簡易実装）
      const clientIP =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";

      // TODO: Redis等で管理。現在はメモリ内で管理できないため制限なし扱い
      todayUsage = 0;
    }

    const limit = planConfig.chatLimit;
    const remaining = Math.max(0, limit - todayUsage);

    if (remaining <= 0 && limit !== Infinity) {
      const upgradeMessage =
        userPlan === "guest"
          ? "ログインすると1日10回まで質問できます。"
          : userPlan === "free"
            ? "Proプランにアップグレードすると1日50回まで質問できます。"
            : "";

      return NextResponse.json(
        {
          error: `本日の質問回数上限（${limit}回）に達しました。${upgradeMessage}`,
          usage: {
            remaining: 0,
            limit,
            resetAt: getTomorrowResetTime(),
          },
          upgradePrompt:
            userPlan !== "pro_safety" && userPlan !== "admin"
              ? {
                  type: "limit_reached",
                  message: upgradeMessage,
                }
              : undefined,
        },
        { status: 429 },
      );
    }

    // キャラクター取得
    const characterId = body.characterId || "navi";
    const character = getCharacter(characterId);

    // キャラクター利用可否チェック
    if (
      userPlan !== "admin" &&
      !character.availablePlans.includes(userPlan as UserPlan)
    ) {
      return NextResponse.json(
        { error: "このキャラクターはご利用いただけません" },
        { status: 403 },
      );
    }

    // セッション取得または作成
    let sessionId = body.sessionId;
    let isNewSession = false;
    let sessionTitle: string | null = null;

    if (!sessionId && user) {
      // 新規セッション作成
      const { data: newSession, error: sessionError } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: user.id,
          character_id: characterId,
          title: generateSessionTitle(body.message),
        })
        .select()
        .single();

      if (sessionError) {
        console.error("[Concierge API] Session creation error:", sessionError);
        return NextResponse.json(
          { error: "セッションの作成に失敗しました" },
          { status: 500 },
        );
      }

      sessionId = newSession.id;
      sessionTitle = newSession.title;
      isNewSession = true;
    } else if (sessionId && user) {
      // 既存セッションのタイトルを確認し、なければ設定
      const { data: existingSession } = await supabase
        .from("chat_sessions")
        .select("title, message_count")
        .eq("id", sessionId)
        .eq("user_id", user.id)
        .single();

      if (existingSession) {
        // タイトルがない、または最初のメッセージの場合にタイトルを設定
        if (!existingSession.title || existingSession.message_count === 0) {
          const newTitle = generateSessionTitle(body.message);
          await supabase
            .from("chat_sessions")
            .update({ title: newTitle })
            .eq("id", sessionId);
          sessionTitle = newTitle;
        } else {
          sessionTitle = existingSession.title;
        }
      }
    }

    // 過去のメッセージを取得（コンテキスト用）
    const contextMessages: { role: "user" | "assistant"; content: string }[] =
      [];

    if (sessionId && user) {
      const { data: previousMessages } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true })
        .limit(planConfig.contextMessages);

      if (previousMessages) {
        contextMessages.push(
          ...previousMessages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        );
      }
    }

    // ユーザーメッセージを保存
    let userMessageId: string | undefined;

    if (sessionId && user) {
      const { data: savedMessage, error: msgError } = await supabase
        .from("chat_messages")
        .insert({
          session_id: sessionId,
          role: "user",
          content: body.message,
          metadata: {},
        })
        .select("id")
        .single();

      if (msgError) {
        console.error("[Concierge API] Message save error:", msgError);
      } else {
        userMessageId = savedMessage.id;
      }
    }

    // Safety コンテキストを判定
    const healthKeywords =
      /相互作用|副作用|禁忌|既往|服用中|アレルギー|妊娠|授乳|薬|持病/;
    const hasSafetyContext = healthKeywords.test(body.message);

    // モデル選択
    const model = selectModel(userPlan, hasSafetyContext);
    const anthropicModel = getAnthropicModel(model);

    // Anthropic API呼び出し
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = buildSystemPrompt(characterId, userPlan);

    const messages: Anthropic.MessageParam[] = [
      ...contextMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: body.message },
    ];

    const response = await anthropic.messages.create({
      model: anthropicModel,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    // レスポンスからテキストを抽出
    let assistantContent =
      response.content[0].type === "text" ? response.content[0].text : "";

    // 薬機法チェック
    const complianceResult = checkCompliance(assistantContent);
    if (complianceResult.violations.length > 0) {
      // NGワードを置換
      assistantContent = autoFixViolations(
        assistantContent,
        complianceResult.violations,
      );
    }

    // アシスタントメッセージを保存
    let assistantMessageId: string | undefined;

    if (sessionId && user) {
      const metadata = {
        characterId,
        characterName: character.name,
        recommendationStyle: character.recommendationStyle,
        model,
        tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
      };

      const { data: savedAssistant, error: assistantError } = await supabase
        .from("chat_messages")
        .insert({
          session_id: sessionId,
          role: "assistant",
          content: assistantContent,
          metadata,
        })
        .select("id")
        .single();

      if (assistantError) {
        console.error(
          "[Concierge API] Assistant message save error:",
          assistantError,
        );
      } else {
        assistantMessageId = savedAssistant.id;
      }
    }

    // 利用ログを記録
    const responseTime = Date.now() - startTime;

    if (user) {
      await supabase.from("usage_logs").insert({
        user_id: user.id,
        session_id: sessionId,
        action: "chat",
        model,
        tokens_input: response.usage.input_tokens,
        tokens_output: response.usage.output_tokens,
        response_time_ms: responseTime,
      });
    }

    // セッションのメッセージカウントを更新
    if (sessionId && user) {
      await supabase
        .from("chat_sessions")
        .update({
          message_count: contextMessages.length + 2, // 過去メッセージ + 今回のユーザー＆アシスタント
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    // レスポンス
    const chatResponse: ChatResponse = {
      message: {
        id: assistantMessageId || `temp-${Date.now()}`,
        role: "assistant",
        content: assistantContent,
        metadata: {
          characterId,
          characterName: character.name,
          recommendationStyle: character.recommendationStyle,
          model,
        },
      },
      userMessageId,
      session: {
        id: sessionId || `guest-${Date.now()}`,
        title: sessionTitle,
      },
      usage: {
        remaining: remaining - 1,
        limit,
        resetAt: getTomorrowResetTime(),
      },
    };

    return NextResponse.json(chatResponse);
  } catch (error) {
    console.error("[Concierge API] Error:", error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error:
            "AI応答の生成に失敗しました。しばらくしてから再度お試しください。",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}
