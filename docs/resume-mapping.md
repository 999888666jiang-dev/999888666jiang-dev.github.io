# resume-mapping · 简历字段 → 内容源映射

> 来源（以 PDF 原文为准；本轮以监工提取文本为工作副本）：
> - `姜睿_AI应用与智能体方向_简历.pdf`（1 页）→ 提取文本 `E:\监工\tools\out\resume_ai_app.txt`
> - `姜睿_AI运营实习生_简历.pdf`（2 页）→ 提取文本 `E:\监工\tools\out\resume_ai_ops.txt`
>
> 隐私：本文件不记录手机号；邮箱/GitHub 只作为公开渠道（v1.7 联系方式默认 B）。手机号不写入源码、docs、日志。

## 1. Hero / 身份

| 内容源字段 | 值 | 来源 |
| --- | --- | --- |
| `identity.nameZh` | 姜睿 | 两份简历首页 |
| `identity.nameLatin` | JIANG RUI | 显示层拉丁字母（D7） |
| `identity.brand.main` | JIANG / RUI | 同上 |
| `identity.brand.alt` | AI AGENT / WORKFLOW | 定位：AI 应用开发 / 智能体与工作流 |
| `identity.brand.crew` | SOFTWARE / 2027 | 软件工程 2027 届 |
| `identity.cap` | AI 应用开发 · 深圳 / PORTFOLIO 2026 | 应用版首页“求职城市：深圳”+ 方向 |
| `identity.role` | AI 应用开发 / 智能体与工作流 | 应用版首页标题 |
| `hero.lede` | 软件工程 2027 届 · 深圳；约 1.5 年 Coze 智能体与工作流实践；Dify 本地化部署、Vibe Coding 网站、Python 用户反馈整理 | 应用版“核心技能”+ 运营版“岗位匹配亮点”合并（v1.7 §5.2.2 默认 A） |

## 2. 章节陈述

| 字段 | 值 | 来源 |
| --- | --- | --- |
| `section2.statement` | 用工作流把想法做成能用的东西。 | 由 Core skills（工作流/Coze/落地）概括，非虚构事实句 |
| `section3.notes[0]` | 约 1.5 年 Coze 实践：智能体与工作流搭建、提示词调试、效果验证及异常记录。 | 应用版“核心技能 · AI应用”原句 |
| `section3.notes[1]` | 做过 Dify 本地化部署、Vibe Coding 网站上线、Python 整理 200+ 份用户反馈。 | 应用版核心技能（部署实践/项目开发/需求与数据）合并 |
| `section3.closing` | AGENT / WORKFLOW / 2027 | 定位 + 届别（短句占位，M6 可换） |

## 3. 经历

| 内容源字段 | 值 | 来源 |
| --- | --- | --- |
| `experience[0]` | 酣睡博士（深圳）科技有限公司 · 测试开发工程师（实习）· 2024.07—2024.09 · 3 条 highlights | 应用版“实习经历”第 1 条；运营版同公司（用户反馈/数据整理/产品需求） |
| `experience[1]` | 广州极飞科技股份有限公司 · 无人机实验员（实习）· 2026.06—2026.08 · 3 条 highlights | 运营版第 2 页“实习经历”；应用版未列（v1.7 明确并入主内容） |

## 4. 教育 / 荣誉

| 字段 | 值 | 来源 |
| --- | --- | --- |
| `education` | 广州新华学院 · 软件工程 · 本科在读 · 2023—2027 | 两份简历 |
| `honors[]` | 挑战杯省银、她轻创省银、大创校赛金奖/优胜、软著《神经网络荧光检测系统 V1.0》、CAAC 三项证书 | 应用版“校园经历/荣誉”、运营版第 2 页“荣誉奖项/资格证书” |

## 5. 技能

| 内容源字段 | 排序依据 |
| --- | --- |
| `skills` | AI Agent/工作流 → 数据与需求 → 前端/交互 → 设计表达 → Vibe Coding（应用版优先，运营版数据/需求在前） |

## 6. 作品集（v1.6 schema）

