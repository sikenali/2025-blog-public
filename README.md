# 2025 Blog

一个基于 Next.js 13+ App Router 开发的现代化个人博客/网站系统，支持博客、项目、分享、博主等多个功能模块，使用 GitHub App 进行内容管理和部署。

## 技术栈

- **框架**: Next.js 13+ (App Router)
- **语言**: TypeScript
- **样式**: CSS Modules
- **状态管理**: React Hooks + 自定义 Store
- **内容管理**: GitHub App API
- **部署**: Vercel (推荐) 或其他支持 Next.js 的平台

## 目录结构

```
├── public/             # 静态资源目录
│   ├── blogs/          # 博客文章内容和图片
│   ├── images/         # 网站图片资源
│   ├── favicon.png     # 网站图标
│   └── manifest.json   # PWA 配置
├── scripts/            # 辅助脚本
├── src/                # 源代码目录
│   ├── app/            # App Router 路由和页面
│   │   ├── (home)/     # 首页相关组件和逻辑
│   │   ├── about/      # 关于页面
│   │   ├── blog/       # 博客相关页面
│   │   ├── bloggers/   # 博主管理页面
│   │   ├── image-toolbox/ # 图片工具箱
│   │   ├── music/      # 音乐列表
│   │   ├── projects/   # 项目管理页面
│   │   ├── rss.xml/    # RSS 路由
│   │   ├── share/      # 分享管理页面
│   │   ├── svgs/       # SVG 资源页面
│   │   └── write/      # 博客写作页面
│   ├── components/     # 通用组件
│   ├── config/         # 配置文件
│   ├── hooks/          # 自定义 React Hooks
│   ├── layout/         # 布局组件
│   ├── lib/            # 工具库和 API 客户端
│   ├── styles/         # 全局样式
│   └── svgs/           # SVG 图标
├── .gitignore          # Git 忽略文件
├── next.config.ts      # Next.js 配置
├── package.json        # 项目依赖
├── pnpm-lock.yaml      # pnpm 锁文件
└── tsconfig.json       # TypeScript 配置
```

## 核心功能模块

### 1. 博客系统
- 支持 Markdown 写作
- 图片上传和管理
- 博客分类和标签
- 博客预览和发布
- 批量删除博客

### 2. 项目管理
- 项目创建和编辑
- 项目图片上传
- 项目列表展示
- 网格视图和列表视图切换

### 3. 分享功能
- 分享内容创建和编辑
- Logo 上传
- 分享列表展示

### 4. 博主管理
- 博主信息管理
- 头像上传
- 博主卡片展示

### 5. 首页动态内容
- 可配置的卡片式布局
- 时钟、音乐、日历等组件
- 自定义内容展示

### 6. 图片工具箱
- 图片处理功能

### 7. RSS 支持
- 自动生成 RSS 订阅

## 安装和部署

### 1. 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 2. 部署到 Vercel

1. 在 Vercel 上创建新项目
2. 导入当前仓库
3. 无需额外配置，直接部署
4. 部署完成后会获得一个 Vercel 域名

### 3. 配置 GitHub App

1. 进入 GitHub 个人设置 -> Developer Settings
2. 创建新的 GitHub App
3. 设置权限：仅需仓库 write 权限
4. 创建 Private Key 并下载
5. 复制 App ID
6. 安装 GitHub App 到当前仓库
7. 在 Vercel 项目中配置环境变量：
   - `NEXT_PUBLIC_GITHUB_OWNER`: GitHub 用户名
   - `NEXT_PUBLIC_GITHUB_REPO`: 仓库名称
   - `NEXT_PUBLIC_GITHUB_BRANCH`: 分支名称（默认 main）
   - `NEXT_PUBLIC_GITHUB_APP_ID`: GitHub App ID

## 配置指南

### 1. 网站配置

首页右上角有配置按钮，可通过前端界面配置网站基本信息。

### 2. 首页内容配置

首页内容位于 `src/app/(home)/` 目录，包含多个卡片组件：
- `aritcle-card.tsx`: 文章卡片
- `art-card.tsx`: 艺术卡片
- `calendar-card.tsx`: 日历卡片
- `clock-card.tsx`: 时钟卡片
- `hi-card.tsx`: 欢迎卡片
- `music-card.tsx`: 音乐卡片
- `share-card.tsx`: 分享卡片

### 3. 移除 Liquid Grass 效果

进入 `src/layout/index.tsx` 文件，删除以下两行代码：
```tsx
const LiquidGrass = dynamic(() => import('@/components/liquid-grass'), { ssr: false })
// ...
<LiquidGrass /> // 第 53 行
```

## 写作指南

1. 进入 `/write` 页面开始写作
2. 点击 "+" 号添加图片（推荐先压缩，宽度不超过 1200px）
3. 将上传好的图片直接拖入文案编辑区
4. 点击右上角预览查看效果
5. 完成后点击发布

## 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| NEXT_PUBLIC_GITHUB_OWNER | GitHub 用户名 | yysuni |
| NEXT_PUBLIC_GITHUB_REPO | 仓库名称 | 2025-blog-public |
| NEXT_PUBLIC_GITHUB_BRANCH | 分支名称 | main |
| NEXT_PUBLIC_GITHUB_APP_ID | GitHub App ID | - |

## 开发注意事项

1. 项目使用 App Router，页面组件位于 `src/app/` 目录
2. 组件使用 `@/` 别名导入，对应 `src/` 目录
3. 静态资源放在 `public/` 目录
4. 博客内容存储在 `public/blogs/` 目录

tg 群：1月1号，才创建的 tg 群 https://t.me/public_blog_2025


## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
