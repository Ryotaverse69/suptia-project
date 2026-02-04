/**
 * カスタム重み付け API
 *
 * Pro+Safety / Admin限定機能
 * ユーザーのカスタム重み付けを保存・取得
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface CustomWeights {
  price: number;
  amount: number;
  costPerformance: number;
  evidence: number;
  safety: number;
}

/**
 * GET - カスタム重み付けを取得
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

    // プラン確認
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("plan, custom_weights")
      .eq("user_id", user.id)
      .single();

    // Pro+Safety / Admin以外はアクセス拒否
    if (profile?.plan !== "pro_safety" && profile?.plan !== "admin") {
      return NextResponse.json(
        { error: "この機能はPro+Safetyプラン限定です" },
        { status: 403 },
      );
    }

    // カスタム重み付けを返す
    return NextResponse.json({
      customWeights: profile.custom_weights || null,
    });
  } catch (error) {
    console.error("[Custom Weights API] GET error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}

/**
 * POST - カスタム重み付けを保存
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // ユーザー認証確認
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // プラン確認
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    // Pro+Safety / Admin以外はアクセス拒否
    if (profile?.plan !== "pro_safety" && profile?.plan !== "admin") {
      return NextResponse.json(
        { error: "この機能はPro+Safetyプラン限定です" },
        { status: 403 },
      );
    }

    // リクエストボディ取得
    const body = await request.json();
    const weights: CustomWeights = body.weights;

    // バリデーション
    if (!weights) {
      return NextResponse.json(
        { error: "重み付けデータが必要です" },
        { status: 400 },
      );
    }

    // 合計が100かチェック
    const total =
      weights.price +
      weights.amount +
      weights.costPerformance +
      weights.evidence +
      weights.safety;

    if (total !== 100) {
      return NextResponse.json(
        { error: "重み付けの合計は100%である必要があります" },
        { status: 400 },
      );
    }

    // 各値が0-100の範囲内かチェック
    const values = Object.values(weights);
    if (values.some((v) => v < 0 || v > 100)) {
      return NextResponse.json(
        { error: "重み付けは0-100%の範囲で設定してください" },
        { status: 400 },
      );
    }

    // カスタム重み付けを保存
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        custom_weights: weights,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[Custom Weights API] Update error:", updateError);
      return NextResponse.json(
        { error: "保存に失敗しました" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      customWeights: weights,
    });
  } catch (error) {
    console.error("[Custom Weights API] POST error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}

/**
 * DELETE - カスタム重み付けをリセット
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // ユーザー認証確認
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // プラン確認
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    // Pro+Safety / Admin以外はアクセス拒否
    if (profile?.plan !== "pro_safety" && profile?.plan !== "admin") {
      return NextResponse.json(
        { error: "この機能はPro+Safetyプラン限定です" },
        { status: 403 },
      );
    }

    // カスタム重み付けを削除（null化）
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({
        custom_weights: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("[Custom Weights API] Delete error:", updateError);
      return NextResponse.json(
        { error: "リセットに失敗しました" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("[Custom Weights API] DELETE error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 },
    );
  }
}
