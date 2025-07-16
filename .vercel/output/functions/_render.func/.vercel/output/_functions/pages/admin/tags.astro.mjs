/* empty css                                    */
import { c as createComponent, a as createAstro, f as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_CCeVW3kt.mjs';
import { e as ensureDatabaseData } from '../../chunks/migration_-jma2Y7z.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Tags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Tags;
  const cookies = Astro2.cookies;
  const isAuthenticated = cookies.get("admin_auth")?.value === "authenticated";
  if (!isAuthenticated) {
    return Astro2.redirect("/login");
  }
  await ensureDatabaseData();
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "\u6807\u7B7E\u7BA1\u7406", "activeSection": "tags" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <!-- 页面标题 --> <div class="flex items-center justify-between"> <div> <h1 class="text-2xl font-bold text-gray-900">标签管理</h1> <p class="text-gray-600 mt-1">管理文章标签</p> </div> </div> <!-- 标签统计 --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <div class="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white"> <div class="flex items-center"> <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path> </svg> </div> <div> <p class="text-sm font-medium text-white/80">总标签数</p> <p class="text-3xl font-bold" id="total-tags">-</p> </div> </div> </div> <div class="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 text-white"> <div class="flex items-center"> <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> </div> <div> <p class="text-sm font-medium text-white/80">使用标签的文章</p> <p class="text-3xl font-bold" id="tagged-posts">-</p> </div> </div> </div> </div> <!-- 标签云 --> <div class="bg-white rounded-2xl shadow-sm border border-gray-100"> <div class="p-6 border-b border-gray-100"> <h2 class="text-lg font-semibold text-gray-900">标签云</h2> <p class="text-sm text-gray-500 mt-1">点击标签查看使用该标签的文章</p> </div> <div class="p-6"> <div id="tags-cloud" class="flex flex-wrap gap-3"> <!-- 动态内容 --> </div> </div> </div> <!-- 标签详细列表 --> <div class="bg-white rounded-2xl shadow-sm border border-gray-100"> <div class="p-6 border-b border-gray-100"> <h2 class="text-lg font-semibold text-gray-900">标签详情</h2> </div> <div class="overflow-hidden"> <div class="overflow-x-auto"> <table class="w-full"> <thead class="bg-gray-50"> <tr> <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">标签名称</th> <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">使用次数</th> <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">相关文章</th> <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th> </tr> </thead> <tbody id="tags-table" class="bg-white divide-y divide-gray-100"> <!-- 动态内容 --> </tbody> </table> </div> </div> </div> </div> ` })} `;
}, "/home/zhuima/github/javascript/EeveNav/src/pages/admin/tags.astro", void 0);

const $$file = "/home/zhuima/github/javascript/EeveNav/src/pages/admin/tags.astro";
const $$url = "/admin/tags";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tags,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
