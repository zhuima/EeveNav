import fs from 'node:fs';
import nodePath from 'node:path';
import { g as getDatabase, a as getCollection } from './database_kl_IERA1.mjs';

async function migrateAddExternalUrlColumn() {
  console.log("Turso数据库external_url列已在表结构中定义，跳过迁移");
}
async function migrateToDatabase() {
  const db = getDatabase();
  try {
    const posts = await getCollection("blog");
    console.log(`正在迁移 ${posts.length} 篇文章到数据库...`);
    let successCount = 0;
    let errorCount = 0;
    for (const post of posts) {
      try {
        const contentPath = nodePath.join(process.cwd(), "src", "content", "blog", `${post.slug}.md`);
        let content = "";
        if (fs.existsSync(contentPath)) {
          content = fs.readFileSync(contentPath, "utf-8");
          content = content.replace(/^---[\s\S]*?---\n/, "");
        }
        const postData = {
          title: post.data.title,
          date: post.data.date,
          des: post.data.des,
          cover: post.data.cover,
          category: post.data.category || "unsorted",
          tags: post.data.tags || [],
          content,
          slug: post.slug
        };
        const postId = await db.addPost(postData);
        console.log(`✓ 成功迁移文章: ${post.data.title} (ID: ${postId})`);
        successCount++;
      } catch (error) {
        console.error(`✗ 迁移文章失败: ${post.data.title}`, error);
        errorCount++;
      }
    }
    console.log(`
迁移完成！`);
    console.log(`成功: ${successCount} 篇`);
    console.log(`失败: ${errorCount} 篇`);
    const allPosts = await db.getPosts();
    const categories = await db.getCategories();
    const tags = await db.getTags();
    console.log(`
数据库统计:`);
    console.log(`文章总数: ${allPosts.length}`);
    console.log(`分类数量: ${categories.length}`);
    console.log(`标签数量: ${tags.length}`);
  } catch (error) {
    console.error("迁移过程中发生错误:", error);
  }
}
async function isDatabaseInitialized() {
  const db = getDatabase();
  const posts = await db.getPosts();
  return posts.length > 0;
}
async function createSampleData() {
  const db = getDatabase();
  const samplePosts = [
    {
      title: "欢迎使用 EeveNav",
      date: /* @__PURE__ */ new Date("2024-01-01"),
      des: "这是一个示例文章，演示如何使用 EeveNav 导航系统",
      cover: "https://picsum.photos/800/400?random=1",
      category: "教程",
      tags: ["导航", "示例", "教程"],
      content: "# 欢迎使用 EeveNav\n\n这是一个功能强大的导航系统，帮助您轻松管理和分享优质资源。\n\n## 主要特性\n\n- 🔍 智能搜索功能\n- 📂 分类管理\n- 🏷️ 标签系统\n- 📱 响应式设计\n- 🎨 美观的界面\n\n## 如何使用\n\n1. 浏览资源\n2. 使用搜索功能\n3. 通过分类和标签筛选\n4. 点击链接访问资源\n\n祝您使用愉快！",
      slug: "welcome-to-eevenav"
    },
    {
      title: "React 学习资源汇总",
      date: /* @__PURE__ */ new Date("2024-01-15"),
      des: "收集了最优质的 React 学习资源，包括文档、教程、工具等",
      cover: "https://picsum.photos/800/400?random=2",
      category: "前端开发",
      tags: ["React", "JavaScript", "前端"],
      content: "# React 学习资源汇总\n\n## 官方资源\n\n- [React 官方文档](https://react.dev/)\n- [React 中文文档](https://zh-hans.react.dev/)\n\n## 优质教程\n\n- React 基础教程\n- React Hooks 详解\n- React 性能优化\n\n## 实用工具\n\n- Create React App\n- Next.js\n- Vite\n\n## 组件库\n\n- Ant Design\n- Material-UI\n- Chakra UI",
      slug: "react-learning-resources"
    },
    {
      title: "设计工具推荐",
      date: /* @__PURE__ */ new Date("2024-01-20"),
      des: "精选的设计工具，帮助提升设计效率和质量",
      cover: "https://picsum.photos/800/400?random=3",
      category: "设计",
      tags: ["设计", "工具", "UI/UX"],
      content: "# 设计工具推荐\n\n## 界面设计\n\n- **Figma** - 协作式设计工具\n- **Sketch** - Mac 平台设计软件\n- **Adobe XD** - Adobe 的设计工具\n\n## 原型制作\n\n- **Principle** - 交互原型工具\n- **Framer** - 高保真原型\n- **InVision** - 原型分享平台\n\n## 图标资源\n\n- **Feather Icons** - 简洁的图标库\n- **Heroicons** - 精美的 SVG 图标\n- **Lucide** - 开源图标集合",
      slug: "design-tools-recommendation"
    }
  ];
  try {
    for (const postData of samplePosts) {
      const existingPost = await db.getPostBySlug(postData.slug);
      if (!existingPost) {
        const postId = await db.addPost(postData);
        console.log(`✓ 创建示例文章: ${postData.title} (ID: ${postId})`);
      }
    }
  } catch (error) {
    console.error("创建示例数据失败:", error);
  }
}
async function ensureDatabaseData() {
  try {
    if (!await isDatabaseInitialized()) {
      console.log("数据库为空，尝试从内容文件迁移...");
      try {
        await migrateToDatabase();
      } catch (migrateError) {
        console.log("内容文件迁移失败，创建示例数据...");
        await createSampleData();
      }
    } else {
      console.log("数据库已有数据，跳过迁移");
    }
    await migrateAddExternalUrlColumn();
  } catch (error) {
    console.error("确保数据库数据时出错:", error);
  }
}

export { ensureDatabaseData as e };
