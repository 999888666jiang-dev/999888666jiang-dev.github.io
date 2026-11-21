# 个人网站（v1 · 视觉与交互）

个人面试网站。纯静态单页，滚动叙事 + 两个 React 岛屿（GooeyNav / Lanyard）。
**当前状态：M0–M5.5、M5.1、P0、M6.1、M6.2、M6.2R（X-08 锁值）、M6.3、M6.3R、M6.3R2 已完成；M6.4 收口本地验收通过（累计 CLS ≈0.001–0.005；键盘/指针、404、OG、noindex/robots、dist 剔除均过；待监工终验）；未部署、未公开、全站 `noindex`。**

- 技术栈：Vite 8.3.8 + 原生 DOM/CSS/JS（主叙事）+ GSAP 3.13.0（intro）+ React 19.2.0（GooeyNav）+ three 0.183.0（Lanyard，动态 chunk）
- 定位：**大模型应用开发 / Agent 工作流**（v1.8 拍板 A）；视觉方向 Q1=B + 拍板 A（= 验收“方案 1”），X-03
- 发布形式：**Q2 已拍板** 根站点 `https://999888666jiang-dev.github.io/`，公开仓库，首版 noindex；**尚未创建仓库**
- 内容：真实简历（合并应用版/运营版）+ 3 条作品数据（AI Flight Lab / 观象·大六壬 / 全职法师阅读站）+ NDA 占位数据；映射见 [resume-mapping](docs/resume-mapping.md)；联系方式 B（邮箱 + GitHub，无手机号）
- 文档： [conventions](docs/conventions.md) · [spec-v1](docs/spec-v1.md) · [plan-v1](docs/plan-v1.md) · [decision-01](docs/decisions/decision-01.md) · [resume-mapping](docs/resume-mapping.md) · [content-swap](docs/content-swap.md) · [verification](docs/verification.md) · [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES.md)

## 安装

```powershell
cd E:\个人网站面试版
npm install
```

- Node 24（本机实测 v24.16.0 / npm 11.13.0）。
- npm 缓存已重定向到项目内 `.npm-cache/`（不写 C 盘缓存目录）。

## 运行

```powershell
npm run dev        # 开发预览，默认 http://127.0.0.1:5173/
npm run build      # 生产构建，产物在 dist/
npm run preview    # 预览构建产物，默认 http://127.0.0.1:5174/
```

M2 样张与短滚动原型（不参与构建，直接用浏览器打开或用 dev server 访问）：

- 样张：`/prototype/samples/sample-a.html`、`sample-b.html`、`sample-c.html`（对应 A 参考保真 / B 冷调档案 / C 可读优先）
- 短滚动原型：`/prototype/scroll-prototype.html?dir=c`，`dir=a|b|c` 切换方向，`?debug=1` 显示进度
- 调试定位：`?p=0.45`（hero 进度）、`?p2=0.3`（章节 2）、`?p3=0.9`（章节 3）

> 也可以用 `file://` 直接打开 `prototype/scroll-prototype.html`（实测可用），但 **file URL 不支持 query 参数**，
> 因此 `?dir=` / `?p=` 只在 dev server 下有效；直接打开时默认 `dir=c`、从首屏开始滚动。
>
> 正式站（M3 起）：`/` 就是滚动叙事页；`?debug` 等调试参数只存在于原型，不在正式站里。

## 测试

当前为手工 + 截图验收（自动化测试在 M7 补）：

```powershell
npm run build      # 必须成功，且 dist/ 内无 4K 原片、无 Windows 绝对路径
```

- 验收证据与命令输出：`docs/verification.md`
- M4 截图与 reveal 循环录屏：`docs/verification/m4/`（1440/375、导航点击/键盘、R-13 修复、`reveal-loop-0.2s-dip.mp4`）
- M3 截图与滚动录屏：`docs/verification/m3/`
- M2 样张/原型截图：`docs/verification/m2/`
- 首屏 JS gzip：index 34.84KB + nav-mount（React+GooeyNav）66.30KB ≈ 101KB；dist 无 three
- 三份参考 md 与两段原视频的 SHA-256 基线见 `docs/verification.md`（每轮复核）

## 访问地址

- 本地开发：http://127.0.0.1:5173/
- 本地构建预览：http://127.0.0.1:5174/（先 `npm run build`）
- 线上：**暂无**。建仓与首次推送需用户确认；首版保持 `noindex`，验收通过前不分享链接。
