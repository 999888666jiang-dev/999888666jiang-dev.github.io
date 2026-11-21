# spec-v1 · 个人面试网站（v1 视觉与交互）

> 契约文件：只写规则与验收。状态项以 `docs/verification.md` 实测为准。
> Q1/Q2 已拍板（B 保素材；根站点 + 公开仓库），无待确认问题。

## 1. 范围

- 单页个人面试站：滚动叙事（fixed layers / runways / diagonal reveal / 三章节 / difference 文本层 / GSAP 开场 / 响应式 / reduced-motion）+ `GooeyNav` 导航 + 首页右侧 `Lanyard`。
- 内容全部占位，集中在 `src/content/site-content.js`；v1 不接后端/数据库/统计。
- 部署：GitHub Pages 根站点 `https://999888666jiang-dev.github.io/`；首版 `noindex`，验收前不分享。

## 2. 非目标（v1 不做）

多页路由、作品列表页、简历时间线、多语言、博客/CMS、后端、登录、评论、第三方追踪、自定义域名、运行时 Babel、第三方 CDN 主路径、全局依赖。

## 3. 验收规则（R-01…R-25）

| 编号 | 规则 | 验收场景（先有什么 → 做什么 → 应该看到什么） |
| --- | --- | --- |
| R-01 | 参考只读 | 开工前有 5 个文件 SHA-256 基线 → 每轮复核 → 全部 MATCH，`git status` 无对它们的修改 |
| R-02 | 项目边界 | 只写项目目录 → 检查文件清单与命令 → 无 `E:\流程架构设计`/C 盘配置/其它项目的改动 |
| R-03 | 单页结构 | 打开根 URL → 刷新、分享同一 URL → 200；导航 4 项点击后都有真实落点，无 `href="#"` |
| R-04 | 视频行为 | 滚动 hero → 画面变化但 `paused===true`；reveal 打开 → `paused===false` 且循环；关闭 → 暂停；两者 muted/playsinline/无音轨 |
| R-05 | 媒体处理 | `ffprobe` 复核 → hero≤8MB、reveal≤4MB、poster≤300KB、单文件≤10MB；hero 0–7.9s、1080p、GOP≤1s、`+faststart`、`-an`；`git ls-files` 无 4K 原片 |
| R-06 | 海报与降级 | 慢网/禁用视频/reduced-motion → 首屏显示 poster 或静态可读内容，不黑屏 |
| R-07 | 路径与线上资源 | 搜索产物 → 无 `E:\` 绝对路径、无中文/空格/括号文件名；`base='/'`；线上 Network 0 404 |
| R-08 | 自托管无第三方 | 打开页面 → Network 无 Google Fonts/jsdelivr 等第三方请求；断第三方网仍完整浏览 |
| R-09 | 视觉保真与偏离 | 按参考实现 fixed 层/runway/reveal/frame/sec2/sec3/响应式；默认不加参考禁止的 grain/scrim/wash，只有 X-03 记录为“已批准可读性例外”才允许局部处理；difference 默认只在 fixed 层，若按 X-03 改用实色文字/局部压暗，必须保留参考的栅格/字号/滚动叙事并记录；未记录偏离计 FAIL；1440×900 与 375×812 截图 |
| R-10 | 文案本地化 | 全局搜索 → 无 COSTA/Ligurian/dawn swim/意大利时钟；`lang="zh-CN"`；时钟 `Asia/Shanghai`；title/description/OG 为占位 |
| R-11 | 导航 GooeyNav | 4 项逐一点击 → 滚动到目标并同步 active；Tab/Enter 可用；375 宽不溢出、不遮挡 |
| R-12 | Lanyard | 桌面可拖拽/甩动/点击翻面；触屏纵向滑动仍能滚页；禁用 WebGL → 静态卡或不破版；375 不重叠；reduced-motion 静止 |
| R-13 | 响应式 | 1440/1280/1024/768/390/375 与横屏手机 → `scrollWidth<=innerWidth`，关键文字不截断 |
| R-14 | 减少动态 | 模拟 `prefers-reduced-motion: reduce` → 无滚动动画/无视频播放/无 intro；内容静态可读、导航可用 |
| R-15 | 可访问性 | 键盘可完成导航与联系；`h1/main/section/nav` 语义、skip link、`:focus-visible`、装饰 canvas `aria-hidden`、对比度达标 |
| R-16 | 性能预算 | 首屏关键资源≤1.5MB（不含视频）、首屏 JS gzip≤400KB；LCP≤2.5s（4G）；无 >200ms 长任务 |
| R-17 | 内容单一来源 | 全局搜索发现文案只出现在 `src/content/`；改一个占位词只改内容源；占位清单完整 |
| R-18 | 不编造与隐私 | 全局搜索 → 无未经确认的姓名/学历/公司/奖项/联系方式；无手机号/住址/身份证/私人邮箱/密钥 |
| R-19 | 部署 | Actions 成功 → 根站点 200、资源 0 404；run id/日志留存；回滚步骤在 README；README 四段齐全；首版 noindex 生效 |
| R-20 | 可复现构建 | 干净目录 `npm ci && npm run build` 成功；`package-lock.json` 入库；Node 版本记录 |
| R-21 | 文档与证据 | `AGENTS.md`、`docs/conventions.md`、`docs/spec-v1.md`、`docs/plan-v1.md`、`docs/decisions/decision-01.md`、`docs/content-placeholders.md`、`docs/verification.md`、`README.md` 存在且路径/命令真实 |
| R-22 | 未完成项 | `verification.md` 的“未完成/未测”非空且与报告一致 |
| R-23 | 版权与署名 | 组件/字体/视频许可核对；`THIRD_PARTY_NOTICES.md`；ReactBits 署名（若要求）；公开前用户确认 |
| R-24 | 面试可用 | 首屏 3 秒内读出“是谁/方向/怎么联系”；联系入口真实；URL 短/HTTPS/无登录；加载失败有可读内容 |
| R-25 | 内容演进 | 提供 `docs/content-swap.md`：替换位置、需重测参数、最长文案回归方法；v1 作品列表只留扩展点 |

## 4. 当前状态摘要（详细证据见 verification.md）

- 已过（本地）：R-01、R-02、R-04、R-05、R-08（本地）、R-09（结构/方向）、R-10、R-11（M4）、R-12（M5 + §5.1 层修订）、R-13（含 M6.1 四视口）、R-14（本地）、R-17（M6.1 内容区单源 + P0）、R-18、R-21、R-22、R-24（本地）。
- 部分：R-03/R-06/R-07/R-16/R-20（线上/真机/LCP 未测）；R-15（竖屏弹层 dialog 已做，M6.4 全量复核）。
- 未开始：R-19（M7）、R-23（组件许可已记录，公开前仍需用户确认）、R-25（M6 渲染后回归部分完成）。
- 已记录偏离：X-01（Vite+React 岛屿）、X-02（hero 裁 7.9s）、X-03（方案 1/A 可读性改写，子项 X-03.1/X-03.2）、X-04（2-pass ABR）、X-05（三章后接文档流简历/作品集区，计划 M6）、X-06（不引入帧库）、X-07（reveal 循环 0.2s 压黑，M4 已实施）。
