# plan-v1 · 里程碑计划（M0–M7，先看效果版）

> 依据：定稿提示词 §7；Q1=B、Q2=根站点+公开已拍板，无待定项。
> 每个里程碑单独报告；M1/M2 按用户“先看效果”连续推进，但证据各自独立。

| 里程碑 | 状态 | 产物 | 完成定义 / 证据 |
| --- | --- | --- | --- |
| **M0 最小文档** | ✅ 已完成（补正后） | `AGENTS.md`、`docs/conventions.md`、`docs/spec-v1.md`、`docs/plan-v1.md`、`docs/decisions/decision-01.md`、`docs/content-placeholders.md`、`docs/verification.md`、`README.md` | 文件真实存在；Q1/Q2 已拍板记录 + 放弃选项代价；无待定问题；不铺额外大文档 |
| **M1 脚手架 + 部署通道** | ✅ 已完成 | Vite 骨架、目录、`.gitignore`、`noindex`/`robots.txt`、Actions 工作流、本地 build/preview、README 四段 | `npm install` + `npm run build` 成功；本地 200；工作区无原始视频/参考 md；**未创建公开仓库**（等“确认发布”） |
| **M2 媒体 + 3 样张 + 短滚动原型** | ✅ 已完成（待用户看效果） | `public/media/{hero,reveal}.mp4`、`poster.jpg/webp`；`prototype/samples/`；`prototype/scroll-prototype.html`；`docs/verification/m2/` | ffprobe 记录大小/编码/时长/关键帧；样张可见 difference 可读性与整体气质；原型本地可滚动、0 控制台错误；报告本地 URL + 一句话结论；**样张不是选择题** |
| **M3 主视觉 + 滚动叙事** | ✅ 已完成（待用户看录屏） | 完整 fixed layers / runways / reveal / frame / sec2 / sec3 / GSAP 开场 / reduced-motion / 无 JS 首帧；占位文案 | 滚动 0→100%→0 可逆；1440/375 无横向滚动；控制台 0 错误；实测 60.2fps、最大帧 17ms；截图/录屏见 `docs/verification/m3/` |
| **M4 GooeyNav** | ✅ 已完成（本地 1440/375，待看录屏） | React 岛屿（`src/islands/gooey-nav.jsx` + `nav-mount.jsx`）、`.nav-slot`、`.lanyard-slot` + 静态 front.jpg、lede 左下、R-13 修复、X-07 压黑过渡 | R-11 全过；R-13 修复实测（glyphRight 1392/安全 1416）；375 一行 224×40；键盘/active 证据；首屏 JS gzip ≈101KB；dist 无 three |
| **M4.5 内容/定位/作品集数据** | ✅ 已完成（v1.4+v1.8+v1.9，内容层） | 真实简历全字段、定位改为「大模型应用开发 / Agent 工作流」、3 条作品数据 + 封面、NDA 数据、`resume-mapping`/`content-swap` | 内容源为唯一来源；手机号 0 命中；3 封面 1600×1000 WebP ≤200KB；`public/dist` 一致；R-10/R-17/R-18/R-25 证据见 verification §8.8 |

