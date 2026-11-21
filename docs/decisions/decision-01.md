# decision-01 · D1–D8 决策记录（含 Q1/Q2 已拍板结论与放弃选项代价）

- 状态：Q1/Q2 **已拍板**（2026-11-22 02:41 用户拍板，监工转达）；D1–D8 无待定项。
- 依据：定稿提示词 §3 / §5；实测数据见 `docs/verification.md`。

## Q1 素材方向 = B（保留现有素材，禁止再问）

> 命名对齐：用户 2026-11-22 拍板的 M3 方向 **A**（白色实字 + 渐变压暗）= 验收文档中的**方案 1**。本文档统一写「方案 1（A）」，不写「方向 C」（Q1 里被放弃的 C 是“先出样张再定”，与此无关）。

- 决定：不换素材；保留阴天校园/道路/雕塑视频；允许调混合模式、文字色、调色、文案；记 **X-03 已批准视觉偏离**。用户原话「先用这个做做出来看看效果再说」。
- **被放弃 A（换素材）的代价**：需要用户另找/另拍；工期不可控；样张与实现全部重做。
- **被放弃 C（先出 3 张样张再定）的代价**：多一轮决策等待；已被用户否决，**不再作为决策门**。M2 三张样张只用于“让用户看到效果”。
- B 的代价：整体气质与参考的“海岸亮调电影感”不同；`difference` 白字在灰天空/中灰路面上同屏对比度不稳定。
- 缓解顺序（已执行，不再问用户）：① 调文字色/字重/混合模式 → ② 移动文字落位 → ③ 加局部压暗/底板（记录 X-03 子项）→ ④ 才提“换素材/换版式”方案。
- 实测依据：hero t=3s 上部天空 YAVG **215.8**、下部路面 **54.5**；`difference` 白字在天空 ≈Y39（近黑）、路面 ≈Y200；B 样张（压暗 0.78）文字 ≈Y87 中灰（最差）；C 样张（白字实字 + 渐变压暗）全部可读。样张：`docs/verification/m2/sample-{a,b,c}-*.jpg`。
- 已采用的落地（X-03 子项）：
  - **X-03.1** 主文字层改白色实字（不用 `difference`）；`difference` 只允许暗部小面积装饰。
  - **X-03.2** 画面上局部压暗（线性渐变 scrim，约 0.2–0.6），保证 D8 首屏可读性。

## Q2 发布形式 = 根站点 + 公开仓库（禁止再问）

- 决定：`https://999888666jiang-dev.github.io/`；仓库名必须是 `999888666jiang-dev.github.io`；公开；首版 `noindex`，验收前不分享。
- **被放弃的项目站代价**：URL 多一层 `/<repo>/`；`base` 配错即全站 404；面试场景 URL 不够短。
- **被放弃的私有仓库代价**：免费账号 Pages 通常不可用；无线上 URL 无法满足 R-19/R-24。
- 代价：仓库名被固定；源码/素材/以后填的内容公开可见。
- 缓解：`noindex` + `robots.txt Disallow`；不提交参考 md/原片/提示词/密钥/隐私；公开前单独确认版权与联系方式。注意 `noindex` 不是访问控制。

## D1 素材与视觉方向

见 Q1；不再做方向选择。样张/原型在真实帧上仍不可读且缓解 ①–③ 全部失败时，才向用户提供 2–3 个方案（换素材/调版式/加可读性底板）+ 推荐。

## D2 技术形态 = Vite 静态站 + 原生主叙事 + React 岛屿（X-01）

- 构建：Vite 8.3.8（精确 pin），`package-lock.json` 入库。
- 主叙事保持原生 DOM/CSS/JS；React 只做 `GooeyNav`、`Lanyard`。
- 禁止整站重写为 React、运行时 Babel、CDN 主路径。若要全 React，先给对照证据（保真/性能/包体）+ 推荐，等用户批准。

## D3 视频管线（X-02）

