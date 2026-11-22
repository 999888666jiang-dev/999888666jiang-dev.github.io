// 单一内容源（R-17）：真实简历 + 作品集数据；M6 渲染内容区与静态作品网格。
// 定位（v1.8）：大模型应用开发 / Agent 工作流。联系方式 B：邮箱 + GitHub，无手机号。
// 扩展方式：加作品只改 projects 数据 + 放图片；加区块只加数据字段 + 区块组件（不改其它区块）。

const BASE = import.meta.env.BASE_URL;

export const siteContent = {
  meta: {
    lang: 'zh-CN',
    title: '姜睿 · 大模型应用开发 / Agent 工作流',
    description: '姜睿（JIANG RUI）· 软件工程 2027 届 · 深圳。约 1.5 年 Coze / Dify 实践：智能体与工作流、Prompt 调试、效果验证；方向大模型应用开发 / Agent 工作流。',
    themeColor: '#0a0b0c',
    ogImage: 'https://yunyanfpv.cn/media/poster.jpg',
    robots: 'noindex,nofollow'
  },

  identity: {
    nameZh: '姜睿',
    nameLatin: 'JIANG RUI',
    role: '大模型应用开发 / Agent 工作流',
    tagline: '软件工程 2027 届 · 深圳 · 约 1.5 年 Coze / Dify 实践',
    brand: { main: ['JIANG', 'RUI'], alt: ['AI AGENT', 'WORKFLOW'], crew: ['SOFTWARE', '2027'] },
    cap: ['软件工程 2027 届 · 深圳 · 约 1.5 年 Coze / Dify 实践', 'PORTFOLIO 2026']
  },

  clock: { timeZone: 'Asia/Shanghai', zoneLabel: ['ASIA', 'SHANGHAI'] },

  nav: [
    { label: '首页', target: '#top' },
    { label: '关于', target: '#about' },
    { label: '作品', target: '#projects' },
    { label: '联系', target: '#contact' }
  ],

  // P0：区块独立配置（缺省值在 main.js 合并；老数据不填也能渲染）
  sections: {
    act: {
    kicker: 'BLOOM · OPENING',
    items: [
      '把 AI 实验做成能上线的作品。',
      'Agent 工作流 · Prompt 调试 · Dify 本地化部署',
      '软件工程 2027 届 · 深圳 · 求职中'
    ]
  },
  about: { enabled: true, order: 10 },
    experience: { enabled: true, order: 20 },
    projects: { enabled: true, order: 30 },
    honors: { enabled: true, order: 40 },
    contact: { enabled: true, order: 50 }
  },

  // P0：组件岛开关（坏一个不影响主叙事；M6.2/M6.3 预留）
  islands: {
    gooeyNav: true,
    lanyard: true,
    gallery: true,
    reflectiveCard: true
  },

  hero: {
    lede: '约 1.5 年 Coze 智能体与工作流实践：Prompt 调试、效果验证、异常记录；做过 Dify 本地化部署；用 Vibe Coding + Vue 3 把 AI 实验做成上线网站。方向：大模型应用开发 / Agent 工作流。',
    foot: ['©2026', 'SCROLL']
  },

  section2: { statement: '用 Agent 工作流把想法上线。', label: '方向陈述' },

  section3: {
    notes: [
      '约 1.5 年 Coze 实践：智能体与工作流搭建、Prompt 调试、效果验证及异常记录。',
      '做过 Dify 本地化部署、Vibe Coding 网站上线、Python 整理 200+ 份用户反馈。'
    ],
    closing: ['AGENT', 'WORKFLOW', '2027'],
    label: '补充说明'
  },

  contact: {
    email: '3164175833@qq.com',
    github: 'https://github.com/999888666jiang-dev',
    note: '实习 / 校招机会欢迎邮件联系。',
    mission: '如果你也在把 AI 实验变成可上线的产品，欢迎邮件聊聊。',
    pills: ['实习 / 校招', 'Agent 工作流', 'Vue 3 / 前端', '深圳']
  },

  act: {
    kicker: 'BLOOM · OPENING',
    items: [
      '把 AI 实验做成能上线的作品。',
      'Agent 工作流 · Prompt 调试 · Dify 本地化部署',
      '软件工程 2027 届 · 深圳 · 求职中'
    ]
  },
  about: {
    summary: '广州新华学院软件工程本科（2023—2027，2027 届），方向大模型应用开发 / Agent 工作流：约 1.5 年 Coze 智能体与工作流实践，做过 Dify 本地化部署、Vibe Coding 上线网站与用户反馈整理。',
    mission: '把 AI 实验做成能上线的应用，让工作流可复核、可维护。',
    pills: ['大模型应用开发', 'Agent 工作流', 'Coze / Dify', 'Vue 3 / 前端交付']
  },

  skills: [
    { title: '大模型应用 / Agent 工作流', detail: 'Coze 智能体与工作流、Prompt 调试、效果验证、异常记录、Dify 本地化部署。' },
    { title: '应用交付 / 前端', detail: 'Vibe Coding、Vue 3、TypeScript、Vite、Tailwind CSS、GSAP、Three.js。' },
    { title: '数据与需求', detail: 'Python 数据整理、用户反馈归类、竞品分析、需求文档。' },
    { title: '设计表达', detail: '熟练使用 Figma 做页面结构、流程图与低/中保真原型。' }
  ],

  experience: [
    {
      company: '酣睡博士（深圳）科技有限公司',
      role: '测试开发工程师（实习）',
      period: '2024.07—2024.09',
      highlights: [
        '参与智能止鼾产品设计，完成 5 款竞品功能分析，提出 3 项差异化功能建议并获采纳。',
        '使用 Python 收集整理 200+ 份用户反馈，归类用户需求与体验问题，形成产品需求文档。',
        '参与原型机测试，发现并协助解决 2 个关键性能问题，协助完成测试记录与阶段性复盘。'
      ]
    },
    {
      company: '广州极飞科技股份有限公司',
      role: '无人机实验员（实习）',
      period: '2026.06—2026.08',
      highlights: [
        '参与无人机、智能农用无人车、智能灌溉等多型号部件质量测试，按需设计临时测试方案。',
        '分析飞行日志判断设备状态或故障原因，负责固件更新烧录、设备维护与维修。',
        '在复杂设备测试场景中做问题记录、异常归类与验证闭环，适应多任务推进。'
      ]
    }
  ],

  campus: [
    { title: '专业班长 / 创业协会会长 / 创业团队队长', period: '在校期间', detail: '组织班级事务与创业交流活动，负责项目分工与进度管理。' },
    { title: '“她轻创”直播电商赛 · 团队核心成员', period: '2024', detail: '负责直播选品、脚本编写与直播数据分析；综合奖省级银奖。' },
    { title: '“东宝杯”创新创业大赛 · 负责人', period: '在校期间', detail: '主导校级主题活动策划，协调社团资源整合与执行落地。' }
  ],

  education: { school: '广州新华学院', major: '软件工程', degree: '本科在读', period: '2023—2027', note: '2027 届' },

  honors: [
    '第十四届“挑战杯”广东大学生创业计划竞赛 省级银奖（团队）',
    '广东女大学生创新创业大赛“她轻创” 综合奖省级银奖（团队）',
    '中国国际大学生创新大赛（2024）校内赛 金奖、优胜奖（团队）'
  ],

  certificates: [
    '软件著作权：《神经网络荧光检测系统 V1.0》共同著作权人（2025 年登记）',
    'CAAC 多旋翼教员',
    'CAAC 中型超视距多旋翼机长',
    'CAAC 中型超视距直升机机长'
  ],

  // 作品集：静态网格先渲染前 6 条（NDA 只做文字说明，不进网格/不弹卡）
  // 状态色：live #22c55e / experiment #f59e0b / local #9ca3af / case-study #94a3b8
  projects: [
    {
      sourceType: 'external', externalUrl: 'https://999888666jiang-dev.github.io/jiangrui-ai-flight-lab/',
      slug: 'ai-flight-lab', title: 'AI Flight Lab 个人网站',
      value: '基于 Vue 3 + Vite 的个人作品与 AI 实验展示站，已上线',
      role: '制作者', stack: ['Vue 3', 'TypeScript', 'Vite', 'Tailwind CSS', 'GSAP', 'Three.js'],
      period: '2026.05–07',
      links: { live: 'https://999888666jiang-dev.github.io/jiangrui-ai-flight-lab/', repo: 'https://github.com/999888666jiang-dev/jiangrui-ai-flight-lab' },
      cover: 'media/projects/ai-flight-lab/cover.webp', images: [],
      status: 'live', category: 'web', featured: true, order: 1, alt: 'AI Flight Lab 首屏截图',
      rightsNote: '公开仓库 / 在线演示；未附 LICENSE，代码版权归作者', detailPath: null
    },
    {
      sourceType: 'external', externalUrl: 'https://999888666jiang-dev.github.io/daliuren/',
      slug: 'daliuren', title: '观象 · 大六壬',
      value: '可复核的大六壬排盘、古籍溯源与 AI 解读，已上线',
      role: '作者', stack: ['TypeScript', 'React', 'Vite', 'Vitest', 'Playwright'],
      period: '2026.09',
      links: { live: 'https://999888666jiang-dev.github.io/daliuren/', repo: 'https://github.com/999888666jiang-dev/daliuren' },
      cover: 'media/projects/daliuren/cover.webp', images: [],
      status: 'live', category: 'web', featured: true, order: 2, alt: '观象 · 大六壬 首屏截图',
      rightsNote: '公开仓库，未附 LICENSE；仅作作品展示', detailPath: null
    },
    {
      sourceType: 'external', externalUrl: 'https://999888666jiang-dev.github.io/qzfs-reader/',
      slug: 'qzfs-reader', title: '全职法师 · 阅读站',
      value: 'React/Vite 个人静态阅读站；展示阅读界面与前端实现，不展示小说正文',
      role: '作者', stack: ['JavaScript', 'React', 'Vite', 'GSAP'],
      period: '2026.11',
      links: { live: 'https://999888666jiang-dev.github.io/qzfs-reader/', repo: 'https://github.com/999888666jiang-dev/qzfs-reader' },
      cover: 'media/projects/qzfs-reader/cover.webp', images: [],
      status: 'live', category: 'reader', featured: false, order: 3, alt: '全职法师阅读站 UI 框架截图（不展示正文）',
      rightsNote: '仅展示阅读界面与前端实现；小说正文版权归原作者，不展示正文', detailPath: null
    },
    {
      sourceType: 'experiment', externalUrl: null,
      slug: 'yunyanfpv', title: '云烟 FPV · 飞控日志分析',
      value: 'React 19 + TypeScript + Vite + ECharts + Tailwind；实现 Betaflight/ArduPilot 黑盒日志解析与 PID/滤波分析路径；PID 分析准确性与可用性待验证',
      role: '作者', stack: ['React 19', 'TypeScript', 'Vite', 'ECharts', 'Tailwind CSS'],
      period: '2026.06',
      links: {}, cover: 'media/projects/yunyanfpv/cover.webp', images: [],
      status: 'wip', category: 'tool', featured: false, order: 4, alt: '云烟 FPV 工作台截图（实验，PID 效果待验证）',
      rightsNote: '本地实验；PID 分析效果未验证；不宣称准确或专业', detailPath: null
    },
    {
      sourceType: 'local', externalUrl: null,
      slug: 'tiefanwan', title: '铁饭碗 · 国家公职岗位查询',
      value: '31 条北京在报 + 13,936 条广东/江苏 2027 历史职位；保留官方公告/截止/笔试/来源；未部署',
      role: '作者', stack: ['HTML', 'CSS', 'JavaScript'],
      period: '2026.11',
      links: {}, cover: 'media/projects/tiefanwan/cover.webp', images: [],
      status: 'wip', category: 'tool', featured: false, order: 5, alt: '铁饭碗查询站数据列表截图（本地，未部署）',
      note: '数据来自官方公告，历史职位不标注为当前可报；公开前由用户确认。',
      rightsNote: '本地项目，未部署；数据来自官方公告，历史职位不标注为当前可报；公开前由用户确认', detailPath: null
    },
    {
      sourceType: 'case-study', externalUrl: null,
      slug: 'guwang-yuan-2', title: '源 · 蛊王源 2 代 — 设计复盘',
      value: '总设计方案 + 分层架构 + 为什么失败 + 复盘结论；非可用产品',
      role: '设计 / 开发', stack: ['Electron', 'JavaScript', 'DSH 插件', '本地 sidecar'],
      period: '2026.11',
      links: {}, cover: 'media/projects/guwang-yuan-2/cover.webp', images: [],
      status: 'archived', category: 'case-study', featured: false, order: 6, alt: '蛊王源 2 代窗口截图（过程证据）',
      rightsNote: '失败项目复盘；截图仅作过程证据，不宣称可用产品', detailPath: null
    }
  ],

  // NDA：真实名称保留在数据里，页面不渲染标题/链接/截图，只显示一句说明。
  ndaNote: {
    title: '毕业论文全流程工作台',
    display: '另有 1 个私有 / NDA 项目，面试时可说明。'
  },

  media: {
    hero: `${BASE}media/hero.mp4`,
    reveal: `${BASE}media/reveal.mp4`,
    poster: `${BASE}media/poster.jpg`,
    posterWebp: `${BASE}media/poster.webp`,
    lanyardFront: `${BASE}media/lanyard/front.jpg`,
    lanyardBack: `${BASE}media/lanyard/back.png`
  },

  placeholders: []
};