| **M5 Lanyard** | ✅ 已完成（本地 1440/375 + 降级，待看截图） | three@0.183.0 动态 chunk + `src/islands/lanyard.jsx`；静态卡 + CSS 挂绳兜底；尺寸 v2.1（374×486 / 263×292）；拖拽/翻面/不劫持滚动 | R-12 本地 PASS；three chunk gzip 145.83KB；首屏 JS gzip ≈100KB；1440/375/reduced/no-WebGL/翻面截图见 verification §8.9 |
| **M5.5 手机横屏引导** | ✅ 已完成（本地 375/812/844 + 降级） | 竖屏弹层（dialog/焦点锁/Esc/会话记忆）、全屏尝试 + 手动旋转降级、无 JS 横幅、横屏布局（812×375/844×390）、旋转进度保持 | 实测：弹层/关闭/刷新不再弹/遮罩不关/全屏失败提示；横屏无重叠溢出；旋转进度 0.181→0.173；录屏与截图见 verification §8.10 |
| **M5.1 Lanyard §5.1 层修订** | ✅ 已完成（本地四视口 + 甩动） | `.lanyard-layer` 覆盖 hero（46vw/100vw）、绳带顶层 z3/扣 z4/卡 z2、canvas pointer-events:none + hit 代理、四视口卡片 374/300/240/220 与 top 168/300/244/80、甩出不裁切 | 实测全表命中、0 日志、滚轮不劫持；见 verification §8.12 |
| **P0 可扩展性** | ✅ 已完成（M6.1 范围） | 内容单源、区块 enabled/order、组件岛开关、tokens、向后兼容、四段 content-swap checklist | 假作品 7 卡、隐藏/反序不影响其它、关岛有替代、改 token 生效；见 verification §8.13 |
| **M6.1 内容区 + 静态作品网格** | ✅ 已完成（本地 4 视口） | X-05 文档流区（关于/经历/作品/荣誉/联系）、6 条作品数据 + 6 张封面、NDA 文字说明、导航真实位置与 active、past-narrative 收尾 | 渲染 6 卡/6 封面加载、0 死链、6 外链 200、无横向溢出、禁用词/手机号 0 命中；截图见 verification §8.11 |
| **M6.2 CircularGallery** | ⬜ 下一步（M6.1 验收后） | 轮播组件、动态 import、lazy、wheel 规则、无 WebGL 回退 | 轮播可见/背景透出、拖拽+方向键、普通 wheel 滚页、lazy 体积与首屏不加载 |
| **M6.2 CircularGallery** | ✅ 已完成（四视口 + wheel 实测） | 组件源码/本地字体/懒加载（IntersectionObserver 300px）、透明背景、6 items、wheel 规则、无 WebGL 回退静态网格、`islands.gallery` 开关 | canvas 四视口尺寸命中、普通 wheel 滚页/聚焦与 Shift 接管、方向键换卡、lazy gzip 9KB、首屏无 chunk、0 错误；见 verification §8.14 |
| **M6.1 补正 + P0 carry-over** | ✅ 已完成 | NDA 真实名/仅显示说明、images []、375 重截、铁饭碗备注、noscript 静态摘要、dist P0 剔除、islands.gallery/`--gallery-*` | 全部实测（§8.15）；R-12 PASS |
| **M6.3 ReflectiveCard** | ✅ 已完成（三档 + 降级） | 轮播点击→居中卡、slug 取项目、单一路径、焦点/滚动恢复、Tab 陷阱、无 WebGL/关闭开关走 HTML 面板、Hugeicons 精确版本 | 尺寸 420×600/320×520/520×340 命中；camCalls 0；Esc/遮罩/关闭均回滚；见 verification §8.16 |
| **M6.2R 轮播视觉密度** | ✅ 已完成（四视口 + wheel 0 位移） | 容器 520/360/300、gap .16/fade .10/bend .8/aspect 1.2/autoScroll .15；桌面 itemSize 1.30（组件 0.6 系数反推，X-08）；wheel 捕获层严格接管 | 1440 主卡≈406px + 两侧半卡；375/798/812 轮播主体可见；wheel 三组实测 `7482→7722 / 7692→7692 / 7692→7692`；见 verification §8.17 |
| **M6.3R 详情卡视觉** | ✅ 已完成（四视口 + reduced） | cover 30% 卡高 + 暗渐变、状态 badge 带文字去孤立点、紧凑排列、reduced 关 tilt/intro、HTML 面板同步 | cover 比例 0.268–0.278、dots 0、cam 0、scrollY 全恢复、0 错误；见 verification §8.18 |
| **M6.3R2 详情卡包边** | ✅ 已完成（本地 1440/798 + reduced） | 桌面/平板卡片 420×540 r27、cover 30%、space-between 分布余量 | 链接下空白 6.9%/7.0%（≤10%）、scrollY/焦点回归、cam 0、0 错误；见 verification §8.19 |
| **M6.4 收口** | ✅ 本地验收通过（待监工终验） | 键盘 Enter、指针命中、CLS（reveal 改 scaleX）、ERR_ABORTED 定位、404/OG/noindex/robots/dist 剔除、四视口证据 | 累计 CLS：798 ≈0.001、1440 ≈0.001、375 ≈0.005（≤0.1）；键盘/指针开卡、Esc 回焦点；hero.mp4 媒体 abort 已解释；见 §8.19 |
| **M6.4 收口** | ⬜ 未开始 | a11y/性能/三视口截图/验证记录 | 首屏不加载两组件、lazy gzip ≤160KB、无 CLS |
| **M7 性能硬化 + 线上验收** | ⬜ 未开始 | 性能预算记录、浏览器矩阵、Actions/Pages 线上验收、`docs/deployment.md`、回滚说明 | R-16/R-19/R-20/R-21/R-22/R-23 全过；线上 200/0 404/Actions 绿；**用户“确认发布”后才移除 noindex** |

## 关键顺序与依赖

1. M2 产物（媒体 + 原型）是 M3 的输入；M3 的截图/录屏是 M4/M5 的视觉基线。
2. M4/M5 前先做 R-23 许可核对（ReactBits / three / GSAP / mp4box / 字体），写 `THIRD_PARTY_NOTICES.md`；许可不适合公开托管就按定稿 §5-D4 顺序换替代实现。
3. M6 前不改内容源结构；内容占位清零前保持 `noindex`。
4. 建公开仓库、首次推送、移除 `noindex`、对外分享 URL 全部等用户明确“确认发布”。

## 每轮报告格式

`结论`（一句话）→ `本地路径/URL` → `实际命令与证据` → `未完成/风险`（单列）→ `下一步`（只写下一小步）。不重发 M0 报告；不把方案当交付。

## 部署（M7 前只记录，不执行）

- 仓库：`999888666jiang-dev.github.io`（公开，根站点）；`base: '/'`；Pages Source = GitHub Actions。
- 工作流：`.github/workflows/deploy.yml`（install → build → configure-pages → upload-pages-artifact → deploy-pages）。
- 回滚：`gh run list` 取上一次成功 run → `gh run rerun <id>`；或 `git revert` 后重新推送；必要时在仓库 Settings 关闭 Pages。
- 首次推送前检查：`.gitignore` 覆盖 `视频/`、三份参考 md、本提示词、`.npm-cache/`、`.tmp/`、`dist/`；`git ls-files` 无 4K 原片/密钥/隐私。
