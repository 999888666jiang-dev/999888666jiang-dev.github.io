# content-swap · 内容替换与新增作品步骤

> 单一内容源：`src/content/site-content.js`（R-17）。本文件说明“简历内容到位 / 新增作品 / 替换文案”时改哪里、要重测什么。
> 作品集 schema：见 `siteContent.projects`（v1.6/v1.9）；NDA 项目放 `siteContent.projectsNda`，默认不渲染。

## 1. 替换简历/hero 文案

1. 只改 `src/content/site-content.js` 对应字段（`identity` / `hero.lede` / `section2` / `section3` / `about` / `skills` / `experience` / `education` / `honors` / `certificates` / `campus`）。不改布局/滚动参数。
2. 字数上限（M4 实测）：
   - `hero.lede`：1440 宽 ≤ 4 行、375 宽 ≤ 6 行（当前 76 字 → 375 约 5 行）；
   - `section2.statement` ≤ 18 字（当前 12 字）；
   - `section3.notes[]` 各 40–60 字；
   - `section3.closing[]` 每行 ≤ 8 字符。
3. 更新 `docs/resume-mapping.md`（字段 → PDF 页码/小节）。
4. 回归：1440/375 截图、`scrollWidth==innerWidth`、标题三态不跳、reduced-motion 可读、`npm run build` 通过。

## 2. 新增一条作品（数据 + 图片）

1. 在 `siteContent.projects` 追加对象，字段必须齐全：

```js
{
  sourceType: 'external',            // external | internal | nda
  externalUrl: 'https://…',          // external 必填；其余 null
  slug: 'kebab-case',
  title: '作品名',
  value: '一句话价值（≤ 40 字）',
  role: '作者 / 制作者 / 团队核心成员',
  stack: ['…'],
  period: 'YYYY.MM–MM',
  links: { live: '…', repo: '…' },
  cover: 'media/projects/<slug>/cover.webp',
  images: ['01.webp'],               // 可空
  status: 'live' | 'nda',
  category: 'web' | 'reader' | 'tool',
  featured: true | false,
  order: 4,                          // 排序；6 条以内全显示
  alt: '封面 alt',
  rightsNote: '版权/许可说明（无 LICENSE 时写“公开仓库 / 在线演示”）',
  detailPath: null
}
```

2. 图片目录：`public/media/projects/<slug>/`；封面 `cover.webp` 1600×1000、q80、≤200KB；附图 `01.webp…` 1600×900、≤250KB；WebP、剥 EXIF、写 `width/height`、`loading="lazy"`。
   现有封面（M6.1，合计 267KB）：`ai-flight-lab` 85KB、`daliuren` 92KB、`qzfs-reader` 22KB（阅读设置纯 UI）、`yunyanfpv` 11KB、`tiefanwan` 43KB、`guwang-yuan-2` 14KB。
3. 截图命令（本机 Chrome，不下载内核）：

```powershell
chrome --headless=new --disable-gpu --hide-scrollbars --window-size=1600,1000 `
  --screenshot=cover.png "https://<作品 URL>/"
ffmpeg -i cover.png -vf "crop=1600:1000:0:0,scale=1600:1000" -c:v libwebp -quality 80 -map_metadata -1 cover.webp
```

4. 版权：无 LICENSE 的仓库不写“开源”，卡片写「公开仓库 / 在线演示」；正文/他人插画不得展示，必要时遮挡或换纯 UI 截图（R-23）。
5. NDA 项目：只放 `projectsNda`，`status:'nda'`，不公开链接/截图；用户明确批准后才移入 `projects`。
6. 回归：网格 1/2/3 列（375 单列）、图片懒加载、首屏不加载作品图、无 404、`npm run build` 通过；更新 `verification.md`。

## 3. 新增/替换后必须重测

R-09（视觉与偏离）、R-10（文案本地化）、R-13（各视口无横向滚动）、R-17（内容单一来源）、R-18（隐私）、R-24（首屏可读）；M6 渲染作品集后另测懒加载/网格。

## 4. P0 四段 checklist（加内容 / 加区块 / 改文案 / 回滚）

### 4.1 加一条作品（不改布局代码）
1. `src/content/site-content.js` 的 `projects` 追加对象（最少 `slug/title/cover`；建议补 `value/role/stack/period/status/links/alt`）。
2. 放封面 `public/media/projects/<slug>/cover.webp`（1600×1000、q80、≤200KB、剥 EXIF）。
3. 字段默认：`status→live`、`sourceType→external`、`stack→[]`、`links→{}`；缺 `cover` 不渲染图、缺字段不报错。
4. 验证：`npm run build` + `/?p0fake=1` 能渲染假作品；三视口截图；外链 HEAD 200 或留空。
5. 回滚：删数据 + 删图片目录。

### 4.2 加一个区块
1. `index.html` 的 `[data-content-flow]` 内加 `<section id="<key>">`（含 `data-*` 容器）。
2. `main.js` 加 `render<Key>()`，注册进 `SECTION_RENDERERS`；`SECTION_DEFAULTS` 加 `{enabled:true, order:N}`。
3. `site-content.js` 可写 `sections.<key> = {enabled, order}`（不写用默认）；内容数据用独立键。
4. 验证：`?p0hide=<key>` 只影响自身、`?p0rev=1` 可换序；其它区块截图不变。
5. 回滚：删注册/数据，或 `sections.<key>.enabled=false`。

### 4.3 改文案 / 链接 / 媒体路径
- 只改 `site-content.js` 对应字段；页面不硬编码用户可读文案（R-17）。
- 改完 `npm run build` + 三视口截图 + 手机号/定位禁用词扫描。

### 4.4 回滚
- 内容/配置：改回 `site-content.js` 即可，无需动代码。
- 组件岛：`islands.<name>=false` 立即回退静态替代（nav 普通锚点 / Lanyard 静态卡 + CSS 挂绳 / Gallery 静态网格 / Card HTML 详情）。
- 组件代码：删除对应 `src/islands/*` + main.js 动态 import 块，主叙事不受影响。