- hero：原片 23.167s → **裁 0–7.9s**（8.000–23.133s 为纯黑，blackdetect 实测 `black_start:8 black_end:23.133333 black_duration:15.133333`）；1080p、`-an`、`+faststart`、`-g 15 -keyint_min 15 -sc_threshold 0`。
- 体积：单遍 CRF 22 实测 17.6MB（超预算），改 **2-pass ABR 7.2M + 轻度降噪** → 7,182,651 B（≤8MB）——统一编号 **X-04**。
- reveal：8.021s、1080p、2-pass ABR 3.6M → 3,497,841 B（≤4MB）；GOP 1s。
- poster：取实拍帧 **t=2s**（非黑场）→ jpg 174KB / webp 113KB（≤300KB）。
- 循环接缝处理（按规范顺序，结论：接受硬切并记录）：
  1. 交叉淡化：8.0s 裁点 0.5s 交叉淡化 → 明显重影（`docs/verification/m2/reveal-crossfade-8s-cut.jpg`）；5.6s 裁点 0.4s 交叉淡化 → 仍有双影（`reveal-crossfade-56s-cut.jpg`）。
  2. 找“首尾视觉相近”裁点：逐帧对首帧算 SSIM，最佳仅 **0.61**（t≈5.6s），原片首/末帧 0.30 → 无回环镜头，裁切无法解决。
  3. **结论：保留完整 8.021s + 硬切循环**，需用户看效果；若用户不接受，M3 提供 3 个方案（缩短到 5.6s 交叉淡化 / 循环处加 0.2s 压黑过渡 / 减少 reveal 显示时长）+ 推荐。
- 帧库：**v1 不引入 WebCodecs/mp4box 帧库（X-06）**。理由：hero 已裁到 7.9s + 1080p + 0.5s GOP，M3 实测原生 `currentTime` 擦洗 9 秒自动滚动 **60fps、最大帧间隔 33ms**（无 >200ms 长任务）；帧库的复杂度/兼容/移动端内存风险大于收益。移动端/低端默认 poster + 原生 seek 降级（D3 允许的优先级路径），真机待 M7 复核。
- 三章之后的简历/作品集区：记 **X-05**（脱离参考“所有层 fixed”），计划 M6 实施；M4 只落作品集数据（6 条，首条 AI Flight Lab 外链），未渲染。
- reveal 循环：按 v1.7 统一为 **X-07：循环处加 0.2s 压黑过渡**，M4 已实施（`--dip` 200ms 保持 + 100ms 过渡，录屏 `docs/verification/m4/reveal-loop-0.2s-dip.mp4`，逐帧最低 YAVG 24.9、无亮跳变）；不再是硬切。
- M4 已实施：GooeyNav React 岛（4 项真实 `<a>`、active 同步、键盘焦点保持、375 一行、无 JS 回退）；`.nav-slot` / `.lanyard-slot`；Lanyard 静态卡（`public/media/lanyard/front.jpg` 44.8KB + `back.png` 102.7KB）；lede 改左下；R-13 修复（右注字形右边界 1392 / 安全界 1416）。
- M3 已按方向 A 落地：fixed 层/runway/45° reveal/三章节/GSAP 开场/reduced-motion 静态降级/无 JS 可读首帧；标题三态改几何求解（`solveTitleTrigger` / `solveTitleOut`），不再硬编码阈值；中文陈述压到 16 字、375 宽边注改纵向堆叠。

## D4 组件许可

- M4/M5 前核对 ReactBits（GooeyNav/Lanyard）、three、GSAP、mp4box、React、字体许可；写 `THIRD_PARTY_NOTICES.md`；需要署名则署名。
- 许可不适合公开托管 → 顺序：换兼容替代实现 → 移除该效果 → 保留但按许可署名/调整；不先上线再补。

## D5 部署

见 Q2。首次推送前需用户明确“确认发布”；回滚见 `docs/plan-v1.md`。

## D6 内容与隐私

- 全部占位；真实信息等用户逐项确认；不公布手机号/住址/身份证/私人邮箱；仓库无 token/.env。
- 素材风险：抽帧中可见路面行人与电动车（小目标、不可识别人脸）；公开前逐段确认，必要时替换/裁剪/不公开。

## D7 中文排版与字形

- 显示层用拉丁字母（姓名拼音/角色英文/年份）；中文正文用系统字体栈；时钟 `Asia/Shanghai`。
- 参考的 KANA 逐字切假名不适用中文（映射缺 I/J/M/P/Q/X/Z/G）→ 不做逐字假名效果；中文微效果另行设计（M3）。
- 中文长句风险已实测：24 字陈述在 1440 宽排 4 行贴右缘；375 宽双栏边注各约 167px 过窄 → M3 限字数/缩字号/改纵向堆叠。

## D8 面试可用性