| id | sourceType | 依据 |
| --- | --- | --- |
| `ai-flight-lab` | external → `https://999888666jiang-dev.github.io/jiangrui-ai-flight-lab/` | 应用版“个人作品集 · AI Flight Lab”；旧站关系已定 B（新站主站 + 旧站外链条目） |
| `ai-tcm-moxibustion` | internal | 应用版项目经历（挑战杯省银） |
| `fluorescence-detection` | internal | 应用版“软件著作权” |
| `coze-workflows` | internal | 应用版核心技能 + 运营版重点项目 |
| `live-commerce` | internal | 应用版校园经历 / 运营版竞赛 |
| `drone-testing` | internal | 运营版实习经历第 2 条 |

## 7. 联系方式（默认 B）

| 字段 | 值 | 说明 |
| --- | --- | --- |
| `contact.email` | 3164175833@qq.com | 简历公开邮箱 |
| `contact.github` | https://github.com/999888666jiang-dev | 公开 GitHub 主页 |
| 手机号 | **不写入任何文件** | 源码公开 = 内容公开（`noindex` 不是访问控制） |

## 9. v1.8 定位更新（已同步，2026-11-22）

用户拍板「以 AI 大模型开发为主」，按真实性落为 **A：大模型应用开发 / Agent 工作流**（只改措辞与排序，不改章节结构）。受影响字段：

| 字段 | 新值 | 依据 |
| --- | --- | --- |
| `meta.title` / `meta.description` | 姜睿 · 大模型应用开发 / Agent 工作流（描述含 2027 届 · 深圳 · 约 1.5 年 Coze/Dify） | 应用版首页标题 + 核心技能；运营版岗位匹配 |
| `identity.role` | 大模型应用开发 / Agent 工作流 | 应用版「AI应用开发实习生｜智能体与工作流方向」 |
| `identity.tagline` | 软件工程 2027 届 · 深圳 · 约 1.5 年 Coze / Dify 实践 | 应用版教育/城市 + 核心技能 |
| `identity.cap` | 同 tagline（显示层小字） | 同上 |
| `hero.lede` | 约 1.5 年 Coze 智能体与工作流实践：Prompt 调试、效果验证、异常记录；做过 Dify 本地化部署；用 Vibe Coding + Vue 3 把 AI 实验做成上线网站。方向：大模型应用开发 / Agent 工作流。 | 应用版核心技能 + 项目经历（合并运营版「岗位匹配亮点」，不承诺岗位） |
| `section2.statement` | 用 Agent 工作流把想法上线。（12 字） | 由 Coze/工作流/上线网站事实概括，非新增事实 |
| `section3.notes` | 1) 约 1.5 年 Coze 实践：智能体与工作流搭建、Prompt 调试、效果验证及异常记录。 2) 做过 Dify 本地化部署、Vibe Coding 网站上线、Python 整理 200+ 份用户反馈。 | 应用版核心技能原句 |
| `skills[0]` | 大模型应用 / Agent 工作流：Coze 智能体与工作流、Prompt 调试、效果验证、异常记录、Dify 本地化部署 | 应用版核心技能「AI应用/部署实践」 |
| `about.summary` | 含「方向大模型应用开发 / Agent 工作流」 | 应用版标题 + 核心技能 |

禁令：Hero/lede/meta/定位文案不出现「训练 / 微调 / 预训练 / 推理优化 / 算法 / 算法岗 / 模型结构 / 论文」。扫描结果：可见文案 0 命中；唯一命中为 NDA 项目名「毕业论文全流程系统」（`projectsNda`，未渲染、不公开），按 v1.9 原文保留。

## 10. 作品集数据来源（v1.9）

| slug | 类型 | 依据 |
| --- | --- | --- |
| `ai-flight-lab` | external | 应用版「个人作品集 · AI Flight Lab」；旧站关系已定 B（新站主站 + 旧站外链条目） |
| `daliuren` | external | 用户 GitHub 公开仓库 `daliuren`（2026.09），在线演示 |
| `qzfs-reader` | external | 用户公开仓库 `qzfs-reader`（2026.11），仅展示 UI 框架，不展示小说正文 |
| `graduation-thesis-workflow` | nda（未渲染） | 用户 PRIVATE 仓库；不公开链接/截图 |

三个公开仓库均**无 LICENSE**：卡片文案用「公开仓库 / 在线演示」，不写“开源”（R-23）。
