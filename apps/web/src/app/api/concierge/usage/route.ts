/**
 * AIコンシェルジュ Usage API
 *
 * ユーザーの利用状況を取得
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UserPlan } from "@/contexts/UserProfileContext";
import { PLAN_CONFIGS, GUEST_CONFIG } from "@/lib/concierge/types";

export const dynamic = "force-dynamic";

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

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // ユーザー認証確認
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // ゲストの場合
      return NextResponse.json({
        plan: "guest",
        usage: {
          remaining: GUEST_CONFIG.chatLimit,
          limit: GUEST_CONFIG.chatLimit,
          resetAt: getTomorrowResetTime(),
        },
        features: {
          availableCharacters: GUEST_CONFIG.availableCharacters,
          contextMessages: GUEST_CONFIG.contextMessages,
          historyRetentionDays: null,
          canUseCustomName: false,
          canViewWeights: false,
        },
      });
    }

    // プラン情報取得
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    const userPlan = (profile?.plan as UserPlan) || "free";
    const planConfig = PLAN_CONFIGS[userPlan] || PLAN_CONFIGS.free;

    // 本日の利用回数を取得
    const todayJST = getTodayJST();

    const { count: todayUsage } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("action", "chat")
      .gte("created_at", `${todayJST}T00:00:00+09:00`);

    const used = todayUsage || 0;
    const limit = planConfig.chatLimit;
    const remaining = limit === Infinity ? Infinity : Math.max(0, limit - used);

    // セッション数を取得
    const { count: sessionCount } = await supabase
      .from("chat_sessions")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // 週間の利用統計
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: weeklyStats } = await supabase
      .from("usage_logs")
      .select("created_at, tokens_input, tokens_output")
      .eq("user_id", user.id)
      .eq("action", "chat")
      .gte("created_at", weekAgo.toISOString());

    const weeklyUsage = weeklyStats?.length || 0;
    const weeklyTokens =
      weeklyStats?.reduce(
        (sum, log) => sum + (log.tokens_input || 0) + (log.tokens_output || 0),
        0,
      ) || 0;

    return NextResponse.json({
      plan: userPlan,
      usage: {
        remaining: remaining === Infinity ? null : remaining,
        limit: limit === Infinity ? null : limit,
        used,
        resetAt: getTomorrowResetTime(),
      },
      stats: {
        totalSessions: sessionCount || 0,
        maxSessions: planConfig.maxSessions,
        weeklyUsage,
        weeklyTokens,
      },
      features: {
        availableCharacters: planConfig.availableCharacters,
        contextMessages: planConfig.contextMessages,
        historyRetentionDays: planConfig.historyRetentionDays,
        characterChangeLimit: planConfig.characterChangeLimit,
        canUseCustomName: planConfig.canUseCustomName,
        canViewWeights: planConfig.canViewWeights,
      },
    });
  } catch (error) {
    console.error("[Usage API] Error:", error);
    return NextResponse.json(
      { error: "利用状況の取得に失敗しました" },
      { status: 500 },
    );
  }
}
