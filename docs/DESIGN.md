---
version: "1.0"
status: "m11.1e"
updated: "2026-11-23"
owner: "姜睿 / yunyanfpv.cn"
principle: "深色产品 + 电影感 signature；单 UI 强调色；不新增字体/依赖"
fonts:
  display: "\"Instrument Serif\", \"Noto Serif SC\", Georgia, serif"
  sans: "Inter, \"PingFang SC\", \"Microsoft YaHei\", system-ui, -apple-system, sans-serif"
  mono: "\"JetBrains Mono\", \"SFMono-Regular\", Consolas, monospace"
colors:
  canvas: "#0a0b0c"
  surface-1: "#101316"
  surface-2: "#161a1e"
  surface-3: "#1d2227"
  ink: "#f4f6f7"
  muted: "#b9c1c8"
  subtle: "#8f9ba3"
  hairline: "rgba(255,255,255,.12)"
  primary: "#e8ecef"
  on-primary: "#0a0b0c"
  success: "#7ed6a5"
  warning: "#e8c07a"
  danger: "#e88a8a"
  info: "#8fb6dc"
typography:
  hero-display: { size: "clamp(42px, 8.2vw, 160px)", line: "1.04", tracking: "-0.01em", weight: "400" }
  display: { size: "clamp(34px, 5.6vw, 68px)", line: "1.08", tracking: "0", weight: "400" }
  title: { size: "clamp(26px, 3.6vw, 40px)", line: "1.1", tracking: "0", weight: "400" }
  heading: { size: "clamp(20px, 1.8vw, 24px)", line: "1.2", tracking: "0", weight: "500" }
  body: { size: "16px", line: "1.7", tracking: "0", weight: "400" }
  body-sm: { size: "14px", line: "1.6", tracking: "0", weight: "400" }
  caption: { size: "12px", line: "1.5", tracking: "0.02em", weight: "400" }
