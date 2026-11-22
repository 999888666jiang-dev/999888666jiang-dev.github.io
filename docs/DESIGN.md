---
version: "1.0"
status: "draft-m11.0"
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
  hero-display: { size: "clamp(44px, 7vw, 96px)", line: "1.04", tracking: "-0.01em", weight: "400" }
  section: { size: "clamp(34px, 4.6vw, 64px)", line: "1.08", tracking: "0", weight: "400" }
  heading: { size: "clamp(22px, 2vw, 30px)", line: "1.2", tracking: "0", weight: "500" }
  body: { size: "16px", line: "1.7", tracking: "0", weight: "400" }
  body-sm: { size: "14px", line: "1.6", tracking: "0", weight: "400" }
  caption: { size: "12px", line: "1.5", tracking: "0.02em", weight: "400" }
  mono: { size: "12px", line: "1.5", tracking: "0.08em", weight: "400" }
space: { "0": "0", "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "24px", "6": "32px", "7": "48px", "8": "64px", "9": "96px" }
radius: { sm: "8px", md: "12px", lg: "16px", pill: "999px" }
z-index: { base: "0", content: "10", overlay: "100", modal: "500", nav: "1000" }
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
- **边界**：不改轮播/详情/Lanyard/滚动叙事/粒子/花瓣交互；首屏 0 mp4、FPS≥55、CLS≤0.1；`noindex` 保持到用户确认发布。

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

**验收**：正文 ≥4.5:1、大字/UI ≥3:1、focus ring ≥3:1；最亮帧采样（详情 p=0–.25、首页 hero 首帧）。

## 3. Typography · 字体 7 级

| 级别 | 字号 | 行高 | 字距 | 用途 |
| --- | --- | --- | --- | --- |
| hero-display | clamp(44px, 7vw, 96px) | 1.04 | -0.01em | 首屏品牌字/章节大标题（拉丁） |
| section | clamp(34px, 4.6vw, 64px) | 1.08 | 0 | 章节标题（关于/经历/作品/荣誉/联系） |
| heading | clamp(22px, 2vw, 30px) | 1.2 | 0 | 卡片标题、公司名 |
| body | 16px | 1.7 | 0 | 正文/说明（**M11.1 P0 落地点**） |
| body-sm | 14px | 1.6 | 0 | 次要说明、卡片要点 |
| caption | 12px | 1.5 | 0.02em | 元信息、日期、脚注 |
| mono | 12px | 1.5 | 0.08em | 编号、kicker、技术栈（全大写时 +0.08em） |

**规则**

- 全站无 <12px 文本；正文固定 16/1.7。
- 中文标题不做负字距（`-0.01em` 只给拉丁 hero-display）；
- 字体栈加 `system-ui` 兜底；不新增字体文件/依赖。
- 大字数重量：标题 400（Instrument Serif）/500（Inter），正文 400；不合成粗体。

## 4. Layout · 布局与间距

- 栅格：内容最大宽 **1200px**；阅读列 **720px**；移动内边距 20–24px，桌面 6vw 或 64px。
- 间距只取 4 的倍数：`0/4/8/12/16/24/32/48/64/96`（token `space.0–9`）。
- 章节结构：kicker（mono）→ 标题（section）→ 内容；章节间距 ≥64px。
- 卡片网格：桌面 3 列（≥1200 允许 4 列/2×2 视内容），768 2×2，移动 1 列；**等高**。
- 固定/粘性层不占内容高度；`position:fixed` 层必须 `pointer-events:none`（交互层单独设）。
- 详情页背景层不参与布局；花瓣/粒子层永远在文字之下（z 见第 6 章）。

## 5. Elevation · 层级与阴影

- 阴影只用于模态/悬浮：`0 24px 80px rgba(0,0,0,.45)`；静态卡不加大阴影。
- 玻璃卡阴影：`0 8px 32px rgba(0,0,0,.25)` + hairline 描边。
- 层级（token `z-index`）：背景 0 → 内容 10 → 覆盖/花瓣/粒子 100 → 模态 500 → 导航 1000。
- 花瓣 z1、内容 z2、粒子 z3、fixed cards z4、导航更高（与 M9/M10 实现一致）。

## 6. Shapes · 圆角与描边

- 圆角：`8px`（小控件/标签）、`12px`（卡片）、`16px`（大卡/模态）、`pill`（按钮/标签）。
- 描边：1px `hairline`；focus 可见时 2px `ink` 环 + 2px offset（见 Components）。
- 头像/图标容器用 pill 或 12px；不混用 6px/10px 等非 token 值。
- 分区线用 1px hairline，不用阴影做分割。

## 7. Components · 组件清单（≥10）

1. **TopNav**（`nav`）：玻璃 pill 容器 + 当前项 off-white 实底；`aria-current`；hover 120ms。
2. **GooeyNav**（React 岛）：canvas 2D 粒子；静态回退为 TopNav；z 1000。
3. **Hero**（电影感三章）：视频背景 + 品牌字 + 章节说明；文字必须局部底；hero 视频 brightness 1.18/scrim .78。
4. **SectionHeader**：mono kicker + section 标题 + hairline 分隔；编号 01–05 用 CSS counter。
5. **GlassCard**：`surface-2` 半透明 + blur(10px) + hairline；正文必须 ≥4.5:1。
6. **ExpCard**：公司/日期/角色/要点；桌面 3 列 grid、移动 1 列、实底 `rgba(8,9,10,.90)`。
7. **ProjectCard**：静态项目卡 + 技术栈 tag pill + 详情按钮；hover 120ms + translateY(-1px)。
8. **CircularGallery**：3D 轮播岛；键盘 Enter/Space 开卡；离开视口暂停 autoScroll。
9. **DetailModal**（ReflectiveCard）：模态 z500；遮罩点击/关闭/Esc/返回四路径；关闭恢复 scrollY±2；焦点回 `.circular-gallery`。
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
| ≤767 | 1 列，内边距 20–24 | 只 poster + 静态内容；不加载视频/花瓣/粒子 |

- `pointer:coarse` 与 `prefers-reduced-motion: reduce` 视为降级：不初始化 canvas/video 动画，只保留 poster + 静态五段。
- 无 JS：noscript 兜底 poster + 文案，500vh 类滚动区收起为普通高度，不制造空白滚动。
- 移动端禁止横向滚动；导航/轮播/详情/联系可点击。

## 10. Iteration · 迭代与验收

- **M11.0（本文档）**：只出 DESIGN.md，不改样式。验收：YAML 可解析、8 章齐、token 表完整、components ≥10、无散落裸色值（颜色集中在 Colors 章）。
- **M11.1 P0**：字号收敛 7 级（正文 16/1.7、无 <12px、中文无负字距、system-ui）、`:focus-visible` 2px+offset2、颜色/间距/圆角/z-index 走 token、灰阶收敛 4 档、文字列局部底 AA；清理 `index.html` 字面量 `\n`；OG/canonical 改 `https://yunyanfpv.cn/`。
- **M11.2 P1**：技能 4 卡（≥1200 4 列或 2×2、768 2×2、移动 1 列、等高）、experience/honors 统一组件、卡 padding 24/圆角 12/tag pill、间距 4 倍数、内容 1200/阅读 720、hover 120ms + -1px、四态。
- **M11.3 P2**：动效 token 分档、z-index/阴影收敛、图标 16/20/24、数字 tabular、375/768/1280 + 200% 缩放、死 token 清零、渐变/噪点限量。
- **每轮验收**：build + 404；四视口截图（无溢出/截断）；CLS≤0.1、FPS≥55、首屏 0 mp4、0 外部请求、0 console error；AA 数值（正文≥4.5、大字/UI≥3、focus ring≥3）；详情四路径 + 键盘回归；`noindex` 保持。
