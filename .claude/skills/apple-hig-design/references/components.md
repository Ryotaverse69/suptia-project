# Components（コンポーネント）

## ボタン

### サイズ規定

| タイプ | 高さ        | パディング |
| ------ | ----------- | ---------- |
| Large  | 50px / 56px | 20px横     |
| Medium | 44px        | 16px横     |
| Small  | 34px        | 12px横     |

### 実装例

```jsx
// Primary Button（Apple風 rounded-full）
<button className="
  min-h-[56px] px-8
  bg-[#0071e3] hover:bg-[#0077ED]
  text-white text-[17px] font-semibold
  rounded-full
  transition-colors
">
  Primary Action
</button>

// Secondary Button
<button className="
  min-h-[44px] px-6
  bg-[#1d1d1f] hover:bg-[#333336]
  text-white text-[17px] font-semibold
  rounded-full
">
  Secondary
</button>

// Tertiary Button
<button className="
  min-h-[44px] px-6
  bg-transparent hover:bg-[#0071e3]/10
  text-[#0071e3] text-[17px] font-semibold
  rounded-full
">
  Learn more
</button>

// Destructive Button
<button className="
  h-[44px] px-4
  text-[#FF3B30] text-[17px] font-medium
">
  Delete
</button>
```

## Navigation Bar

### 標準サイズ

- 高さ: 44pt（コンテンツ領域）
- Large Title時: 96pt

```jsx
<header
  className="
  sticky top-0 z-50
  bg-white/80
  backdrop-blur-xl
  border-b border-black/5
"
>
  <div className="h-[44px] flex items-center justify-between px-4">
    <button className="text-[#007AFF] text-[17px]">Back</button>
    <h1 className="text-[17px] font-semibold text-[#1d1d1f]">Title</h1>
    <button className="text-[#007AFF] text-[17px]">Done</button>
  </div>
</header>
```

## Tab Bar

### 規定

- 高さ: 49pt（Safe Area除く）
- アイコン: 25x25pt
- ラベル: 10pt

```jsx
<nav
  className="
  fixed bottom-0 left-0 right-0
  pb-[env(safe-area-inset-bottom)]
  bg-white/80
  backdrop-blur-xl
  border-t border-black/5
"
>
  <div className="h-[49px] flex justify-around items-center">
    <button className="flex flex-col items-center gap-0.5">
      <Icon className="w-[25px] h-[25px] text-[#007AFF]" />
      <span className="text-[10px] text-[#007AFF]">Home</span>
    </button>
    <button className="flex flex-col items-center gap-0.5">
      <Icon className="w-[25px] h-[25px] text-[#86868b]" />
      <span className="text-[10px] text-[#86868b]">Search</span>
    </button>
  </div>
</nav>
```

## List / Table View

### セル高さ

| タイプ   | 高さ |
| -------- | ---- |
| Default  | 44pt |
| Subtitle | 58pt |
| Large    | 76pt |

```jsx
// Grouped List
<div className="mx-4 bg-white rounded-[10px] overflow-hidden border border-black/5">
  <div className="divide-y divide-black/5">
    <div className="h-[44px] flex items-center px-4 justify-between">
      <span className="text-[17px] text-[#1d1d1f]">Setting</span>
      <ChevronRight className="w-5 h-5 text-[#C7C7CC]" />
    </div>
    <div className="h-[44px] flex items-center px-4 justify-between">
      <span className="text-[17px] text-[#1d1d1f]">Notifications</span>
      <Toggle />
    </div>
  </div>
</div>

// Section Header
<p className="text-[13px] text-[#86868b] uppercase px-4 py-2 mt-6">
  General
</p>
```

## Card

```jsx
// Glass Card
<div className="
  p-6
  bg-white/80
  backdrop-blur-xl backdrop-saturate-150
  border border-black/5
  rounded-[20px]
  shadow-[0_8px_32px_rgba(0,0,0,0.06)]
">
  <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">Card Title</h3>
  <p className="text-[15px] text-[#86868b]">Card description</p>
</div>

// Simple Card
<div className="
  mx-4 p-4
  bg-white
  rounded-[16px]
  shadow-sm
">
  <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">Card Title</h3>
  <p className="text-[15px] text-[#86868b]">Card description</p>
</div>
```

## TextField / Input

### 規定

- 高さ: 44pt
- パディング: 16px
- 角丸: 10px

```jsx
<input
  type="text"
  placeholder="Search"
  className="
    h-[44px] w-full px-4
    bg-[#E5E5EA]
    text-[17px] text-[#1d1d1f] placeholder:text-[#86868b]
    rounded-[10px]
    focus:outline-none focus:ring-2 focus:ring-[#007AFF]
  "
/>

// Search Bar Style
<div className="relative mx-4">
  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b]" />
  <input
    type="search"
    placeholder="Search"
    className="
      h-[36px] w-full pl-10 pr-4
      bg-[#E5E5EA]/60
      text-[17px] rounded-[10px]
    "
  />
</div>
```

