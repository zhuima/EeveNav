/* empty css                                 */
import { c as createComponent, f as renderComponent, e as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import { $ as $$PostList } from '../chunks/PostList_DxWMiiCc.mjs';
import { $ as $$Layout } from '../chunks/Layout_ByjgofFJ.mjs';
import { $ as $$PostLayout } from '../chunks/PostLayout_DAIf_Iy7.mjs';
import { g as getDatabase } from '../chunks/database_kl_IERA1.mjs';
import { e as ensureDatabaseData } from '../chunks/migration_-jma2Y7z.mjs';
export { renderers } from '../renderers.mjs';

const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  await ensureDatabaseData();
  const tags = [
    {
      name: "\u6700\u65B0",
      slug: ""
    },
    {
      name: "\u8BBE\u8BA1\u8D44\u6E90",
      slug: "\u8BBE\u8BA1\u8D44\u6E90"
    }
  ];
  const db = getDatabase();
  const allPosts = await db.getPosts();
  const blogPosts = allPosts.filter((post) => !post.external_url || post.external_url.trim() === "");
  const categories = await db.getCategories();
  const formattedPosts = blogPosts.map((post) => ({
    slug: post.slug,
    data: {
      title: post.title,
      date: post.date,
      des: post.des,
      cover: post.cover,
      category: post.category,
      tags: post.tags
    }
  }));
  const sortedPosts = formattedPosts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
  const latestPosts = sortedPosts.slice(0, 20);
  const lastPage = Math.ceil(sortedPosts.length / 20);
  const page = {
    data: latestPosts,
    currentPage: 1,
    lastPage,
    url: {
      cuurent: `/blog/page/1`,
      next: null,
      prev: null,
      first: null,
      last: null
    }
  };
  if (lastPage > 1) {
    page.url.next = `/blog/page/2`;
    page.url.last = `/blog/page/${lastPage}`;
  }
  const seoConfig = {
    title: `\u535A\u5BA2\u6587\u7AE0 - EeveNav | ${allPosts.length}\u7BC7\u7CBE\u9009\u6280\u672F\u6587\u7AE0`,
    description: `\u63A2\u7D22${allPosts.length}\u7BC7\u7CBE\u9009\u6280\u672F\u6587\u7AE0\uFF0C\u6DB5\u76D6${categories.length}\u4E2A\u5206\u7C7B\u3002\u5305\u542B\u524D\u7AEF\u5F00\u53D1\u3001\u8BBE\u8BA1\u8D44\u6E90\u3001\u5DE5\u5177\u63A8\u8350\u3001\u7F16\u7A0B\u6280\u5DE7\u7B49\u5185\u5BB9\u3002\u5206\u4EAB\u6700\u65B0\u7684\u6280\u672F\u8D8B\u52BF\u548C\u5B9E\u7528\u7ECF\u9A8C\u3002`,
    keywords: [
      "\u6280\u672F\u535A\u5BA2",
      "\u524D\u7AEF\u5F00\u53D1",
      "\u8BBE\u8BA1\u8D44\u6E90",
      "\u5DE5\u5177\u63A8\u8350",
      "\u7F16\u7A0B\u6280\u5DE7",
      "\u6280\u672F\u5206\u4EAB",
      "\u5F00\u53D1\u7ECF\u9A8C",
      "\u8BBE\u8BA1\u7075\u611F",
      "Web\u5F00\u53D1",
      "\u7A0B\u5E8F\u5458",
      "EeveNav\u535A\u5BA2",
      "\u6280\u672F\u6587\u7AE0",
      "\u7F16\u7A0B\u6559\u7A0B"
    ],
    type: "website",
    image: "/og-blog.jpg",
    imageAlt: "EeveNav\u6280\u672F\u535A\u5BA2 - \u7CBE\u9009\u6280\u672F\u6587\u7AE0\u4E0E\u5F00\u53D1\u7ECF\u9A8C\u5206\u4EAB"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { ...seoConfig }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="py-6 sm:py-8"> <!-- 页面标题和描述 --> <header class="mb-8"> <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">博客文章</h1> <p class="text-lg text-gray-600 max-w-3xl">
精选${allPosts.length}篇技术文章，涵盖前端开发、设计资源、工具推荐等多个领域。
          分享最新的技术趋势和实用开发经验。
</p> </header> <!-- 面包屑导航 --> <nav class="mb-6" aria-label="面包屑导航"> <ol class="flex items-center space-x-2 text-sm text-gray-500"> <li> <a href="/" class="hover:text-gray-700 transition-colors">首页</a> </li> <li> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </li> <li aria-current="page" class="text-gray-900 font-medium">博客文章</li> </ol> </nav> <!-- 标签过滤器 --> <section class="mb-8" aria-label="文章分类标签"> <h2 class="sr-only">按分类筛选文章</h2> <div class="flex flex-wrap pt-4 sm:pt-6 w-full gap-2 sm:gap-4"> ${tags.map((tag) => renderTemplate`<a${addAttribute(tag.slug ? `/tags/${tag.slug}` : "/blog", "href")} class="block"${addAttribute(tag.slug ? `\u67E5\u770B${tag.name}\u5206\u7C7B\u7684\u6587\u7AE0` : "\u67E5\u770B\u6240\u6709\u6700\u65B0\u6587\u7AE0", "aria-label")}> <span${addAttribute(`inline-block px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-full transition-colors ${tag.slug === "" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`, "class")}> ${tag.name} </span> </a>`)} </div> </section> <!-- 文章列表 --> <main> ${renderComponent($$result2, "PostLayout", $$PostLayout, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "PostList", $$PostList, { "page": page })} ` })} </main> <!-- 统计信息 --> <aside class="mt-12 p-6 bg-gray-50 rounded-xl"> <h2 class="text-lg font-semibold text-gray-900 mb-4">博客统计</h2> <div class="grid grid-cols-2 md:grid-cols-3 gap-4"> <div class="text-center"> <div class="text-2xl font-bold text-blue-600">${allPosts.length}</div> <div class="text-sm text-gray-600">总文章数</div> </div> <div class="text-center"> <div class="text-2xl font-bold text-green-600">${categories.length}</div> <div class="text-sm text-gray-600">分类数量</div> </div> <div class="text-center md:col-span-1 col-span-2"> <div class="text-2xl font-bold text-purple-600">${lastPage}</div> <div class="text-sm text-gray-600">总页数</div> </div> </div> </aside> </div> </div> ` })}`;
}, "/home/zhuima/github/javascript/EeveNav/src/pages/blog.astro", void 0);

const $$file = "/home/zhuima/github/javascript/EeveNav/src/pages/blog.astro";
const $$url = "/blog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blog,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
