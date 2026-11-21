# decision-02 · P0 可扩展性契约（v2.5）

- 时间：2026-11-22
- 背景：用户明确“以后一定会加新东西/改内容，修改损失要最小”；提示词包 v2.5 新增 §2.5 可扩展性约束（P0）。
- 结论：P0 作为所有后续改动（M6.2/M6.3/M6.4/M7 及以后）的硬约束；实现方式固定如下，变更需写新 decision。

## 契约

1. **内容单源**：所有文案/作品/链接/媒体路径只写在 `src/content/site-content.js`；页面/组件不硬编码内容。加作品 = 加一条 `projects` 数据 + 把封面放进 `public/media/projects/<slug>/cover.webp`；不改布局代码。
2. **区块独立**：`sections.{about,experience,projects,honors,contact}.{enabled,order}`；每个区块一个 render 函数、一个数据键；缺省值在 `main.js` 合并（老数据不填也能渲染）。隐藏/换序只改配置，不影响其它区块。
3. **组件岛隔离**：`islands.{gooeyNav,lanyard,gallery,reflectiveCard}` 开关（`gallery` 兼容旧键 `circularGallery`）；每个岛独立 mount/CSS/依赖、独立动态 chunk；关闭或失败时：nav 用普通 `<a>`、Lanyard 用静态卡 + CSS 绳带、Gallery 用静态网格、Card 用 HTML 详情；无 WebGL/无 JS/reduced-motion 均有静态替代（无 JS 用 `<noscript>` 静态摘要）。
4. **tokens 集中**：尺寸/颜色/断点用 `:root` 变量：`--lanyard-layer-w`、`--lanyard-card-w/h/top`、`--lanyard-strap-w`、`--lanyard-clamp-*`；后续 `--gallery-*`、`--modal-*`、`--fs-*`。改尺寸只改变量（媒体查询内覆盖），不在组件里写魔法数。
5. **向后兼容**：新增字段必须有默认值（如 `status→live`、`sourceType→external`、`stack→[]`、`links→{}`、缺 `cover` 不渲染图）；删除字段先 deprecate 一轮（保留默认处理）再删。
6. **回归固定项**：每轮 `npm run build` + 链接/资源 404 检查 + 1440 / 798×1062 / 375×812 截图（横屏按需）+ 0 控制台错误；缺一项不算完成。
7. **文档**：加内容/加区块/改文案/回滚按 `docs/content-swap.md` 四段 checklist；契约/结构变更写 `docs/decisions/`。

## 验收钩子（dev-only，生产构建自动移除）

- `?p0fake=1`：追加一条缺字段假作品（验证只改数据可渲染、缺字段有默认值）。
- `?p0hide=<section>` / `?p0rev=1`：隐藏/反序区块（验证区块独立）。
- `?p0nonav=1` / `?p0nolanyard=1`：禁用组件岛（验证静态替代）。

## 回滚

- 内容/区块配置改动：改 `site-content.js` 对应键即可回滚，无需动代码。
- 岛开关：`islands.*` 置 false 即回退到静态替代。
- tokens：改回 `:root` 变量；不要在组件内临时打补丁。