## Toggle / Switch

```jsx
<button
  role="switch"
  aria-checked="true"
  className="
    w-[51px] h-[31px]
    bg-[#34C759]
    rounded-full relative
    transition-colors
  "
>
  <span
    className="
    absolute top-[2px] right-[2px]
    w-[27px] h-[27px]
    bg-white rounded-full
    shadow-sm
    transition-transform
  "
  />
</button>
```

## Sheet / Modal

```jsx
// Bottom Sheet
<div className="
  fixed inset-x-0 bottom-0
  bg-white
  rounded-t-[12px]
  pb-[env(safe-area-inset-bottom)]
">
  {/* Drag Handle */}
  <div className="flex justify-center py-2">
    <div className="w-9 h-[5px] bg-[#C7C7CC] rounded-full" />
  </div>
  {/* Content */}
</div>

// Alert
<div className="
  w-[270px] p-4
  bg-white/90
  backdrop-blur-xl
  rounded-[14px]
  text-center
">
  <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-1">Title</h2>
  <p className="text-[13px] text-[#86868b] mb-4">Message</p>
  <div className="flex border-t border-black/10 -mx-4">
    <button className="flex-1 py-3 text-[#007AFF] text-[17px] border-r border-black/10">Cancel</button>
    <button className="flex-1 py-3 text-[#007AFF] text-[17px] font-semibold">OK</button>
  </div>
</div>
```

## Segmented Control

### 規定

- 高さ: 32pt
- セグメント最小幅: 44pt
- 角丸: 8pt（全体）、6pt（選択インジケーター）

```jsx
<div
  className="
  inline-flex p-[2px]
  bg-[#E5E5EA] rounded-[8px]
"
>
  <button
    className="
    px-4 h-[28px] min-w-[44px]
    text-[13px] font-medium
    text-white bg-white rounded-[6px]
    shadow-sm
  "
  >
    First
  </button>
  <button
    className="
    px-4 h-[28px] min-w-[44px]
    text-[13px] font-medium
    text-[#1d1d1f]
  "
  >
    Second
  </button>
  <button
    className="
    px-4 h-[28px] min-w-[44px]
    text-[13px] font-medium
    text-[#1d1d1f]
  "
  >
    Third
  </button>
</div>
```

## Action Sheet

### 規定

- アクション高さ: 57pt
- 角丸: 14pt
- キャンセルとの間隔: 8pt

```jsx
<div className="fixed inset-x-0 bottom-0 p-2 pb-[env(safe-area-inset-bottom)]">
  {/* Actions */}
  <div className="bg-white/90 backdrop-blur-xl rounded-[14px] overflow-hidden">
    <button
      className="
      w-full h-[57px]
      text-[#007AFF] text-[20px]
      border-b border-black/10
    "
    >
      Action 1
    </button>
    <button
      className="
      w-full h-[57px]
      text-[#FF3B30] text-[20px] font-medium
    "
    >
      Destructive Action
    </button>
  </div>

  {/* Cancel */}
  <div className="mt-2 bg-white rounded-[14px] overflow-hidden">
    <button
      className="
      w-full h-[57px]
      text-[#007AFF] text-[20px] font-semibold
    "
    >
      Cancel
    </button>
  </div>
</div>
```

## FAQ Accordion

```jsx
<div className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-[20px] px-6">
  <div className="border-b border-black/5">
    <button className="w-full flex items-center justify-between py-5 min-h-[56px]">
      <span className="text-[17px] font-semibold text-[#1d1d1f]">
        Question?
      </span>
      <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
        <ChevronDown className="w-4 h-4 text-[#86868b]" />
      </div>
    </button>
    <p className="text-[17px] text-[#86868b] pb-6">Answer text...</p>
  </div>
</div>
```

## Progress Indicator

### Spinner

```jsx
<div
  className="
  w-5 h-5
  border-2 border-[#007AFF]
  border-t-transparent
  rounded-full
  animate-spin
"
/>
```

### Progress Bar

```jsx
<div className="h-[4px] w-full bg-[#E5E5EA] rounded-full overflow-hidden">
  <div
    className="h-full bg-[#007AFF] rounded-full transition-all duration-300"
    style={{ width: "60%" }}
  />
</div>
```

## チェックリスト

- [ ] ボタンの最小高さは44ptか
- [ ] Navigation Barは44pt高か
- [ ] Tab Barは49pt高か（Safe Area除く）
- [ ] リストセルは44pt以上か
- [ ] Toggle/Switchは51×31ptか
- [ ] Segmented Controlは32pt高か
- [ ] Action Sheetアクションは57pt高か
