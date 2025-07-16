/* empty css                                    */
import { c as createComponent, a as createAstro, f as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import { $ as $$PostList } from '../../chunks/PostList_DxWMiiCc.mjs';
import { $ as $$Layout } from '../../chunks/Layout_ByjgofFJ.mjs';
import { $ as $$PostLayout } from '../../chunks/PostLayout_DAIf_Iy7.mjs';
import { a as getCollection } from '../../chunks/database_kl_IERA1.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
async function getStaticPaths({ paginate }) {
  const allPosts = await getCollection("blog");
  const result = paginate(allPosts, {
    pageSize: 20,
    // 自定义路由格式
    getPageNumbers: ({ totalPages }) => Array.from({ length: totalPages }, (_, i) => i + 1)
  });
  return result;
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { page } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class=""> ${renderComponent($$result2, "PostLayout", $$PostLayout, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "PostList", $$PostList, { "page": page })} ` })} </div> ` })}`;
}, "/home/zhuima/github/javascript/EeveNav/src/pages/page/[...page].astro", void 0);

const $$file = "/home/zhuima/github/javascript/EeveNav/src/pages/page/[...page].astro";
const $$url = "/page/[...page]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
