import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_CY5S-nIT.mjs';
import { manifest } from './manifest_FnVTta_T.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/admin/categories.astro.mjs');
const _page3 = () => import('./pages/admin/posts/edit/_id_.astro.mjs');
const _page4 = () => import('./pages/admin/posts/new.astro.mjs');
const _page5 = () => import('./pages/admin/posts.astro.mjs');
const _page6 = () => import('./pages/admin/settings.astro.mjs');
const _page7 = () => import('./pages/admin/tags.astro.mjs');
const _page8 = () => import('./pages/admin.astro.mjs');
const _page9 = () => import('./pages/api/blog.astro.mjs');
const _page10 = () => import('./pages/api/test-filter.astro.mjs');
const _page11 = () => import('./pages/blog.astro.mjs');
const _page12 = () => import('./pages/categories/_category_/_---page_.astro.mjs');
const _page13 = () => import('./pages/login.astro.mjs');
const _page14 = () => import('./pages/page/_---page_.astro.mjs');
const _page15 = () => import('./pages/posts.astro.mjs');
const _page16 = () => import('./pages/posts/_---slug_.astro.mjs');
const _page17 = () => import('./pages/sitemap.xml.astro.mjs');
const _page18 = () => import('./pages/submit.astro.mjs');
const _page19 = () => import('./pages/tags/_tag_/_---page_.astro.mjs');
const _page20 = () => import('./pages/theme-test.astro.mjs');
const _page21 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/admin/categories.astro", _page2],
    ["src/pages/admin/posts/edit/[id].astro", _page3],
    ["src/pages/admin/posts/new.astro", _page4],
    ["src/pages/admin/posts.astro", _page5],
    ["src/pages/admin/settings.astro", _page6],
    ["src/pages/admin/tags.astro", _page7],
    ["src/pages/admin.astro", _page8],
    ["src/pages/api/blog.ts", _page9],
    ["src/pages/api/test-filter.ts", _page10],
    ["src/pages/blog.astro", _page11],
    ["src/pages/categories/[category]/[...page].astro", _page12],
    ["src/pages/login.astro", _page13],
    ["src/pages/page/[...page].astro", _page14],
    ["src/pages/posts/index.astro", _page15],
    ["src/pages/posts/[...slug].astro", _page16],
    ["src/pages/sitemap.xml.ts", _page17],
    ["src/pages/submit.astro", _page18],
    ["src/pages/tags/[tag]/[...page].astro", _page19],
    ["src/pages/theme-test.astro", _page20],
    ["src/pages/index.astro", _page21]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "a7298d5c-61ce-4e3f-9918-27ef59152789",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
