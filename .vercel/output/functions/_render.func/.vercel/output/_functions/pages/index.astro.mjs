/* empty css                                 */
import { c as createComponent, f as renderComponent, e as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_ByjgofFJ.mjs';
import { g as getDatabase } from '../chunks/database_kl_IERA1.mjs';
import { e as ensureDatabaseData } from '../chunks/migration_-jma2Y7z.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  await ensureDatabaseData();
  const db = getDatabase();
  const allPosts = await db.getPosts();
  const posts = allPosts.filter((post) => post.external_url && post.external_url.trim() !== "");
  const categories = await db.getCategories();
  const tags = await db.getTags();
  const seoConfig = {
    title: "EeveNav - \u7CBE\u9009\u8D44\u6E90\u5BFC\u822A | \u53D1\u73B0\u4F18\u8D28\u5DE5\u5177\u3001\u6559\u7A0B\u4E0E\u7075\u611F",
    description: `\u7CBE\u5FC3\u6574\u7406\u7684${posts.length}+\u4F18\u8D28\u7B2C\u4E09\u65B9\u8D44\u6E90\uFF0C\u6DB5\u76D6${categories.length}\u4E2A\u5206\u7C7B\u3002\u5305\u542B\u5F00\u53D1\u5DE5\u5177\u3001\u8BBE\u8BA1\u8D44\u6E90\u3001\u5B66\u4E60\u6559\u7A0B\u3001AI\u5DE5\u5177\u7B49\u3002\u8BA9\u6BCF\u4E00\u6B21\u641C\u7D22\u90FD\u6709\u4EF7\u503C\uFF0C\u52A9\u529B\u60A8\u7684\u521B\u610F\u4E0E\u5F00\u53D1\u5DE5\u4F5C\u3002`,
    keywords: [
      "\u8D44\u6E90\u5BFC\u822A",
      "\u5F00\u53D1\u5DE5\u5177",
      "\u8BBE\u8BA1\u8D44\u6E90",
      "\u5B66\u4E60\u6559\u7A0B",
      "\u521B\u610F\u7075\u611F",
      "AI\u5DE5\u5177",
      "\u514D\u8D39\u56FE\u6807",
      "\u7F16\u7A0B\u5B66\u4E60",
      "\u524D\u7AEF\u5F00\u53D1",
      "\u8BBE\u8BA1\u5DE5\u5177",
      "EeveNav",
      "\u8D44\u6E90\u6536\u85CF",
      "\u5DE5\u5177\u63A8\u8350",
      "\u6280\u672F\u535A\u5BA2"
    ],
    type: "website",
    image: "/og-home.jpg",
    imageAlt: "EeveNav - \u7CBE\u9009\u8D44\u6E90\u5BFC\u822A\uFF0C\u53D1\u73B0\u4F18\u8D28\u5DE5\u5177\u3001\u6559\u7A0B\u4E0E\u7075\u611F"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { ...seoConfig }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30"> <!-- Hero Section - 搜索为中心 --> <section class="w-full pt-16 pb-12"> <div class="max-w-7xl mx-auto px-6 lg:px-8 text-center"> <!-- 主标题 --> <header class="mb-8"> <h1 class="text-6xl md:text-7xl font-bold tracking-tight mb-4"> <span class="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
发现
</span> <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
优质资源
</span> </h1> <p class="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
精心整理的工具、文章、教程和灵感合集
<br> <span class="text-gray-500">让每一次搜索都有价值</span> </p> </header> <!-- 核心搜索区域 --> <div class="relative max-w-4xl mx-auto mb-16"> <!-- 背景装饰 --> <div class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div> <!-- 搜索框容器 --> <div class="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8"> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none"> <div class="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"> <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"> <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path> </svg> </div> </div> <input type="text" id="search-input" name="search" placeholder="搜索你需要的资源、工具、文章..." class="w-full pl-20 pr-6 py-6 text-xl font-medium bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-900" autocomplete="off" role="searchbox" aria-label="搜索资源"> <!-- 搜索建议 --> <div class="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-sm text-gray-400"> <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">⌘</kbd> <kbd class="px-2 py-1 bg-gray-100 rounded text-xs">K</kbd> </div> </div> <!-- 热门搜索标签 --> <div class="flex flex-wrap justify-center gap-2 mt-6 pt-6 border-t border-gray-100"> <span class="text-sm text-gray-500 mr-2">热门：</span> <button class="hot-tag px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors" data-search="设计工具" aria-label="搜索设计工具">设计工具</button> <button class="hot-tag px-3 py-1 text-sm text-purple-600 bg-purple-50 rounded-full hover:bg-purple-100 transition-colors" data-search="开发资源" aria-label="搜索开发资源">开发资源</button> <button class="hot-tag px-3 py-1 text-sm text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-colors" data-search="免费图标" aria-label="搜索免费图标">免费图标</button> <button class="hot-tag px-3 py-1 text-sm text-orange-600 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors" data-search="AI 工具" aria-label="搜索AI工具">AI 工具</button> </div> </div> </div> <!-- 统计信息 --> <div class="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12"> <div class="text-center"> <div class="text-3xl font-bold text-gray-900"${addAttribute(`\u5171${posts.length}\u4E2A\u7CBE\u9009\u8D44\u6E90`, "aria-label")}>${posts.length}</div> <div class="text-sm text-gray-500 font-medium">精选资源</div> </div> <div class="text-center"> <div class="text-3xl font-bold text-gray-900"${addAttribute(`\u5171${categories.length}\u4E2A\u5206\u7C7B`, "aria-label")}>${categories.length}</div> <div class="text-sm text-gray-500 font-medium">分类</div> </div> <div class="text-center"> <div class="text-3xl font-bold text-gray-900"${addAttribute(`\u5171${tags.length}\u4E2A\u6807\u7B7E`, "aria-label")}>${tags.length}</div> <div class="text-sm text-gray-500 font-medium">标签</div> </div> </div> </div> </section> <!-- 分类过滤器 --> <section class="w-full mb-12" aria-label="资源分类过滤器"> <div class="max-w-7xl mx-auto px-6 lg:px-8"> <h2 class="sr-only">按分类筛选资源</h2> <div class="flex flex-wrap justify-center gap-3 mb-12" role="group" aria-label="分类筛选按钮"> <button class="filter-btn active px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 bg-gray-900 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" data-category="all" aria-pressed="true" aria-label="显示全部资源">
全部资源
</button> ${categories.map((category) => renderTemplate`<button class="filter-btn px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200 transform hover:-translate-y-0.5"${addAttribute(category.name, "data-category")} aria-pressed="false"${addAttribute(`\u663E\u793A${category.name}\u5206\u7C7B\uFF0C\u5171${category.count}\u4E2A\u8D44\u6E90`, "aria-label")}> ${category.name} <span class="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">${category.count}</span> </button>`)} </div> </div> </section> <!-- 资源卡片网格 --> <section class="w-full pb-20" aria-label="资源列表"> <div class="max-w-7xl mx-auto px-6 lg:px-8"> <h2 class="sr-only">精选资源列表</h2> <div id="resources-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> ${posts.map((post) => renderTemplate`<article class="resource-card group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100/50 overflow-hidden"${addAttribute(post.category, "data-category")}${addAttribute(post.tags.join(","), "data-tags")}${addAttribute(post.title.toLowerCase(), "data-title")}${addAttribute(post.des.toLowerCase(), "data-description")} itemscope itemtype="https://schema.org/CreativeWork"> <!-- 封面图片 --> <div class="relative overflow-hidden bg-gray-50"> <img${addAttribute(post.cover, "src")}${addAttribute(`${post.title}\u7684\u9884\u89C8\u56FE`, "alt")} class="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" itemprop="image"> <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> </div> <div class="p-6"> <!-- 分类标签 --> <div class="flex items-center justify-between mb-3"> <span class="inline-block px-3 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full" itemprop="genre"> ${post.category} </span> </div> <!-- 标题和描述 --> <h3 class="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-blue-600 transition-colors" itemprop="name"> ${post.title} </h3> <p class="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed" itemprop="description"> ${post.des} </p> <!-- 标签 --> <div class="flex flex-wrap gap-1 mb-6"> ${post.tags.slice(0, 3).map((tag) => renderTemplate`<span class="inline-block px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded-md font-medium" itemprop="keywords"> ${tag} </span>`)} ${post.tags.length > 3 && renderTemplate`<span class="inline-block px-2 py-1 text-xs bg-gray-50 text-gray-500 rounded-md">
+${post.tags.length - 3} </span>`} </div> <!-- 操作按钮 --> <div class="flex gap-2"> ${post.external_url && renderTemplate`<a${addAttribute(post.external_url, "href")} target="_blank" rel="noopener noreferrer" class="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"${addAttribute(`\u8BBF\u95EE${post.title}\u7684\u5B98\u65B9\u7F51\u7AD9`, "aria-label")} itemprop="url">
访问
<svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg> </a>`} <a${addAttribute(`/posts/${post.slug}`, "href")} class="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 transform hover:-translate-y-0.5"${addAttribute(`\u67E5\u770B${post.title}\u7684\u8BE6\u7EC6\u4FE1\u606F`, "aria-label")}>
详情
</a> </div> </div> </article>`)} </div> <!-- 无结果提示 --> <div id="no-results" class="hidden text-center py-20" role="status" aria-live="polite"> <div class="max-w-md mx-auto"> <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center"> <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </div> <h3 class="text-xl font-semibold text-gray-900 mb-2">没有找到相关资源</h3> <p class="text-gray-600 mb-6">试试调整搜索关键词或选择其他分类</p> <button onclick="document.getElementById('search-input').value = ''; document.querySelector('[data-category=all]').click();" class="inline-flex items-center px-6 py-3 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors" aria-label="清空搜索条件并重新开始">
重新搜索
</button> </div> </div> </div> </section> </main> ` })}  `;
}, "/home/zhuima/github/javascript/EeveNav/src/pages/index.astro", void 0);

const $$file = "/home/zhuima/github/javascript/EeveNav/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
