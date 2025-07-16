/* empty css                                    */
import { c as createComponent, a as createAstro, f as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../chunks/AdminLayout_CCeVW3kt.mjs';
import { e as ensureDatabaseData } from '../../chunks/migration_-jma2Y7z.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$Categories = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Categories;
  const cookies = Astro2.cookies;
  const isAuthenticated = cookies.get("admin_auth")?.value === "authenticated";
  if (!isAuthenticated) {
    return Astro2.redirect("/login");
  }
  await ensureDatabaseData();
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "\u5206\u7C7B\u7BA1\u7406", "activeSection": "categories" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <!-- 页面标题 --> <div class="flex items-center justify-between"> <div> <h1 class="text-2xl font-bold text-gray-900">分类管理</h1> <p class="text-gray-600 mt-1">管理文章分类</p> </div> <button id="add-category-btn" class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"> <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path> </svg>
新增分类
</button> </div> <!-- 分类统计 --> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"> <div class="flex items-center"> <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path> </svg> </div> <div> <p class="text-sm font-medium text-white/80">总分类数</p> <p class="text-3xl font-bold" id="total-categories">-</p> </div> </div> </div> <div class="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white"> <div class="flex items-center"> <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path> </svg> </div> <div> <p class="text-sm font-medium text-white/80">总文章数</p> <p class="text-3xl font-bold" id="total-posts">-</p> </div> </div> </div> <div class="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white"> <div class="flex items-center"> <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4"> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> </div> <div> <p class="text-sm font-medium text-white/80">平均文章数</p> <p class="text-3xl font-bold" id="avg-posts">-</p> </div> </div> </div> </div> <!-- 分类列表 --> <div class="bg-white rounded-2xl shadow-sm border border-gray-100"> <div class="p-6 border-b border-gray-100"> <h2 class="text-lg font-semibold text-gray-900">分类列表</h2> </div> <div class="overflow-hidden"> <div class="overflow-x-auto"> <table class="w-full"> <thead class="bg-gray-50"> <tr> <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">分类名称</th> <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">文章数量</th> <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">创建时间</th> <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th> </tr> </thead> <tbody id="categories-table" class="bg-white divide-y divide-gray-100"> <!-- 动态内容 --> </tbody> </table> </div> </div> </div> </div>  <div id="category-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4"> <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"> <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50"> <h3 class="text-xl font-bold text-gray-900">添加新分类</h3> </div> <form id="category-form" class="p-6"> <div class="mb-6"> <label class="block text-sm font-semibold text-gray-900 mb-2">分类名称 *</label> <input type="text" name="categoryName" required class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="请输入分类名称"> </div> <div class="flex justify-end space-x-4"> <button type="button" id="cancel-category-btn" class="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
取消
</button> <button type="submit" class="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
添加分类
</button> </div> </form> </div> </div> ` })} `;
}, "/home/zhuima/github/javascript/EeveNav/src/pages/admin/categories.astro", void 0);

const $$file = "/home/zhuima/github/javascript/EeveNav/src/pages/admin/categories.astro";
const $$url = "/admin/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Categories,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
