import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminMFAGuard } from "@/components/auth/AdminMFAGuard";

// 動的レンダリングを強制（認証チェックを毎回実行）
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未ログインはログインページへ
  if (!user) {
    redirect("/login?redirect=/admin");
  }

  // 管理者権限チェック
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  // 非管理者はホームへ
  if (!profile?.is_admin) {
    redirect("/");
  }

  // MFA検証ガード（管理者がMFAを有効にしている場合のみ検証を要求）
  return <AdminMFAGuard>{children}</AdminMFAGuard>;
}
