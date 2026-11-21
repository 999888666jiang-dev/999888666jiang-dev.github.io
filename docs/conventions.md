# conventions · 个人网站（v1）

> 继承 `E:\流程架构设计\docs\conventions.md` 的**工程纪律**（只读引用，不改该文件），不继承它的技术栈基线。
> 本文件是项目内约定；与《个人网站制作提示词.md》（**v1.3 定稿，以文件为准**）冲突时以提示词为准。

## 1. 文档与规则

- spec 是契约：只写规则与验收（先有什么 → 做什么 → 应该看到什么），不写伪代码/逐行实现。
- 每条规则 `R-xx` 从 `docs/spec-v1.md` → 任务 → 测试 → `docs/verification.md` 可追。
- 六阶段映射：需求/设计 = M0 文档；原型 = M2 真实帧样张 + 短滚动原型；编码 = M1、M3–M6；测试 = M2–M7 各轮；运行 = M7 线上验收。
- 一次只推进一个可独立验收的小步；上一步无实测证据不抛下一步（用户明确“先看效果”的 M1/M2 可连续做，但各自报告）。
- 文档名 = 真实文件名；命令、路径、版本号必须实测。
- 需要用户拍板时必须给「问题 + 2–3 方案 + 代价/风险 + 推荐 + 不回复时的默认值」（定稿提示词 §2-11 / §12-16）。
- 已拍板事项（Q1=B、Q2=根站点+公开）不再重问。

## 2. 技术栈（含偏离声明）

基线（主设计）：原生单文件 + FastAPI + SQLite 本机 demo。本项目不适用，改用：

| 偏离 | 内容 | 理由 |
| --- | --- | --- |
| **X-01** | Vite 8.3.8 构建的纯静态站；主叙事保持原生 DOM/CSS/JS；React 只做 `GooeyNav`、`Lanyard` 两个岛屿 | 两个 ReactBits 组件是 React（Lanyard 还依赖 three），与“单文件无构建”不可同时成立；禁止运行时 Babel / CDN / 整站 React |
| **X-02** | hero 从 23.167s 裁到 7.9s | 原片 8.000–23.133s 是纯黑场（blackdetect 实测），技术必要，不是审美选择 |
| **X-03** | 保留现有阴天校园素材（Q1=B），允许调整混合模式、文字色、调色、文案；**即用户拍板的 M3 方向 A = 验收文档中的方案 1**（白字实色 + 局部/渐变压暗，difference 只留暗部小面积） | 用户拍板 B；`difference` 白字在该素材上同屏对比度不稳定（实测天空 YAVG 215.8 / 路面 54.5） |
| **X-04** | 转码用 2-pass ABR + 轻度降噪（7.2M / 3.6M）满足体积预算 | 单遍 CRF 22 实测 17–19MB，超出 hero ≤8MB / reveal ≤4MB |
| **X-05** | 电影感三章之后接正常文档流简历/作品集区（参考原本“所有可见层 fixed”） | 承载真实简历与多个作品必须偏离；计划 M6 实施（本轮未做） |
| **X-06** | v1 不引入 WebCodecs/mp4box 帧库，hero 用原生 seek + 0.5s 短 GOP；移动端/低端走 poster + 原生 seek | 桌面实测 60fps、最大帧 33ms；帧库复杂度/兼容风险大于收益（D3 允许的降级路径） |
| **X-07** | reveal 循环处加 0.2s 压黑过渡（取代交叉淡化/硬切） | 交叉淡化实测双影、硬切有跳变；**M4 已实施**（200ms 保持 + 100ms 过渡；录屏与逐帧亮度见 verification §8.7.5） |

X-03 子项（必须在 `docs/decisions/decision-01.md` 与 `docs/verification.md` 同步记录）：

- X-03.1 主文字层改为白色实字（不用 `difference`）；`difference` 只允许暗部小面积装饰。
- X-03.2 画面上加局部压暗（scrim，约 0.2–0.6 的线性渐变），用于保证首屏可读性（D8 优先于“零 scrim”不变量）。

## 3. 媒体与产物

- 原始 4K 与参考 md **只读、不入库**；转码统一：`-an`、`+faststart`、H.264、yuv420p、1080p。
- hero：裁 0–7.9s、短 GOP（`-g 15`）；reveal：8.021s、GOP 1s；两者均 2-pass ABR（7.2M / 3.6M）+ 轻度降噪，以满足 ≤8MB / ≤4MB（**X-04**）。
- poster 必须取 0–7.9s 内实拍帧（当前 t=2s），不得取自黑场；≤300KB。
- `dist/` 不入库；`public/media/` 入库；`docs/verification/` 存小体积证据（jpg）。

## 4. 目录与命令

```text
AGENTS.md / README.md / index.html / package.json / vite.config.js
src/content/site-content.js     # 单一内容源（R-17）
src/styles/site.css / src/main.js
public/{favicon.svg,robots.txt,media/}
prototype/{scroll-prototype.html,samples/}
docs/{conventions.md,spec-v1.md,plan-v1.md,content-placeholders.md,verification.md,verification/m2/,decisions/decision-01.md}
.github/workflows/deploy.yml
```

```powershell
npm install        # 缓存重定向 .npm-cache（不写 C 盘缓存）
npm run dev        # http://127.0.0.1:5173/
npm run build      # dist/
npm run preview    # http://127.0.0.1:5174/
```

## 5. 工作协议

- 只读写 `E:\个人网站面试版`；不跨项目；不改 `E:\流程架构设计`。
- 改代码前声明文件；不擅自重写没让改的部分。
- C 盘写入（TEMP 抽帧、浏览器内核、全局依赖）必须先说明；证据一律放项目内。
- 不装全局依赖、不杀用户正在用的应用、不改 C 盘系统配置。
- 未验收前保持 `noindex`；只有用户明确说“确认发布”才建公开仓库/推送/移除 noindex。
