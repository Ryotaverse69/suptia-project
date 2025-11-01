# 🔴 アレルギー表記 安全性チェックレポート

## 実施日時
2025-11-01

## チェック結果サマリー
- ✅ 4つのアレルギータグすべてがカバーされている
- ⚠️ 表現の強度に一貫性の欠如あり
- ⚠️ 医学的観点から表現を強化する必要あり

---

## 📋 詳細チェック項目

### 1. アレルギータグの定義確認

#### 現在の定義（page.tsx）
```typescript
const ALLERGY_TAGS: Record<string, string> = {
  "allergy-prone": "アレルギー体質の方は注意が必要です",
  "shellfish-allergy": "貝アレルギーの方は使用を控えてください",
  "soy-allergy": "大豆アレルギーの方は使用を控えてください",
  "nut-allergy": "ナッツアレルギーの方は使用を控えてください",
};
```

#### Sanityスキーマとの一致性
✅ すべてのアレルギータグがカバーされている
- ✅ allergy-prone
- ✅ shellfish-allergy
- ✅ soy-allergy
- ✅ nut-allergy

---

## 🚨 発見された問題点

### 問題1: 表現の一貫性の欠如

**現状**:
- `allergy-prone`: "注意が必要です"（弱い表現）
- その他3つ: "使用を控えてください"（強い表現）

**問題点**:
- アレルギー体質の方だけ表現が弱く、重要度が低く見える
- 実際には、アレルギー体質の方こそより慎重になるべき

**推奨**:
すべて統一した強い表現にする

---

### 問題2: 医学的観点から表現が不十分

**現状**:
- "使用を控えてください" のみ
- 下部に全体の注意書きあり

**問題点**:
1. アレルギーはアナフィラキシーショックなど命に関わる
2. "控える"だけでは任意に聞こえる
3. 各アレルギーメッセージに「医師相談」が明記されていない

**医学的に推奨される表現**:
- 特定のアレルギー物質: "絶対に使用しないでください"
- アレルギー体質: "使用前に必ず医師にご相談ください"

---

### 問題3: 法的責任の明確化

**現状**:
- 全体の注意書きに「医師または薬剤師にご相談ください」
- 各アレルギーには含まれていない

**問題点**:
- ユーザーが個別メッセージだけ読んで見逃す可能性
- 法的責任範囲が不明確

**推奨**:
各アレルギーメッセージに医師相談を明記

---

## ✅ 推奨修正案

### 修正1: アレルギータグ定義の強化

```typescript
/**
 * アレルギー関連の禁忌タグとそのラベル
 * ⚠️ 重要: アレルギーは命に関わるため、表現は最大限強く明確に
 */
const ALLERGY_TAGS: Record<string, string> = {
  "allergy-prone": "アレルギー体質の方は、使用前に必ず医師にご相談ください",
  "shellfish-allergy": "貝アレルギーの方は絶対に使用しないでください",
  "soy-allergy": "大豆アレルギーの方は絶対に使用しないでください",
  "nut-allergy": "ナッツアレルギーの方は絶対に使用しないでください",
};
```

**変更のポイント**:
1. **統一性**: すべてに強い表現を使用
2. **明確性**: "絶対に"を追加（特定アレルギー）
3. **行動指示**: "必ず医師に相談"を明記（アレルギー体質）

---

### 修正2: UIメッセージの強化

#### 現在のUI
```tsx
<p className="font-semibold text-red-800 mb-1">
  {allergy.label}
</p>
<p className="text-sm text-gray-700">
  この商品には
  <span className="font-semibold text-red-700">
    {allergy.ingredientName}
  </span>
  が含まれています。
</p>
```

#### 推奨UI
```tsx
<div className="space-y-2">
  <p className="font-bold text-red-900 text-base">
    ⚠️ {allergy.label}
  </p>
  <p className="text-sm text-red-800 font-semibold">
    この商品には
    <span className="font-bold text-red-900 underline">
      {allergy.ingredientName}
    </span>
    が含まれています。
  </p>
  <p className="text-xs text-red-700 bg-red-100 p-2 rounded border border-red-300">
    💊 使用前に必ず医師または薬剤師にご相談ください
  </p>
</div>
```

**変更のポイント**:
1. ⚠️ 絵文字で視覚的に強調
2. フォントを太字に（font-semibold → font-bold）
3. 成分名に下線（underline）を追加
4. 各アレルギーに個別の医師相談メッセージを追加
5. 色をより濃く（text-red-800 → text-red-900）

---

### 修正3: 最下部の注意書きを最強調に

