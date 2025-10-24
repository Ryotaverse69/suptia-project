"use client";

import { useState, Fragment } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">お問い合わせ</h1>
          <p className="text-xl text-muted-foreground">
            ご質問、ご意見、ご要望など、お気軽にお問い合わせください
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="border rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">メール対応</h3>
            <p className="text-sm text-muted-foreground">
              通常2〜3営業日以内にご返信いたします
            </p>
          </div>
          <div className="border rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">詳細な回答</h3>
            <p className="text-sm text-muted-foreground">
              担当者が丁寧に対応いたします
            </p>
          </div>
          <div className="border rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Send className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">24時間受付</h3>
            <p className="text-sm text-muted-foreground">
              いつでもお問い合わせいただけます
            </p>
          </div>
        </div>

        {/* お問い合わせフォーム */}
        <div className="border rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">お問い合わせフォーム</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* お名前 */}
            <div>
              <label htmlFor="name" className="block font-semibold mb-2">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="山田 太郎"
              />
            </div>

            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block font-semibold mb-2">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="example@email.com"
              />
            </div>

            {/* お問い合わせカテゴリ */}
            <div>
              <label htmlFor="category" className="block font-semibold mb-2">
                お問い合わせカテゴリ <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
              <label htmlFor="subject" className="block font-semibold mb-2">
                件名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="お問い合わせの件名をご入力ください"
              />
            </div>

            {/* お問い合わせ内容 */}
            <div>
              <label htmlFor="message" className="block font-semibold mb-2">
                お問い合わせ内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={8}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="お問い合わせ内容を詳しくご記入ください"
              />
            </div>

            {/* 注意事項 */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <strong>ご注意:</strong>{" "}
                個別の健康相談、医療アドバイスには対応しておりません。
                健康や医療に関するご質問は、必ず医師または専門家にご相談ください。
              </p>
            </div>

            {/* プライバシーポリシー同意 */}
            <div className="flex items-start space-x-2">
              <input type="checkbox" id="privacy" required className="mt-1" />
              <label
                htmlFor="privacy"
                className="text-sm text-muted-foreground"
              >
                <a
                  href="/legal/privacy"
                  className="text-primary hover:underline"
                >
                  プライバシーポリシー
                </a>
                に同意します <span className="text-red-500">*</span>
              </label>
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "送信中..." : "送信する"}
            </button>
          </form>
        </div>

        {/* よくある質問へのリンク */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            お問い合わせの前に、よくある質問もご確認ください
          </p>
          <a
            href="/faq"
            className="inline-block text-primary hover:underline font-semibold"
          >
            よくある質問（FAQ）を見る →
          </a>
        </div>
      </div>
    </>
  );
}
