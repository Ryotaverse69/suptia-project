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
            background: "#10b981",
            color: "#fff",
            fontSize: "16px",
            padding: "16px",
            borderRadius: "8px",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10b981",
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
          background: "#ef4444",
          color: "#fff",
          fontSize: "16px",
          padding: "16px",
          borderRadius: "8px",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ef4444",
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
    <>
      <Toaster position="top-center" reverseOrder={false} />

      {/* ヒーローセクション */}
      <section className="relative bg-gradient-to-br from-cyan-600 via-cyan-700 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative container mx-auto px-4 py-16 md:py-20">
          {/* パンくずリスト */}
          <nav className="flex items-center space-x-2 text-sm text-cyan-100 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              ホーム
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">お問い合わせ</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <HeadphonesIcon className="w-5 h-5" />
              <span className="text-sm font-medium">カスタマーサポート</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              お問い合わせ
            </h1>
            <p className="text-xl text-cyan-100 leading-relaxed">
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
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 mb-4">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">メール対応</h3>
            <p className="text-sm text-gray-600">
              通常2〜3営業日以内にご返信いたします
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 mb-4">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">詳細な回答</h3>
            <p className="text-sm text-gray-600">
              担当者が丁寧に対応いたします
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 mb-4">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">24時間受付</h3>
            <p className="text-sm text-gray-600">
              いつでもお問い合わせいただけます
            </p>
          </div>
        </div>

        {/* お問い合わせフォーム */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-8 py-5">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
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
                  className="block font-semibold mb-2 text-gray-800"
                >
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="山田 太郎"
                />
              </div>

              {/* メールアドレス */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-semibold mb-2 text-gray-800"
                >
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="example@email.com"
                />
              </div>

              {/* お問い合わせカテゴリ */}
              <div>
                <label
                  htmlFor="category"
                  className="block font-semibold mb-2 text-gray-800"
                >
                  お問い合わせカテゴリ <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none bg-white"
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
                  className="block font-semibold mb-2 text-gray-800"
                >
                  件名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="お問い合わせの件名をご入力ください"
                />
              </div>

              {/* お問い合わせ内容 */}
              <div>
                <label
                  htmlFor="message"
                  className="block font-semibold mb-2 text-gray-800"
                >
                  お問い合わせ内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                  placeholder="お問い合わせ内容を詳しくご記入ください"
                />
              </div>

              {/* 注意事項 */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800 mb-1">ご注意</p>
                    <p className="text-sm text-amber-700">
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
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="privacy" className="text-sm text-gray-600">
                  <Link
                    href="/legal/privacy"
                    className="text-cyan-600 hover:text-cyan-700 font-medium hover:underline"
                  >
                    プライバシーポリシー
                  </Link>
                  に同意します <span className="text-red-500">*</span>
                </label>
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={isSubmitting || !privacyChecked}
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-4 rounded-xl font-bold hover:from-cyan-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
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
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            対応可能なお問い合わせ
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    製品・サービスについて
                  </h3>
                  <p className="text-sm text-gray-600">
                    サプティアの機能や使い方に関するご質問
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    技術的な問題
                  </h3>
                  <p className="text-sm text-gray-600">
                    サイトの動作不良やエラーに関するご報告
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    提携・ビジネス
                  </h3>
                  <p className="text-sm text-gray-600">
                    パートナーシップや事業提携のご相談
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    データに関するご要望
                  </h3>
                  <p className="text-sm text-gray-600">
                    個人データの削除・修正のリクエスト
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* よくある質問へのリンク */}
        <section className="mt-12">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center border border-gray-200">
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              お問い合わせの前に
            </h3>
            <p className="text-gray-600 mb-6">
              よくある質問をご確認いただくと、すぐに解決できる場合があります
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold"
            >
              よくある質問（FAQ）を見る
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            関連ページ
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/legal/privacy"
              className="text-sm text-gray-600 hover:text-cyan-600 transition-colors"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/legal/terms"
              className="text-sm text-gray-600 hover:text-cyan-600 transition-colors"
            >
              利用規約
            </Link>
            <Link
              href="/partners"
              className="text-sm text-gray-600 hover:text-cyan-600 transition-colors"
            >
              提携パートナー
            </Link>
            <Link
              href="/about"
              className="text-sm text-gray-600 hover:text-cyan-600 transition-colors"
            >
              サプティアとは
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
