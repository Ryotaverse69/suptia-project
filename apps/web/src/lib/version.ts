/**
 * デプロイバージョンマーカー
 * 新しいJavaScriptバンドルが配信されていることを確認するため
 *
 * ブラウザコンソールで window.SUPTIA_VERSION を実行して確認できます
 */
export const APP_VERSION = "1.2.0-fix-homepage-badges";
export const DEPLOY_TIME = new Date().toISOString();

// Make version available globally in browser
if (typeof window !== "undefined") {
  (window as any).SUPTIA_VERSION = {
    version: APP_VERSION,
    deployTime: DEPLOY_TIME,
    message: "Homepage badges null check fix deployed",
  };
}
