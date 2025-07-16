/* empty css                                 */
import { c as createComponent, f as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import { $ as $$PostList } from '../chunks/PostList_DxWMiiCc.mjs';
import { $ as $$Layout } from '../chunks/Layout_ByjgofFJ.mjs';
import { $ as $$PostLayout } from '../chunks/PostLayout_DAIf_Iy7.mjs';
import { g as getDatabase } from '../chunks/database_kl_IERA1.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const db = getDatabase();
  const allPosts = await db.getPosts();
  const formattedPosts = allPosts.map((post) => ({
    slug: post.slug,
    data: {
      title: post.title,
      date: post.date,
      des: post.des,
      cover: post.cover,
      category: post.category,
      tags: post.tags,
      external_url: post.external_url
    }
  }));
  const sortedPosts = formattedPosts.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
  const postsPerPage = 20;
  const lastPage = Math.ceil(sortedPosts.length / postsPerPage);
  const page = {
    data: sortedPosts,
    currentPage: 1,
    lastPage,
    url: {
      current: `/posts`,
      next: null,
      prev: null,
      first: null,
      last: null
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container mx-auto px-4"> <h1 class="text-3xl font-bold my-8">所有文章</h1> ${renderComponent($$result2, "PostLayout", $$PostLayout, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "PostList", $$PostList, { "page": page })} ` })} </div> ` })}`;
}, "/home/zhuima/github/javascript/EeveNav/src/pages/posts/index.astro", void 0);

const $$file = "/home/zhuima/github/javascript/EeveNav/src/pages/posts/index.astro";
const $$url = "/posts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
