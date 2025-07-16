import type { APIRoute } from 'astro';
import { getDatabase } from '../lib/database';

export const GET: APIRoute = async () => {
  // 获取数据库数据
  const db = getDatabase();
  const posts = await db.getPosts();
  const categories = await db.getCategories();
  const tags = await db.getTags();

  // 获取站点信息
  const siteUrl = 'https://AffDirs.com'; // 请替换为实际域名
  const currentDate = new Date().toISOString();

  // 静态页面
  const staticPages = [
    {
      url: '',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: '/blog',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      url: '/about',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.6'
    }
  ];

  // 生成XML
  function generateSitemap() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // 添加静态页面
    staticPages.forEach(page => {
      xml += `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // 添加文章页面
    posts.forEach(post => {
      const lastmod = post.updated_at ? post.updated_at.toISOString() : post.date.toISOString();
      xml += `
  <url>
    <loc>${siteUrl}/posts/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // 添加分类页面
    categories.forEach(category => {
      xml += `
  <url>
    <loc>${siteUrl}/categories/${encodeURIComponent(category.name)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // 添加标签页面
    tags.forEach(tag => {
      xml += `
  <url>
    <loc>${siteUrl}/tags/${encodeURIComponent(tag)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    return xml;
  }

  const sitemap = generateSitemap();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400', // 缓存24小时
    },
  });
};