- 首屏 3 秒内可读出“是谁/方向/怎么联系”；加载失败/慢网/无 WebGL/reduced-motion 仍有可读内容。
- 视觉与可读性冲突时优先可读（因此有 X-03.2 压暗）。

## 内容/作品集/定位（v1.4 + v1.8 + v1.9，已执行）

- **定位（v1.8 用户拍板）= A：大模型应用开发 / Agent 工作流**。只改措辞与排序：`identity.role/tagline/cap`、`hero.lede`、`section2.statement`、`section3.notes`、`skills[0]`、`about`、`meta.title/description`；不新增章节/页面/偏离；不出现“训练/微调/预训练/推理优化/算法/算法岗/模型结构/论文”。
- **联系方式 = B（锁定）**：只公开邮箱 + GitHub；手机号不写入 `site-content.js`、docs、日志、仓库；联系入口用真实 `mailto:`/GitHub（M6 渲染）。
- **作品集 = A（最小可扩展网格，M6 渲染）**：schema 含 `sourceType/slug/title/value/role/stack/period/links/cover/images/status/category/featured/order/alt/rightsNote/detailPath`；当前 3 条 external、初始 6 条逻辑、无筛选器；`images` 里的 01/02 尚未生成（M6 前补齐）。
- **X-05**：三章电影感后接正常文档流 `#about/#experience/#projects/#honors/#contact`，M6 实施（本轮只落数据，未改布局）。
- **C-01（简历旧站 URL）**：运营版简历写的是项目站 `.../jiangrui-ai-flight-lab/`；Q2 已定根站点，但本轮不改简历 PDF，M7 前统一（默认：根站点 + 更新简历链接）。
- **R-23 版权现状**：3 个公开仓库均无 LICENSE → 不写“开源”，写「公开仓库 / 在线演示」；qzfs-reader 正文版权归原作者，封面已遮挡简介、只展示 UI 框架；封面中书籍插画版权归原站点，公开前需用户确认；NDA 项目不公开。
- 封面：`public/media/projects/<slug>/cover.webp`（1600×1000、q80、≤200KB、剥元数据）；三张合计 338KB（85+92+161）。

## M5 Lanyard 3D（v2.0/v2.1，已实施）

- 组件：ReactBits Lanyard（MIT + Commons Clause，保留逻辑）+ `three@0.183.0`（MIT）；动态 import 独立 chunk（gzip 145.83KB），首屏不加载。
- 尺寸（v2.1）：桌面槽位 `clamp(270px,26vw,390px) × clamp(380px,54vh,540px)`（1440 实测 374×486）；375 为 70vw×36vh（263×292）；3D size 0.70/0.62；静态卡高 70%/62% 对齐，避免接管跳变。
- 挂绳：3D 用 three band + 金属扣；加载中/无 WebGL/reduced-motion 用 `.lanyard-css-strap`（CSS 画带 + 金属扣）；用户明确要求“必须有挂绳”。
- 交互：拖拽/甩动/点击翻面；`touch-action:pan-y`，卡片上滚轮仍滚动页面；随 hero 淡出，不遮章节 2/3。
- 降级：无 WebGL / reduced-motion / 省流 → 不加载 three，静态 front.jpg + CSS 挂绳。
- 验收证据：`docs/verification/m5/`（1440/375、翻面、无 WebGL、reduced-motion、p3 淡出）+ verification §8.9；真机触屏未测。

## X-08 · 轮播卡片尺寸锁值（2026-11-22 裁定）

- 背景：CircularGallery 内部 `cardHeight = 0.6 × 容器高 × itemSize`；规格默认 itemSize 0.90 在 520 容器下只有 281px，与"卡片高 400–460"目标冲突。
- 裁定：**接受组件系数，不把容器加高**；按目标卡高反推 itemSize 并锁定：
  | 视口 | 容器 | itemSize | 预期卡高 |
  | --- | --- | --- | --- |
  | 1440×900 | 520 | **1.30** | 406 |
  | 798×1062 | 360 | **1.20** | 259 |
  | 375×812 | 360 | **1.15** | 248 |
  | 812×375 | 300 | **1.20** | 216 |
- 说明：**1.30/1.20/1.15 只是本组件当前系数下的锁值，不是规格默认值**；若组件升级改变卡高公式，需重新反推并更新本节与 verification §8.17。
- 其余 props 不变：itemAspect 1.2、gap 0.16、fadeEdges 0.10、bend 0.8、autoScroll 0.15（reduced=0）、背景透明。