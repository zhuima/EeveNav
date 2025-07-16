/* empty css                                    */
import { c as createComponent, a as createAstro, f as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_CCeVW3kt.mjs';
import { e as ensureDatabaseData } from '../../chunks/migration_-jma2Y7z.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Posts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Posts;
  const cookies = Astro2.cookies;
  const isAuthenticated = cookies.get("admin_auth")?.value === "authenticated";
  if (!isAuthenticated) {
    return Astro2.redirect("/login");
  }
  await ensureDatabaseData();
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "\u6587\u7AE0\u7BA1\u7406", "activeSection": "posts" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <!-- 页面标题 --> <div class="flex items-center justify-between"> <div> <h1 class="text-2xl font-bold text-gray-900">文章管理</h1> <p class="text-gray-600 mt-1">管理所有文章内容</p> </div> <a href="/admin/posts/new" class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"> <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg>
新增文章
</a> </div> <!-- 文章列表 --> <div class="bg-white rounded-2xl shadow-sm border border-gray-100"> <div class="p-6 border-b border-gray-100"> <div class="flex items-center justify-between"> <h2 class="text-lg font-semibold text-gray-900">文章列表</h2> <div class="flex items-center space-x-4"> <input type="text" placeholder="搜索文章..." class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" id="search-input"> <select class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"> <option value="">所有分类</option> <option value="教程">教程</option> <option value="前端开发">前端开发</option> <option value="设计">设计</option> </select> </div> </div> </div> <div class="overflow-hidden"> <div class="overflow-x-auto"> <table class="w-full"> <thead class="bg-gray-50"> <tr> <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">文章信息</th> <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">分类</th> <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">标签</th> <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">发布时间</th> <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th> </tr> </thead> <tbody id="posts-table" class="bg-white divide-y divide-gray-100"> <!-- 动态内容 --> </tbody> </table> </div> </div> </div> </div> ` })} `;
}, "/home/zhuima/github/javascript/EeveNav/src/pages/admin/posts.astro", void 0);

const $$file = "/home/zhuima/github/javascript/EeveNav/src/pages/admin/posts.astro";
const $$url = "/admin/posts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Posts,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