space: { "0": "0", "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "24px", "6": "32px", "7": "48px", "8": "64px", "9": "96px", "20": "20px", "28": "28px" }
radius: { sm: "8px", md: "12px", lg: "16px", pill: "999px" }
z-index:
  media: "0"
  petals: "1"
  content: "2"
  particles: "3"
  cards: "4"
  reveal: "5"
  scrim: "6"
  lanyard: "7"
  narrative: "8"
  frame: "9"
  nav: "10"
  overlay: "500"
  modal: "1000"
  toast: "2000"
motion: { fast: "120ms", base: "180ms", slow: "240ms", slower: "320ms", easing: "cubic-bezier(.16,1,.3,1)" }
breakpoints: { mobile: "375px", tablet: "768px", narrow: "899px", desktop: "1280px", wide: "1440px" }
---

# DESIGN.md · 个人网站视觉与设计系统

> 本文件是设计的**单一真源**：颜色、字体、间距、圆角、层级、动效、组件都以 token 为准。
> 代码中禁止出现未登记的裸色值/裸间距；新增样式必须引用本文件 token。
> 施工顺序：M11.0 本文档 → M11.1 P0（字号/focus/token/灰阶/局部底）→ M11.2 P1（组件）→ M11.3 P2（动效收尾）。

## 1. Overview · 定调与原则

- **调性**：深色产品（Dark Product）+ 电影感（cinematic signature）。背景影像负责氛围，内容层负责可读性。
- **强调色**：UI 只保留 off-white 主按钮（`primary`/`on-primary`）+ 语义色（success/warning/danger/info）；不引入第二个品牌色。
- **字体**：不新增外部字体/CDN；自托管 Instrument Serif + Inter，中文回退 Noto Serif SC / PingFang SC / 微软雅黑；中文标题不做负字距，全大写拉丁 +0.08em。
- **可读性优先**：正文 ≥4.5:1、大字/UI ≥3:1、focus ring ≥3:1，按最亮帧实测；不达标先加局部卡底/局部 scrim，不整页压暗。
- **动效**：只动 `opacity`/`transform`；reduced-motion 全静态；单主 rAF，30fps 节流；离屏 cancel。
- **边界**：不改轮播/详情/Lanyard/滚动叙事/粒子/花瓣交互；**移动视频保留 hero+reveal，不 poster-only、不压缩**；首屏（载入到 window.load 且未滚动）仅 hero.mp4 一条、实际传输 ≤7.0MB（文件 6.85MB 仅登记）；reveal.mp4 不属首屏（滚到 reveal 前才请求、单文件 ≤4.0MB）；hero+reveal 两文件合计 ≤11.0MB（仅登记）；无其他首屏 mp4；reduced/无 JS 用 poster；详情区背景仍按 M10E 断点（≤600 poster / 601–899 lite / ≥900 full），不混主页预算；FPS≥55、CLS≤0.1；`noindex` 保持到用户确认发布。

## 2. Colors · 颜色

基础色（全部登记于 frontmatter `colors`）：

| Token | 值 | 用途 |
| --- | --- | --- |
| canvas | #0a0b0c | 页面底、视频/花瓣层底色 |
| surface-1 | #101316 | 卡片底、输入区 |
| surface-2 | #161a1e | 悬浮卡、次级容器 |
| surface-3 | #1d2227 | 高亮容器、代码块 |
| ink | #f4f6f7 | 主文字、标题 |
| muted | #b9c1c8 | 正文、说明 |
| subtle | #8f9ba3 | 元信息、mono 小标（UI 用途，需 ≥3:1） |
| hairline | rgba(255,255,255,.12) | 1px 分割线/描边 |
| primary | #e8ecef | 主按钮底 |
| on-primary | #0a0b0c | 主按钮文字 |

语义色独立：`success #7ed6a5`、`warning #e8c07a`、`danger #e88a8a`、`info #8fb6dc`，只用于状态/提示，不用于正文。

**使用规则**

- 正文/标题只用 `ink`/`muted`；`subtle` 仅限 mono 小标、时间、编号等 UI 文本（≥3:1）。
- 卡片底用 `surface-1/2` 或 `rgba(5,7,8,.55)` 局部底；禁止在黑底上直接放 14px 以下灰字。
- 局部底：文字列/卡加横向渐变到透明的 scrim（`rgba(5,7,8,.55)` 起，不足调 `.58/.62`）。
- 玻璃卡：`backdrop-filter: blur(10px)` + `surface-2` 半透明；正文不依赖玻璃对比度，必须有实底。
- **落地（M11.1d）**：`site.css` + 4 个 islands CSS 的颜色/间距/圆角/z-index 全部 token 化；token 定义行之外的裸色、裸间距、裸圆角、裸层级 = **0**（Node 审计，见 verification §8.26）。灰阶只用 4 档：`ink`（主）/`muted`（次）/`subtle`（UI 弱）/`canvas+surface-1..3`（底）。
- **alpha 值**：半透明遮罩/局部底统一写 `color-mix(in srgb, var(--color-*) P%, transparent)`（与原 `rgba(...)` 等值）；M10D 局部底裁定值登记为 `overlay.scrim-detail` + alpha（.55 起，不足调 .58/.62）。
- **遮罩/纹理 token（登记，非第五档灰）**：`overlay.black/white`、`scrim-detail #050708`、`scrim-doc #060708`、`scrim-video #080a0c`、`scrim-panel #0a0c0e`、`sheet #08090a`；Lanyard 金属扣 `texture.metal-*` 5 值（组件纹理，不改视觉）。

**验收**：正文 ≥4.5:1、大字/UI ≥3:1、focus ring ≥3:1；最亮帧采样（详情 p=0–.25、首页 hero 首帧）。

## 3. Typography · 字体 7 级

| 角色 | 字号 | 行高 | 字距 | 用途 | 1440 / 375 实测 |
| --- | --- | --- | --- | --- | --- |
| hero-display | clamp(42px, 8.2vw, 160px) | 1.04 | -0.01em | 首屏品牌字（拉丁） | 118.08 / 42 |
| display | clamp(34px, 5.6vw, 68px) | 1.08 | 0 | 章节标题、三章陈述句 | 68 / 34 |
| title | clamp(26px, 3.6vw, 40px) | 1.1 | 0 | mission/contact 陈述、大标题变体 | 40 / 26 |
| heading | clamp(20px, 1.8vw, 24px) | 1.2 | 0 | 卡片标题、公司名、弹层标题 | 24 / 20 |
| body | 16px | 1.7 | 0 | 正文/说明 | 16 / 16 |
| body-sm | 14px | 1.6 | 0 | 次要说明、tagline、卡片要点 | 14 / 14 |
| caption | 12px | 1.5 | 0.02em | 元信息、日期、脚注、mono 小标 | 12 / 12 |

**规则**

- 全站无 <12px 文本；正文固定 16/1.7。
- 中文标题不做负字距（`-0.01em` 只给拉丁 hero-display）；
- 字体栈加 `system-ui` 兜底；不新增字体文件/依赖。
- 大字数重量：标题 400（Instrument Serif）/500（Inter），正文 400；不合成粗体。
- **落地（M11.1d / v5.2）**：字号硬收敛 **7 角色**——所有 `font-size` 声明只允许 `var(--fs-hero-display|display|title|heading|body|body-sm|caption)`；clamp 的 min/max 已归入角色边界；**mono 只作为字体家族**（`--font-mono`），不再有第 8 个字号档。grep 实测：声明档数 **7**；375 与 1440 computed 去重均 **7**（`[12,14,16,20,26,34,42]` / `[12,14,16,24,40,68,118.08]`），无 11px。
- **原值映射（v5.2）**：118→hero-display；68→display；40/38/34→title；26→title min；24/22→heading；16/14/12 不变。旧 token `--fs-display/--fs-statement/--fs-cap/--fs-micro/--fs-lede/--display-xl/--fs-mono` 已删除。
- **motion token**：过渡/动画时长只用 `--dur-fast 120ms / --dur-base 180ms / --dur-slow 240ms / --dur-slower 320ms`（28 处裸时长已映射；仅 0ms 保留）；缓动 `cubic-bezier(.16,1,.3,1)` → `var(--ease-expo)`。
- 移动端回落：`.brand__cap` ≤767 → caption；`.lede` 与 narrative `.s3-note` ≤767 → body（中文正文 16/1.7 保持）。

## 4. Layout · 布局与间距

- 栅格（M11.2）：内容最大宽 **1200px**（`--content-w`）、阅读列 **720px**（`--read-w`）；章节节奏 `--section-gap: var(--space-9)`（≤899 为 space-8、≤640 为 space-7，均 4 倍数）；移动内边距 20–24px，桌面 6vw 或 64px。
- 间距（v5.3 裁定）：`margin/padding/gap` 一律 `var(--space-*)`；非 4 倍数按「**最近 4 倍数、半数向上**」收敛：`6→8、10→12、14→16、18→20、22→24、26→28`。允许集合 **4/8/12/16/20/24/28/32/48/64/96**；其中 **20/28 是 4-grid 例外（非 8-grid），登记为合法 token**（`--space-20`/`--space-28`）。禁止裸 6/10/14/18/22/26。
- 相对单位（em/vh/%）与负偏移保留（属于排版/布局相对量，不是间距 token）。
- 章节结构：kicker（mono）→ 标题（section）→ 内容；章节间距 ≥64px。
- 卡片网格：桌面 3 列（≥1200 允许 4 列/2×2 视内容），768 2×2，移动 1 列；**等高**。
- 技能卡（M11.1d/v5.2）：≥1200 **4 列**、768 2×2、≤640 1 列；`grid-auto-rows:1fr` 保证等高，卡内 padding **24px**（`--space-5`）；1440 不再单卡落单。
- 固定/粘性层不占内容高度；`position:fixed` 层必须 `pointer-events:none`（交互层单独设）。
- 详情页背景层不参与布局；花瓣/粒子层永远在文字之下（z 见第 6 章）。

## 5. Elevation · 层级与阴影

- 阴影只用于模态/悬浮：`0 24px 80px rgba(0,0,0,.45)`；静态卡不加大阴影。
- 玻璃卡阴影：`0 8px 32px rgba(0,0,0,.25)` + hairline 描边。
- **全局档（v5.3）**：`0` 背景 / `10` 导航 / `500` 覆盖·遮罩 / `1000` 模态 / `2000` toast·skip。
- **detail compositing band 0–9（例外，顺序固定）**：`--z-media 0`（detail-bg/video）→ `--z-petals 1` → `--z-content 2`（content-flow）→ `--z-particles 3` → `--z-cards 4`（fixed-cards）→ `--z-reveal 5` → `--z-scrim 6` → `--z-lanyard 7` → `--z-narrative 8` → `--z-frame 9` → `--z-nav 10`（导航/时钟）；**花瓣永远在内容（文字）下；模态永远在导航上**。
- **局部 stacking context（用字面值，不映射全局 token）**：Lanyard 内部 card `2` / strap `3` / clip `4` / hit `5`（宿主 `.lanyard-layer` 为 band 7）；ReflectiveCard 内部 `1`/`2`。
- 旧 `.bloom-act`/`.cards-trigger` 等 z 已并入 band token；`40/41/55/60/99` 等散落值全部删除；遮挡层 `--z-overlay 500`、模态 `--z-modal 1000`、skip/toast `--z-toast 2000`。

## 6. Shapes · 圆角与描边

- 圆角：`8px`（小控件/标签）、`12px`（卡片）、`16px`（大卡/模态）、`pill`（按钮/标签）。
- 描边：1px `hairline`；focus 可见时 2px `ink` 环 + 2px offset（见 Components）。
- 头像/图标容器用 pill 或 12px；不混用 6px/10px 等非 token 值。
- **落地（M11.1d）**：`border-radius` 全站（含 islands）只用 `sm/md/lg/pill`；圆形用 `--radius-round: 50%`（CTA/头像点）。
- 分区线用 1px hairline，不用阴影做分割。
- **层级约束（v5.3）**：detail compositing band `0–9` 顺序固定（见 §5），新层不得插在 petals 与 content 之间造成翻层；模态永远在导航上。

## 7. Components · 组件清单（≥10）

1. **TopNav**（`nav`）：玻璃 pill 容器 + 当前项 off-white 实底；`aria-current`；hover 120ms。
2. **GooeyNav**（React 岛）：canvas 2D 粒子；静态回退为 TopNav；`--z-nav`（10）。
3. **Hero**（电影感三章）：视频背景 + 品牌字 + 章节说明；文字必须局部底；hero 视频 brightness 1.18/scrim .78。
4. **SectionHeader**：mono kicker + section 标题 + hairline 分隔；编号 01–05 用 CSS counter。
5. **GlassCard**：`surface-2` 半透明 + blur(10px) + hairline；正文必须 ≥4.5:1。
6. **ExpCard / HonorCard（M11.2 统一卡片）**：经验与荣誉/证书共用同一卡片组件——padding **24px**、圆角 **12px**、`--color-sheet` 90%（color-mix）+ hairline；experience 单一 3 卡 grid（移动 1 列），honors 为荣誉+证书同一列表 7 卡（auto-fit，≥1200 4 列）；hover 120ms + `translateY(-1px)`、active、focus-visible（2px ring）；卡片标题 heading、正文 body-sm、meta caption/mono。
7. **ProjectCard**：静态项目卡 + 技术栈 tag pill + 详情按钮；hover 120ms + translateY(-1px)。
8. **CircularGallery**：3D 轮播岛；键盘 Enter/Space 开卡；离开视口暂停 autoScroll。
9. **DetailModal**（ReflectiveCard）：遮罩 `--z-overlay`（500）/ 面板 `--z-modal`（1000）；遮罩点击/关闭/Esc/返回四路径；关闭恢复 scrollY±2；焦点回 `.circular-gallery`。
10. **ContactCard**：邮箱/GitHub 按钮 + 联系说明；按钮 ≥4.5:1；不出现手机号。
11. **ButtonPrimary**：`primary` 底 + `on-primary` 文字 + pill；hover 亮度 +8%，focus ring 2px。
12. **Pill/Tag**：mono caption + hairline 描边 + 8px 圆角；可交互时 focus ring。
13. **FocusRing**：`:focus-visible` 2px `ink` ring + offset 2px；任何可交互元素必须有可见焦点。
14. **MediaScrim**：视频/图片上的局部底（线性 + 径向），保证文字 AA；不整屏压暗。

## 8. Do's · 可以做 / 不要做

**Do**

- 先读本文件 token，再写样式；新增 token 必须登记本文件。
- 文字压在影像上时加局部底；对比度按最亮帧实测，不靠猜。
- 动效只动 opacity/transform；reduced-motion 全静态；离屏 cancel rAF。
- 交互元素有 hover/focus/active/disabled 四态；focus 必须可见。
- 四视口（375/768/1280/1440）与 200% 缩放验收；无横向溢出。

**Don't**

- 不新增字体/CDN/依赖；不引入第二个 UI 强调色。
- 不用 <12px 正文；不给中文标题负字距。
- 不用整页压暗换 AA；不把 fixed/sticky 层塞进内容流占位。
- 不在 `scroll` 回调里读布局；不在每帧重画路径/阴影。
- 不改 `noindex`（等用户确认发布）、不把手机号写进源码/文档。

## 9. Responsive · 响应式与降级

| 断点 | 布局 | 组件调整 |
| --- | --- | --- |
| ≥1280 | 内容 1200，3–4 列 | 完整动效/轮播/花瓣 |
| 900–1279 | 内容 100% 96vw，2–3 列 | 完整动效 |
| 768–899 | 2×2 卡 | 简化动效；花瓣/视频按既有规则 |
| ≤767 | 1 列，内边距 20–24 | 详情区按 M10E 断点；hero/reveal 主叙事视频保留（不 poster-only、不压缩），reduced/无 JS 用 poster |

- `pointer:coarse` 与 `prefers-reduced-motion: reduce` 视为降级：不初始化 canvas/video 动画，只保留 poster + 静态五段。
- 无 JS：noscript 兜底 poster + 文案，500vh 类滚动区收起为普通高度，不制造空白滚动。
- 移动端禁止横向滚动；导航/轮播/详情/联系可点击。

## 10. Iteration · 迭代与验收

- **M11.0（本文档）**：只出 DESIGN.md，不改样式。验收：YAML 可解析、8 章齐、token 表完整、components ≥10、无散落裸色值（颜色集中在 Colors 章）。
- **M11.1 P0**：字号收敛 7 级（正文 16/1.7、无 <12px、中文无负字距、system-ui）、`:focus-visible` 2px+offset2、颜色/间距/圆角/z-index 走 token、灰阶收敛 4 档、文字列局部底 AA；清理 `index.html` 字面量 `\n`；OG/canonical 改 `https://yunyanfpv.cn/`。
  - **进度（2026-11-23，M11.1c）**：site.css 颜色/间距/圆角 token 化（98/54/27 处）；灰阶收敛 4 档；字号下限 12px、正文 16/1.7、中文 tracking ≥ -0.01em；`:focus-visible` 2px+2px；AA 复测 p95：正文 ≥6.74、大字 ≥5.93（品牌字 p95）、hero caption 4.28→5.39（局部暗光晕，不改布局/不整页压暗）、focus ring 11.76；技能 4 卡 4/2/1 列等高；`index.html` 字面量 `\n` 清理、canonical/og 统一 yunyanfpv.cn（含运行时 `site-content.js`，修 main.js 覆盖回 github.io）；修复 `lastFlight` 未声明导致 strict-mode ReferenceError（M10 遗留）。
  - **已解决（M11.1e/M11.1f）**：字号 7 档（computed 去重 7）；islands CSS 全量 token；z-index v5.3 裁定落地（§5）；非 4 倍数间距 v5.3 收敛（§4）。残留：轮播运行时内联字号与 Lanyard/Reflective 局部 stacking context 按边界保留。
- **M11.1d（B 批次，v5.2 终版规格，2026-11-23）**：7 角色字号（hero-display/display/title/heading/body/body-sm/caption，1440≈118/68/40/24/16/14/12）；颜色/间距/圆角/z-index/motion 全量 token（裸值 0）；灰阶 4 档；技能卡 4/2/1 等高、padding 24；AA 复测通过（1440 正文 p95 ≥6.71、375 ≥5.43；大字 ≥15.57；focus ring 12.2）；**移动视频保留 hero+reveal（v5.4 口径）**：首屏仅 hero.mp4 一条、传输 ≤7.0MB；reveal.mp4 非首屏、单文件 ≤4.0MB；两文件合计 ≤11.0MB（登记）；reduced/无 JS 用 poster；详情区按 M10E 断点。
  - 实测（v5.4，375 冷启动不滚动）：首屏仅 hero.mp4 一条（load 前已传 0.5MB、完整传输 6.85MB，≤7.0MB；文件 6.85MB 登记）；reveal.mp4 于滚动至 1400px（reveal 段）才请求（传输 3.34MB，≤4.0MB）；两文件合计 10.19MB（≤11.0MB，仅登记）；无其他首屏 mp4；reduced/no-JS 0 条 mp4（poster）。
- **M11.1e（7 角色锁定映射收尾，2026-11-23）**：字号与提示词助手锁定表逐项对齐（见 §3）：`--fs-hero-display/display/title/heading/body/body-sm/caption`；118→hero-display、68→display、40/38/34→title、26→title min、24/22→heading；mono 仅字体家族（无第 8 档）。375/1440 computed 去重均 **7**（`[12,14,16,20,26,34,42]` / `[12,14,16,24,40,68,118.08]`），无 <12px，正文 16/1.7。islands（gooey-nav/lanyard/circular-gallery/reflective-card）颜色/圆角/间距已 token 化，仅替换原值（`reflective-card` badge 6px gap 用 calc 精确保留 6px）。
  - **v5.3 已裁定并落地（M11.1f）**：z-index 按「全局档 0/10/500/1000/2000 + detail compositing band 0–9」重映射（见 §5），Lanyard/ReflectiveCard 内部局部 stacking context 保留字面值；旧 40/41/55/60/99 与 bloom-act 散落值删除。非 4 倍数间距按「最近 4 倍数、半数向上」收敛（6→8/10→12/14→16/18→20/22→24/26→28，20/28 登记 4-grid 例外），详见 §4。
- **M10G（花瓣收口，v5.5）**：保留 28 径向扇区；fragment 预渲染时加 **1.35px 高斯羽化** + 相邻扇区重叠 **1.75°**（运行时不 blur）；飞行单碎片 alpha `t=0 .22 → t≥.9 .90 → 落位 .92–.96`，拖尾 .06/.03；生命周期用**不 clamp 的 qRaw**：`fadeOut = 1 - smoothstep(1.0,1.3,qRaw)`、`flowerAlpha = 0.78 * fadeOut`，`qRaw ≥ 1.3` 清空 canvas 且停止绘制，回滚 <1.3 重出无残影；花 `--z-petals`(1)、内容 `--z-content`(2)；移动/ reduced /无 JS 不画。
- **M11.2 P1（已落地）**：experience/honors 各统一为一种卡片组件（experience 3 卡单组件、honors 荣誉+证书同一列表 7 卡）；内容 1200/阅读 720；卡 padding 24/圆角 12（pill 除外）/tag pill；hover 120ms + `translateY(-1px)`、active、focus-visible、disabled 四态；触控目标 移动 ≥44px / 桌面 ≥32px；chapter 节奏 `--section-gap` token 化。未动轮播/详情卡/Lanyard/滚动叙事/粒子/花瓣。
- **M11.3 P2**：动效 token 分档、z-index/阴影收敛、图标 16/20/24、数字 tabular、375/768/1280 + 200% 缩放、死 token 清零、渐变/噪点限量。
- **每轮验收**：build + 404；四视口截图（无溢出/截断）；CLS≤0.1、FPS≥55；**首屏仅 hero.mp4 一条、实际传输 ≤7.0MB；reveal 非首屏、单文件 ≤4.0MB；两文件合计 ≤11.0MB（登记）；无其他首屏 mp4**；0 外部请求、0 console error；AA 数值（正文≥4.5、大字/UI≥3、focus ring≥3）；7 角色 token（375/1440 computed 去重 ≤7、无 11px）；技能卡不落单；详情四路径 + 键盘回归；`noindex` 保持。
