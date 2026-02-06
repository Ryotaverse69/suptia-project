"use client";

/**
 * 価格アラートボタンコンポーネント
 *
 * 商品の価格が目標価格以下になったら通知を受け取れる機能
 */

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, BellRing, X } from "lucide-react";
import { usePriceAlerts } from "@/contexts/PriceAlertsContext";
import { LoginModal } from "@/components/auth/LoginModal";

interface PriceAlertButtonProps {
  productId: string;
  productName: string;
  currentPrice: number;
  className?: string;
}

export function PriceAlertButton({
  productId,
  productName,
  currentPrice,
  className = "",
}: PriceAlertButtonProps) {
  const { hasAlert, getAlert, addAlert, removeAlert, isLoggedIn } =
    usePriceAlerts();
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const alert = getAlert(productId);
  const isAlertSet = hasAlert(productId);

  // モーダル表示時にbodyスクロールをロック
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [showModal]);

  // 推奨アラート価格（現在価格の5%, 10%, 15%引き）
  const suggestedPrices = [
    { label: "5%引き", price: Math.floor(currentPrice * 0.95) },
    { label: "10%引き", price: Math.floor(currentPrice * 0.9) },
    { label: "15%引き", price: Math.floor(currentPrice * 0.85) },
  ];

  const handleClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (isAlertSet) {
      // アラート設定済みの場合は削除確認
      setShowModal(true);
    } else {
      // 新規設定
      setTargetPrice(suggestedPrices[1].price.toString());
      setShowModal(true);
    }
  };

  const handleSubmit = async () => {
    const price = parseInt(targetPrice, 10);
    if (isNaN(price) || price <= 0) return;

    setIsSubmitting(true);
    try {
      await addAlert(productId, productName, price, currentPrice);
      setShowModal(false);
      setTargetPrice("");
    } catch (error) {
      console.error("Failed to set price alert:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    setIsSubmitting(true);
    try {
      await removeAlert(productId);
      setShowModal(false);
    } catch (error) {
      console.error("Failed to remove price alert:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300
          ${
            isAlertSet
              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl"
              : "bg-white hover:bg-amber-50 text-slate-700 border-2 border-slate-200 hover:border-amber-300"
          }
          ${className}
        `}
        aria-label={isAlertSet ? "価格アラートを編集" : "価格アラートを設定"}
      >
        {isAlertSet ? (
          <>
            <BellRing size={18} className="animate-pulse" />
            <span className="hidden sm:inline">
              {alert?.targetPrice.toLocaleString()}円で通知
            </span>
            <span className="sm:hidden">通知ON</span>
          </>
        ) : (
          <>
            <Bell size={18} />
            <span className="hidden sm:inline">価格アラート</span>
            <span className="sm:hidden">アラート</span>
          </>
        )}
      </button>

      {/* 価格アラート設定モーダル（createPortalでbody直下にレンダリング） */}
      {showModal &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {isAlertSet ? "価格アラートの編集" : "価格アラートを設定"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 商品情報 */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-500 mb-1">対象商品</p>
                  <p className="font-medium text-slate-900 line-clamp-2">
                    {productName}
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    現在価格:{" "}
                    <span className="text-blue-600">
                      {currentPrice.toLocaleString()}円
                    </span>
                  </p>
                </div>

                {/* 目標価格入力 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    この価格以下になったら通知
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder="目標価格を入力"
                      className="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-lg font-medium"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      円
                    </span>
                  </div>
                </div>

                {/* 推奨価格ボタン */}
                <div>
                  <p className="text-sm text-slate-500 mb-2">クイック設定</p>
                  <div className="flex gap-2">
                    {suggestedPrices.map((suggestion) => (
                      <button
                        key={suggestion.label}
                        onClick={() =>
                          setTargetPrice(suggestion.price.toString())
                        }
                        className={`
                          flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${
                            targetPrice === suggestion.price.toString()
                              ? "bg-amber-500 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }
                        `}
                      >
                        <div>{suggestion.label}</div>
                        <div className="text-xs opacity-75">
                          {suggestion.price.toLocaleString()}円
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-3 pt-2">
                  {isAlertSet && (
                    <button
                      onClick={handleRemove}
                      disabled={isSubmitting}
                      className="px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      削除
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      !targetPrice ||
                      parseInt(targetPrice, 10) <= 0
                    }
                    className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "設定中..."
                      : isAlertSet
                        ? "更新する"
                        : "アラートを設定"}
                  </button>
                </div>

                {/* 注意事項 */}
                <p className="text-xs text-slate-400 text-center">
                  価格が目標以下になった際、登録メールアドレスに通知が届きます
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ログインモーダル */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