#### 現在
```tsx
<p className="text-xs text-red-800 mt-3 flex items-start gap-1">
  <span className="font-bold">⚠️</span>
  <span>
    アレルギーをお持ちの方は、使用前に必ず医師または薬剤師にご相談ください。
  </span>
</p>
```

#### 推奨
```tsx
<div className="mt-4 p-3 bg-red-100 border-2 border-red-600 rounded-lg">
  <p className="text-sm text-red-900 font-bold flex items-start gap-2">
    <span className="text-xl">🚨</span>
    <span>
      アレルギー反応は生命に関わる危険があります。
      この商品の使用前に必ず医師または薬剤師にご相談ください。
    </span>
  </p>
</div>
```

**変更のポイント**:
1. 背景色と枠線で目立たせる
2. "生命に関わる危険"を明記
3. 🚨絵文字で緊急性を強調
4. フォントサイズを大きく（text-xs → text-sm）
5. 太字で強調（font-bold）

---

## 📊 実際のデータとの整合性

### テスト結果
- ✅ コラーゲン: shellfish-allergy（貝アレルギー）
- ✅ グルコサミン: shellfish-allergy, diabetes（貝アレルギー、糖尿病）
- ✅ 6件の商品で正しく検出

### 検出ロジック
```typescript
function extractAllergyInfo(
  productIngredients: Product["ingredients"],
  allIngredients: Awaited<ReturnType<typeof getAllIngredients>>,
): Array<{ tag: string; label: string; ingredientName: string }> {
  // ✅ null/undefinedチェック
  if (!productIngredients || productIngredients.length === 0) {
    return [];
  }

  const allergyInfo: Array<{...}> = [];
  const seenTags = new Set<string>(); // ✅ 重複排除

  for (const prodIngredient of productIngredients) {
    if (!prodIngredient.ingredient?._id) continue; // ✅ 安全性チェック

    const ingredientDetail = allIngredients.find(...);
    if (!ingredientDetail?.contraindications) continue; // ✅ null安全

    for (const tag of ingredientDetail.contraindications) {
      if (ALLERGY_TAGS[tag] && !seenTags.has(tag)) { // ✅ 重複防止
        allergyInfo.push({...});
        seenTags.add(tag);
      }
    }
  }

  return allergyInfo;
}
```

✅ ロジックは完全に安全
✅ 重複が排除されている
✅ エッジケースに対応

---

## 🎯 推奨アクション

### 優先度：🔴 HIGH（即座に修正すべき）

1. **アレルギータグ定義の強化**
   - `ALLERGY_TAGS` の文言を強い表現に変更
   - 医師相談を明記

2. **UIメッセージの強化**
   - 各アレルギーに個別の医師相談メッセージ追加
   - 視覚的強調（太字、色、絵文字）

3. **最下部の注意書きを最強調**
   - "生命に関わる危険"を明記
   - 背景色・枠線で目立たせる

### 優先度：🟡 MEDIUM（余裕があれば）

4. **追加のアレルギータグの検討**
   - milk-allergy（乳アレルギー）
   - egg-allergy（卵アレルギー）
   - wheat-allergy（小麦アレルギー）
   - fish-allergy（魚アレルギー）

5. **アレルギー情報の構造化データ追加**
   - JSON-LDにアレルギー情報を含める
   - SEOとアクセシビリティ向上

---

## 📝 法的免責事項の確認

現在の免責事項は以下で十分か確認が必要：

### 商品詳細ページ
- ✅ アレルギーセクションに医師相談の推奨あり
- ⚠️ 法的責任範囲が明示されていない

### 推奨追加
サイトのフッターまたは利用規約に以下を追加：

```
本サイトのアレルギー情報は一般的な参考情報であり、
医学的アドバイスではありません。アレルギーをお持ちの方は、
本サイトの情報に依存せず、必ず医師または薬剤師に
ご相談の上、ご自身の判断でご使用ください。
```

---

## ✅ チェックリスト

- [x] アレルギータグの定義確認
- [x] Sanityスキーマとの一致性確認
- [x] 実際のデータでの動作確認
- [x] 抽出ロジックの安全性確認
- [x] 重複排除の確認
- [x] エッジケースの確認
- [ ] 表現の医学的正確性の強化（要修正）
- [ ] UIの視覚的強調の強化（要修正）
- [ ] 法的責任範囲の明確化（要追加）

---

## 🔒 最終推奨

**即座に修正すべき項目**:
1. アレルギータグの文言を強化
2. UIメッセージに個別の医師相談を追加
3. 最下部の注意書きを最強調

**理由**:
アレルギーは命に関わる。表記ミスや不十分な警告は、
法的責任問題だけでなく、ユーザーの生命に直結する。

---

**作成者**: Claude Code
**確認者**: （要確認）
**承認者**: （要承認）
