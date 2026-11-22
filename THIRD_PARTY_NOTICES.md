# THIRD_PARTY_NOTICES

本仓库包含以下第三方软件/素材。许可证原文以各自官方页面为准；本文件只记录版本与用途，不替代许可证文本。

## 运行时依赖（已打包进 `dist/`）

| 组件 | 版本 | 用途 | 许可证 | 备注 |
| --- | --- | --- | --- | --- |
| GSAP（`gsap`） | 3.13.0（精确 pin） | M3/M4 开场时间线（intro），自托管打包，无 CDN | Standard "no charge" license — https://gsap.com/standard-license | 未使用付费插件（ScrollTrigger/SplitText 等未引入） |
| React（`react` / `react-dom`） | 19.2.0（精确 pin） | M4 GooeyNav 岛屿运行时 | MIT — https://github.com/facebook/react/blob/main/LICENSE | 自托管打包 |
| `@vitejs/plugin-react` | 6.2.1（devDependency，精确 pin） | 构建期 JSX 转换 | MIT — https://github.com/vitejs/vite-plugin-react/blob/main/LICENSE | 仅构建期，不进产物 |
| ReactBits `GooeyNav` | 源码取自 `页面切换栏.md`（React JSX + CSS） | M4 主导航 | MIT + Commons Clause — https://github.com/DavidHDev/react-bits；组件页 https://reactbits.dev/components/gooey-nav | 保留组件逻辑，未改算法；Commons Clause 限制“售卖组件本身”，本站为个人作品展示用途 |
| `three`（three.js） | 0.183.0（精确 pin） | M5 Lanyard 3D（动态 chunk，首屏不加载） | MIT — https://github.com/mrdoob/three.js/blob/dev/LICENSE | 自托管打包，gzip 145.83KB |
| ReactBits `Lanyard` | 源码取自 `首页右侧个人形象.md`（React + three） | M5 首页右侧 3D 个人形象卡 | MIT + Commons Clause — 同上 | 保留组件逻辑；正面/背面图为用户提供/项目产出 |
| ReactBits `CircularGallery` | 源码取自 `作品展示.md`（React + WebGL2 canvas） | M6.2 作品轮播 | MIT + Commons Clause — 同上 | 保留渲染逻辑；仅改 wheel 规则（默认不抢页面滚动）、加本地字体、tabIndex |
| Inter 字体（Inter-Regular/SemiBold.woff2） | rsms/inter 仓库，OFL 1.1 | M6.2 轮播标题本地字体 | SIL Open Font License 1.1 — https://github.com/rsms/inter/blob/master/LICENSE.txt | 自托管，无运行时第三方请求 |
| ReactBits `ReflectiveCard` | 源码取自 `作品卡片点击选中后展示形式.md`（React + WebGL2 canvas） | M6.3 作品详情卡 | MIT + Commons Clause — 同上 | 保留组件逻辑；webcam=false、不填 videoSrc，无摄像头请求 |
| `@hugeicons/react` | 1.1.10（精确 pin） | M6.3 卡面图标 | MIT — https://github.com/hugeicons/hugeicons-react | 自托管打包，随详情卡懒加载 |
| `@hugeicons/core-free-icons` | 4.4.0（精确 pin） | M6.3 卡面图标 | MIT — https://github.com/hugeicons/hugeicons-react | 同上 |

用户提供的素材：Lanyard 正面照由用户提供（`E:\微信图片_20261122015201_350_2.jpg`），处理后放入 `public/media/lanyard/front.jpg`；原图不入库。

## 待核对（M4/M5 引入前）

| 组件 | 计划用途 | 需要确认 |
| --- | --- | --- |
| ReactBits `GooeyNav` | M4 主导航 | 组件许可证与署名要求；不得当作原生 JS 直接贴 |
| ReactBits `Lanyard` | M5 首页右侧 3D 卡片 | 同上 + three.js 许可证 |
| `react` / `react-dom` | M4/M5 岛屿运行时 | 本地依赖、精确 pin、自托管 |
| `three` | M5 | 本地依赖、精确 pin、自托管 |
| 字体 | 拉丁显示字体子集（若自托管） | 字体许可证允许网页嵌入 |
| 视频素材（`视频/` 两段 4K 原片 → `public/media/` 转码） | 站点主视觉 | 用户确认本人拍摄/有权公开；画面中路人/电动车/刻字等隐私（D6） |

## 说明

- 不允许运行时从 Google Fonts / jsDelivr / 其它 CDN 加载（R-08）；所有依赖本地安装并打包。
- 公开托管前需用户逐项确认版权与署名（R-23 / §11.3 gate）；拿不准先不公开。

| Instrument Serif（Regular/Italic woff2） | google/fonts 仓库 / fontsource | M8.1 章节大标题（自托管） | SIL Open Font License 1.1 — 见 public/fonts/InstrumentSerif-OFL.txt | 不 preload、不请求 Google Fonts；中文标题走系统衬线栈 |
