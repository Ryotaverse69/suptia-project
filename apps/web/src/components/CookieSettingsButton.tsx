"use client";

export function CookieSettingsButton() {
  return (
    <button
      onClick={() => {
        // Cookie同意マネージャーを開く処理（後で実装）
        console.log("Open cookie consent manager");
      }}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
    >
      Cookie設定を変更する
    </button>
  );
}
