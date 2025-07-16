import { g as getDatabase } from '../chunks/database_kl_IERA1.mjs';
export { renderers } from '../renderers.mjs';

const GET = async () => {
  const db = getDatabase();
  const posts = await db.getPosts();
  const categories = await db.getCategories();
  const tags = await db.getTags();
  const siteUrl = "https://eevenav.com";
  const currentDate = (/* @__PURE__ */ new Date()).toISOString();
  const staticPages = [
    {
      url: "",
      lastmod: currentDate,
      changefreq: "daily",
      priority: "1.0"
    },
    {
      url: "/blog",
      lastmod: currentDate,
      changefreq: "daily",
      priority: "0.9"
    },
    {
      url: "/about",
      lastmod: currentDate,
      changefreq: "monthly",
      priority: "0.6"
    }
  ];
  function generateSitemap() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    staticPages.forEach((page) => {
      xml += `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });
    posts.forEach((post) => {
      const lastmod = post.updated_at ? post.updated_at.toISOString() : post.date.toISOString();
      xml += `
  <url>
    <loc>${siteUrl}/posts/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    categories.forEach((category) => {
      xml += `
  <url>
    <loc>${siteUrl}/categories/${encodeURIComponent(category.name)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
    tags.forEach((tag) => {
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
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400"
      // 缓存24小时
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
