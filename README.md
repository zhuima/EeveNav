# AffDirs 🧭

> 精选资源导航 - 一个现代化的资源收藏与分享平台

AffDirs 是一个基于 Astro 框架构建的现代化资源导航网站，专为收藏、管理和分享优质网络资源而设计。它提供了直观的用户界面、强大的搜索功能和完整的内容管理系统。

## ✨ 特性

### 🔍 智能搜索
- **实时搜索** - 支持标题、描述、分类和标签的全文搜索
- **防抖优化** - 300ms 防抖机制，提升搜索体验
- **快捷键支持** - `⌘+K` 或 `Ctrl+K` 快速打开搜索

### 📂 内容管理
- **分类系统** - 灵活的资源分类管理
- **标签功能** - 多标签支持，便于资源标记和筛选
- **外部链接** - 支持直接跳转到外部资源
- **图片封面** - 美观的卡片式资源展示

### 🎨 用户体验
- **响应式设计** - 完美适配桌面和移动设备
- **暗色模式** - 支持明暗主题切换
- **现代UI** - 基于 UnoCSS 的现代化界面设计
- **平滑动画** - 优雅的过渡效果和交互动画

### 🛠️ 管理功能
- **内容管理** - 完整的后台管理系统
- **批量操作** - 支持文章的增删改查
- **数据统计** - 资源数量和分类统计
- **访问控制** - 简单的管理员认证系统

## 🚀 技术栈

- **前端框架**: [Astro](https://astro.build/) - 现代静态站点生成器
- **运行时**: [Node.js](https://nodejs.org/) - 服务端渲染支持
- **样式引擎**: [UnoCSS](https://unocss.dev/) - 原子化CSS框架
- **数据库**: [Turso](https://turso.tech/) - 边缘SQLite数据库
- **类型安全**: [TypeScript](https://www.typescriptlang.org/) - 静态类型检查
- **代码规范**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) - 代码质量保证

## 📦 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm 或 yarn 或 pnpm

### 安装依赖

```bash
# 克隆项目
git clone <your-repo-url>
cd AffDirs

# 安装依赖
npm install
# 或者
yarn install
```

### 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 配置 Turso 数据库：
```env
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

> 💡 **获取 Turso 凭据**:
> 1. 注册 [Turso 账号](https://turso.tech/)
> 2. 创建新数据库
> 3. 获取数据库URL和认证令牌

### 启动开发服务器

```bash
# 启动开发服务器
npm run dev

# 项目将在 http://localhost:4321 启动
```

### 构建生产版本

```bash
# 类型检查并构建
npm run build

# 预览生产版本
npm run preview
```

## 📁 项目结构

```
AffDirs/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── Header.astro    # 网站头部（含搜索）
│   │   ├── Footer.astro    # 网站底部
│   │   ├── Sidebar.astro   # 侧边栏
│   │   └── Max/            # 搜索组件
│   ├── layouts/            # 页面布局
│   │   ├── Layout.astro    # 基础布局
│   │   ├── PostLayout.astro # 文章页布局
│   │   └── AdminLayout.astro # 管理后台布局
│   ├── pages/              # 页面路由
│   │   ├── index.astro     # 首页
│   │   ├── blog.astro      # 博客列表
│   │   ├── about.astro     # 关于页面
│   │   ├── login.astro     # 登录页面
│   │   ├── admin.astro     # 管理后台
│   │   ├── posts/          # 文章页面
│   │   ├── categories/     # 分类页面
│   │   ├── tags/           # 标签页面
│   │   └── api/            # API 路由
│   ├── lib/                # 核心库
│   │   ├── database.ts     # 数据库操作
│   │   └── migration.ts    # 数据迁移
│   └── utils/              # 工具函数
├── public/                 # 静态资源
├── dist/                   # 构建输出
└── package.json
```

## 🗄️ 数据库

### 数据模型

项目使用 Turso（边缘SQLite）作为数据库，包含以下主要表：

- **posts** - 文章/资源主表
- **categories** - 分类表
- **tags** - 标签表
- **post_tags** - 文章标签关联表

### 数据库初始化

数据库表会在应用启动时自动创建。如需手动迁移数据：

```bash
# 如果有本地 SQLite 数据需要迁移到 Turso
# 数据会自动同步，无需手动操作
```

## 🔧 配置

### 环境变量

| 变量名 | 描述 | 必需 |
|--------|------|------|
| `TURSO_DATABASE_URL` | Turso 数据库连接URL | ✅ |
| `TURSO_AUTH_TOKEN` | Turso 认证令牌 | ✅ |

### UnoCSS 配置

项目使用 UnoCSS 进行样式管理，配置文件位于 `uno.config.ts`：

```typescript
// 支持暗色模式、自定义颜色主题等
export default defineConfig({
  // 配置详情...
})
```

## 📡 API 文档

### 文章 API

**获取所有文章**
```http
GET /api/blog?action=posts
```

**搜索文章**
```http
GET /api/blog?search=关键词
```

**添加文章**
```http
POST /api/blog
Content-Type: application/json

{
  "action": "add",
  "data": {
    "title": "文章标题",
    "date": "2024-01-01T00:00:00.000Z",
    "des": "文章描述",
    "cover": "https://example.com/cover.jpg",
    "category": "分类名称",
    "tags": ["标签1", "标签2"],
    "content": "文章内容",
    "slug": "article-slug",
    "external_url": "https://example.com" // 可选
  }
}
```

### 分类和标签 API

**获取分类列表**
```http
GET /api/blog?action=categories
```

**获取标签列表**
```http
GET /api/blog?action=tags
```

## 🚀 部署

### Cloudflare Pages

1. **准备环境变量**
   在 Cloudflare Pages 设置中添加：
   ```
   TURSO_DATABASE_URL=your-database-url
   TURSO_AUTH_TOKEN=your-auth-token
   ```

2. **构建设置**
   ```
   Build command: npm run build
   Build output directory: dist
   ```

3. **部署**
   ```bash
   # 推送到 Git 仓库，Cloudflare Pages 会自动部署
   git push origin main
   ```

### 其他平台

项目支持部署到任何支持 Node.js SSR 的平台：

- **Vercel**: 零配置部署
- **Netlify**: 支持边缘函数
- **Railway**: 全栈应用平台
- **自托管**: 使用 Docker 或 PM2

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run lint`            | Run ESLint to check code quality                |
| `npm run lint:fix`        | Run ESLint and fix issues automatically         |

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 开发流程

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交 Pull Request

### 代码规范

- 使用 ESLint 和 Prettier 保持代码风格一致
- 遵循 TypeScript 最佳实践
- 为新功能添加适当的注释
- 确保构建通过: `npm run build`

## 📝 更新日志

### v0.0.1 (Current)
- ✅ 基础功能实现
- ✅ Turso 数据库集成
- ✅ 搜索功能
- ✅ 管理后台
- ✅ 响应式设计
- ✅ 暗色模式支持

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Astro](https://astro.build/) - 优秀的现代化框架
- [Turso](https://turso.tech/) - 强大的边缘数据库
- [UnoCSS](https://unocss.dev/) - 灵活的原子化CSS
- [Tabler Icons](https://tabler-icons.io/) - 精美的图标库

## 👀 Want to learn more?

Feel free to check [Astro documentation](https://docs.astro.build) or jump into the [Astro Discord server](https://astro.build/chat).

---

<div align="center">

**Made with ❤️ using Astro**

</div>
