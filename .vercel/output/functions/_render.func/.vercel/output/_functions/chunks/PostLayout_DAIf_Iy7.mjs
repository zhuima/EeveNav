import { c as createComponent, a as createAstro, m as maybeRenderHead, s as spreadAttributes, e as renderTemplate, f as renderComponent, d as addAttribute, b as renderSlot } from './astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import 'clsx';
import { g as getDatabase, a as getCollection } from './database_kl_IERA1.mjs';
/* empty css                        */

async function getCategories() {
  try {
    const db = getDatabase();
    return db.getCategories();
  } catch (error) {
    console.error("Error fetching categories from database:", error);
    const posts = await getCollection("blog");
    const categories = posts.reduce((acc, post) => {
      const category = post.data.category;
      if (!acc[category]) {
        acc[category] = { name: category, count: 0 };
      }
      acc[category].count++;
      return acc;
    }, {});
    return Object.values(categories);
  }
}
async function getTags() {
  try {
    const db = getDatabase();
    return db.getTags();
  } catch (error) {
    console.error("Error fetching tags from database:", error);
    const posts = await getCollection("blog");
    const uniqueTags = /* @__PURE__ */ new Set();
    posts.forEach((post) => {
      if (post.data.tags) {
        post.data.tags.forEach((tag) => uniqueTags.add(tag));
      }
    });
    return Array.from(uniqueTags);
  }
}
function getDate(dateObj) {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  return `${year}-${month}-${day}`;
}

const $$Astro = createAstro();
const $$MaxInput = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MaxInput;
  const props = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="relative"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path> </svg> </div> <input id="sidebar-search-input" class="flex h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="搜索文章..." type="text" autocomplete="off"${spreadAttributes(props)}> <!-- 搜索结果下拉框 --> <div id="sidebar-search-results" class="hidden absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50"> <div id="sidebar-search-loading" class="hidden p-4 text-center"> <div class="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> <p class="mt-2 text-sm text-gray-500">搜索中...</p> </div> <div id="sidebar-search-empty" class="p-4 text-center text-gray-500"> <p class="text-sm">开始输入以搜索文章</p> </div> <div id="sidebar-search-items"></div> </div> </div> `;
}, "/home/zhuima/github/javascript/EeveNav/src/components/Max/MaxInput.astro", void 0);

const $$Sidebar = createComponent(async ($$result, $$props, $$slots) => {
  const categories = await getCategories();
  const tags = await getTags();
  return renderTemplate`${maybeRenderHead()}<aside class="w-[260px] flex flex-col flex-shrink-0 ml-10" data-astro-cid-ssfzsv2f> <div data-astro-cid-ssfzsv2f> ${renderComponent($$result, "MaxInput", $$MaxInput, { "placeholder": "\u8BF7\u8F93\u5165\u5185\u5BB9", "data-astro-cid-ssfzsv2f": true })} </div> <div class="my-4" data-astro-cid-ssfzsv2f> <h3 class="font-bold title relative pl-4" data-astro-cid-ssfzsv2f>分类</h3> <ul data-astro-cid-ssfzsv2f> ${categories.map((category) => renderTemplate`<li class="py-4" data-astro-cid-ssfzsv2f> <a${addAttribute(`/categories/${category?.name}`, "href")} data-astro-cid-ssfzsv2f>${category?.name} <span class="ml-1" data-astro-cid-ssfzsv2f>(${category?.count})</span> </a> </li>`)} </ul> </div> <div class="my-4" data-astro-cid-ssfzsv2f> <h3 class="font-bold title relative pl-4" data-astro-cid-ssfzsv2f>标签</h3> <ul class="flex flex-wrap gap-4 mt-4" data-astro-cid-ssfzsv2f> ${tags.map((tag) => renderTemplate`<li class="px-1 py-2 text-xs border rounded-lg block leading-6 hover:border-ring" data-astro-cid-ssfzsv2f> <a${addAttribute(`/tags/${tag}`, "href")} data-astro-cid-ssfzsv2f>${tag} </a> </li>`)} </ul> </div> </aside> `;
}, "/home/zhuima/github/javascript/EeveNav/src/components/Sidebar.astro", void 0);

const $$PostLayout = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="flex mt-10 gap-8"> <div class="flex-1 min-w-0"> ${renderSlot($$result, $$slots["default"])} </div> <div class="hidden lg:block w-80 flex-shrink-0"> <!-- 粘性侧边栏容器，适合放广告 --> <div class="sticky top-24"> ${renderComponent($$result, "Sidebar", $$Sidebar, {})} </div> </div> </div>`;
}, "/home/zhuima/github/javascript/EeveNav/src/layouts/PostLayout.astro", void 0);

export { $$PostLayout as $, getDate as g };
