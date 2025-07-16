/* empty css                                       */
import { c as createComponent, a as createAstro, f as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import { $ as $$PostList } from '../../../chunks/PostList_DxWMiiCc.mjs';
import { $ as $$Layout } from '../../../chunks/Layout_ByjgofFJ.mjs';
import { $ as $$PostLayout } from '../../../chunks/PostLayout_DAIf_Iy7.mjs';
import { g as getDatabase } from '../../../chunks/database_kl_IERA1.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { category } = Astro2.params;
  const pageParam = Astro2.params.page || "1";
  const currentPage = parseInt(pageParam.split("/").pop() || "1");
  const db = getDatabase();
  const posts = await db.getPostsByCategory(category || "");
  const formattedPosts = posts.map((post) => ({
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
  const postsPerPage = 20;
  const totalPosts = sortedPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const start = (currentPage - 1) * postsPerPage;
  const end = start + postsPerPage;
  const paginatedPosts = sortedPosts.slice(start, end);
  const page = {
    data: paginatedPosts,
    start,
    end: Math.min(end, totalPosts),
    size: postsPerPage,
    total: totalPosts,
    currentPage,
    lastPage: totalPages,
    url: {
      current: `/categories/${category}/${currentPage}`,
      prev: currentPage > 1 ? `/categories/${category}/${currentPage - 1}` : null,
      next: currentPage < totalPages ? `/categories/${category}/${currentPage + 1}` : null,
      first: `/categories/${category}/1`,
      last: `/categories/${category}/${totalPages}`
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `\u5206\u7C7B: ${category}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class=""> <h1 class="text-3xl font-bold my-8 text-center">分类: ${category}</h1> ${renderComponent($$result2, "PostLayout", $$PostLayout, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "PostList", $$PostList, { "page": page })} ` })} </div> ` })}`;
}, "/home/zhuima/github/javascript/EeveNav/src/pages/categories/[category]/[...page].astro", void 0);

const $$file = "/home/zhuima/github/javascript/EeveNav/src/pages/categories/[category]/[...page].astro";
const $$url = "/categories/[category]/[...page]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
