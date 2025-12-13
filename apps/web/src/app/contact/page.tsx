"use client";

import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Send,
  ChevronRight,
  Clock,
  HeadphonesIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import {
  systemColors,
  appleWebColors,
  fontStack,
  withOpacity,
  liquidGlassClasses,
} from "@/lib/design-system";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // APIエンドポイントへの送信
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "送信に失敗しました");
      }

      // 成功時の処理
      toast.success(
        "お問い合わせを受け付けました。ご返信まで今しばらくお待ちください。",
        {
          duration: 5000,
          style: {
            background: systemColors.green,
            color: "#fff",
            fontSize: "15px",
            padding: "16px",
            borderRadius: "12px",
            fontFamily: fontStack,
          },
          iconTheme: {
            primary: "#fff",
            secondary: systemColors.green,
          },
        },
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "general",
        message: "",
      });
      setPrivacyChecked(false);
    } catch (error) {
      console.error("Contact form submission error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "送信に失敗しました。もう一度お試しください。";

      toast.error(errorMessage, {
        duration: 5000,
        style: {
          background: systemColors.red,
          color: "#fff",
          fontSize: "15px",
          padding: "16px",
          borderRadius: "12px",
          fontFamily: fontStack,
        },
        iconTheme: {
          primary: "#fff",
          secondary: systemColors.red,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div
      style={{
        backgroundColor: appleWebColors.pageBackground,
        fontFamily: fontStack,
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />

      {/* ヒーローセクション */}
      <section
        className="relative text-white overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${withOpacity(systemColors.blue, 0.95)} 0%, ${withOpacity(systemColors.blue, 0.85)} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
          style={{ background: withOpacity("#fff", 0.08) }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
          style={{ background: withOpacity("#fff", 0.05) }}
        />

        <div className="relative container mx-auto px-4 py-16 md:py-20">
          {/* パンくずリスト */}
          <nav
            className="flex items-center space-x-2 text-[13px] mb-8"
            style={{ color: withOpacity("#fff", 0.8) }}
          >
            <Link href="/" className="hover:text-white transition-colors">
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">お問い合わせ</span>
          </nav>

          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
              style={{
                backgroundColor: withOpacity("#fff", 0.15),
                backdropFilter: "blur(10px)",
              }}
            >
              <HeadphonesIcon className="w-5 h-5" />
              <span className="text-[15px] font-medium">
                カスタマーサポート
              </span>
            </div>

            <h1 className="text-[40px] md:text-[48px] font-bold mb-6 leading-tight tracking-tight">
              お問い合わせ
            </h1>
            <p
              className="text-[17px] leading-relaxed"
              style={{ color: withOpacity("#fff", 0.9) }}
            >
              ご質問、ご意見、ご要望など、お気軽にお問い合わせください。
              <br className="hidden md:block" />
              担当者が丁寧にご対応いたします。
            </p>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* サポート特徴 */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div
            className={`rounded-[20px] p-6 text-center transition-all hover:scale-[1.02] hover:-translate-y-1 ${liquidGlassClasses.light}`}
          >
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
              style={{ backgroundColor: systemColors.blue }}
            >
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h3
              className="font-semibold text-[17px] mb-2"
              style={{ color: appleWebColors.textPrimary }}
            >
              メール対応
            </h3>
            <p
              className="text-[15px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              通常2〜3営業日以内にご返信いたします
            </p>
          </div>

          <div
            className={`rounded-[20px] p-6 text-center transition-all hover:scale-[1.02] hover:-translate-y-1 ${liquidGlassClasses.light}`}
          >
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
              style={{ backgroundColor: systemColors.blue }}
            >
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <h3
              className="font-semibold text-[17px] mb-2"
              style={{ color: appleWebColors.textPrimary }}
            >
              詳細な回答
            </h3>
            <p
              className="text-[15px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              担当者が丁寧に対応いたします
            </p>
          </div>

          <div
            className={`rounded-[20px] p-6 text-center transition-all hover:scale-[1.02] hover:-translate-y-1 ${liquidGlassClasses.light}`}
          >
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
              style={{ backgroundColor: systemColors.blue }}
            >
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h3
              className="font-semibold text-[17px] mb-2"
              style={{ color: appleWebColors.textPrimary }}
            >
              24時間受付
            </h3>
            <p
              className="text-[15px]"
              style={{ color: appleWebColors.textSecondary }}
            >
              いつでもお問い合わせいただけます
            </p>
          </div>
        </div>

        {/* お問い合わせフォーム */}
        <div
          className={`rounded-[20px] overflow-hidden ${liquidGlassClasses.light}`}
        >
          <div
            className="px-8 py-5"
            style={{
              background: `linear-gradient(135deg, ${systemColors.blue} 0%, ${withOpacity(systemColors.blue, 0.85)} 100%)`,
            }}
          >
            <h2 className="text-[20px] font-semibold text-white flex items-center gap-3">
              <Send className="w-5 h-5" />
              お問い合わせフォーム
            </h2>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* お名前 */}
              <div>
                <label
                  htmlFor="name"
                  className="block font-semibold mb-2 text-[15px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  お名前 <span style={{ color: systemColors.red }}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 min-h-[48px] rounded-[16px] focus:outline-none transition-all text-[17px]"
                  placeholder="山田 太郎"
                  style={{
                    backgroundColor: "#fff",
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                    color: appleWebColors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = systemColors.blue;
                    e.target.style.boxShadow = `0 0 0 4px ${withOpacity(systemColors.blue, 0.1)}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = appleWebColors.borderSubtle;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* メールアドレス */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-semibold mb-2 text-[15px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  メールアドレス{" "}
                  <span style={{ color: systemColors.red }}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 min-h-[48px] rounded-[16px] focus:outline-none transition-all text-[17px]"
                  placeholder="example@email.com"
                  style={{
                    backgroundColor: "#fff",
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                    color: appleWebColors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = systemColors.blue;
                    e.target.style.boxShadow = `0 0 0 4px ${withOpacity(systemColors.blue, 0.1)}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = appleWebColors.borderSubtle;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* お問い合わせカテゴリ */}
              <div>
                <label
                  htmlFor="category"
                  className="block font-semibold mb-2 text-[15px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  お問い合わせカテゴリ{" "}
                  <span style={{ color: systemColors.red }}>*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 min-h-[48px] rounded-[16px] focus:outline-none transition-all appearance-none text-[17px]"
                  style={{
                    backgroundColor: "#fff",
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                    color: appleWebColors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = systemColors.blue;
                    e.target.style.boxShadow = `0 0 0 4px ${withOpacity(systemColors.blue, 0.1)}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = appleWebColors.borderSubtle;
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="general">一般的なお問い合わせ</option>
                  <option value="product">製品情報について</option>
                  <option value="technical">技術的な問題</option>
                  <option value="partnership">提携・ビジネス</option>
                  <option value="media">メディア・取材</option>
                  <option value="data">データの削除・修正</option>
                  <option value="other">その他</option>
                </select>
              </div>

              {/* 件名 */}
              <div>
                <label
                  htmlFor="subject"
                  className="block font-semibold mb-2 text-[15px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  件名 <span style={{ color: systemColors.red }}>*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 min-h-[48px] rounded-[16px] focus:outline-none transition-all text-[17px]"
                  placeholder="お問い合わせの件名をご入力ください"
                  style={{
                    backgroundColor: "#fff",
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                    color: appleWebColors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = systemColors.blue;
                    e.target.style.boxShadow = `0 0 0 4px ${withOpacity(systemColors.blue, 0.1)}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = appleWebColors.borderSubtle;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* お問い合わせ内容 */}
              <div>
                <label
                  htmlFor="message"
                  className="block font-semibold mb-2 text-[15px]"
                  style={{ color: appleWebColors.textPrimary }}
                >
                  お問い合わせ内容{" "}
                  <span style={{ color: systemColors.red }}>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 rounded-[16px] focus:outline-none transition-all resize-none text-[17px]"
                  placeholder="お問い合わせ内容を詳しくご記入ください"
                  style={{
                    backgroundColor: "#fff",
                    border: `1px solid ${appleWebColors.borderSubtle}`,
                    color: appleWebColors.textPrimary,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = systemColors.blue;
                    e.target.style.boxShadow = `0 0 0 4px ${withOpacity(systemColors.blue, 0.1)}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = appleWebColors.borderSubtle;
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* 注意事項 */}
              <div
                className="rounded-[16px] p-4"
                style={{
                  backgroundColor: withOpacity(systemColors.orange, 0.1),
                  border: `1px solid ${withOpacity(systemColors.orange, 0.2)}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: systemColors.orange }}
                  />
                  <div>
                    <p
                      className="font-semibold text-[15px] mb-1"
                      style={{ color: appleWebColors.textPrimary }}
                    >
                      ご注意
                    </p>
                    <p
                      className="text-[13px]"
                      style={{ color: appleWebColors.textSecondary }}
                    >
                      個別の健康相談、医療アドバイスには対応しておりません。
                      健康や医療に関するご質問は、必ず医師または専門家にご相談ください。
                    </p>
                  </div>
                </div>
              </div>

              {/* プライバシーポリシー同意 */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={privacyChecked}
                  onChange={(e) => setPrivacyChecked(e.target.checked)}
                  required
                  className="mt-1 w-5 h-5 rounded"
                  style={{
                    accentColor: systemColors.blue,
                  }}
                />
                <label
                  htmlFor="privacy"
                  className="text-[15px]"
                  style={{ color: appleWebColors.textSecondary }}
                >
                  <Link
                    href="/legal/privacy"
                    className="font-medium hover:underline"
                    style={{ color: systemColors.blue }}
                  >
                    プライバシーポリシー
                  </Link>
                  に同意します{" "}
                  <span style={{ color: systemColors.red }}>*</span>
                </label>
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={isSubmitting || !privacyChecked}
                className="w-full min-h-[48px] rounded-[16px] font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[17px]"
                style={{
                  backgroundColor: systemColors.blue,
                  boxShadow:
                    isSubmitting || !privacyChecked
                      ? "none"
                      : `0 4px 12px ${withOpacity(systemColors.blue, 0.3)}`,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && privacyChecked) {
                    e.currentTarget.style.transform = "scale(1.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    送信中...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    送信する
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* 対応内容 */}
        <section className="mt-12">
          <h2
            className="text-[22px] font-bold mb-6"
            style={{ color: appleWebColors.textPrimary }}
          >
            対応可能なお問い合わせ
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className={`rounded-[16px] p-5 ${liquidGlassClasses.light}`}>
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: systemColors.green }}
                />
                <div>
                  <h3
                    className="font-semibold text-[15px] mb-1"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    製品・サービスについて
                  </h3>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    サプティアの機能や使い方に関するご質問
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-[16px] p-5 ${liquidGlassClasses.light}`}>
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: systemColors.green }}
                />
                <div>
                  <h3
                    className="font-semibold text-[15px] mb-1"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    技術的な問題
                  </h3>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    サイトの動作不良やエラーに関するご報告
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-[16px] p-5 ${liquidGlassClasses.light}`}>
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: systemColors.green }}
                />
                <div>
                  <h3
                    className="font-semibold text-[15px] mb-1"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    提携・ビジネス
                  </h3>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    パートナーシップや事業提携のご相談
                  </p>
                </div>
              </div>
            </div>

            <div className={`rounded-[16px] p-5 ${liquidGlassClasses.light}`}>
              <div className="flex items-start gap-3">
                <CheckCircle2
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: systemColors.green }}
                />
                <div>
                  <h3
                    className="font-semibold text-[15px] mb-1"
                    style={{ color: appleWebColors.textPrimary }}
                  >
                    データに関するご要望
                  </h3>
                  <p
                    className="text-[13px]"
                    style={{ color: appleWebColors.textSecondary }}
                  >
                    個人データの削除・修正のリクエスト
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* よくある質問へのリンク */}
        <section className="mt-12">
          <div
            className="rounded-[20px] p-8 text-center"
            style={{
              backgroundColor: appleWebColors.sectionBackground,
              border: `1px solid ${appleWebColors.borderSubtle}`,
            }}
          >
            <h3
              className="text-[20px] font-semibold mb-3"
              style={{ color: appleWebColors.textPrimary }}
            >
              お問い合わせの前に
            </h3>
            <p
              className="text-[15px] mb-6"
              style={{ color: appleWebColors.textSecondary }}
            >
              よくある質問をご確認いただくと、すぐに解決できる場合があります
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 font-semibold hover:underline text-[17px]"
              style={{ color: systemColors.blue }}
            >
              よくある質問（FAQ）を見る
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* 関連リンク */}
        <section
          className="mt-12 pt-8"
          style={{ borderTop: `1px solid ${appleWebColors.separator}` }}
        >
          <h3
            className="text-[13px] font-semibold uppercase tracking-wider mb-4"
            style={{ color: appleWebColors.textSecondary }}
          >
            関連ページ
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/legal/privacy"
              className="text-[15px] transition-colors hover:underline"
              style={{ color: appleWebColors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = systemColors.blue;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = appleWebColors.textSecondary;
              }}
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/legal/terms"
              className="text-[15px] transition-colors hover:underline"
              style={{ color: appleWebColors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = systemColors.blue;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = appleWebColors.textSecondary;
              }}
            >
              利用規約
            </Link>
            <Link
              href="/partners"
              className="text-[15px] transition-colors hover:underline"
              style={{ color: appleWebColors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = systemColors.blue;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = appleWebColors.textSecondary;
              }}
            >
              提携パートナー
            </Link>
            <Link
              href="/about"
              className="text-[15px] transition-colors hover:underline"
              style={{ color: appleWebColors.textSecondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = systemColors.blue;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = appleWebColors.textSecondary;
              }}
            >
              サプティアとは
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
