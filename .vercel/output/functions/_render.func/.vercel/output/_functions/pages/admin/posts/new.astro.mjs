/* empty css                                       */
import { c as createComponent, f as renderComponent, e as renderTemplate, m as maybeRenderHead } from '../../../chunks/astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import { $ as $$AdminLayout } from '../../../chunks/AdminLayout_CCeVW3kt.mjs';
/* empty css                                     */
export { renderers } from '../../../renderers.mjs';

const $$New = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "\u65B0\u5EFA\u6587\u7AE0", "activeSection": "posts", "data-astro-cid-evsmad5u": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50" data-astro-cid-evsmad5u> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" data-astro-cid-evsmad5u> <!-- 页面头部 --> <div class="mb-6 flex items-center justify-between" data-astro-cid-evsmad5u> <div data-astro-cid-evsmad5u> <h1 class="text-2xl font-bold text-gray-900" data-astro-cid-evsmad5u>新建文章</h1> <p class="text-gray-600 mt-1" data-astro-cid-evsmad5u>使用 Markdown 编写你的文章</p> </div> <div class="flex items-center gap-3" data-astro-cid-evsmad5u> <a href="/admin/posts" class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" data-astro-cid-evsmad5u>
取消
</a> <button id="save-draft-btn" class="px-4 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors" data-astro-cid-evsmad5u>
保存草稿
</button> <button id="publish-btn" class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm" data-astro-cid-evsmad5u>
发布文章
</button> </div> </div> <form id="post-form" class="space-y-6" data-astro-cid-evsmad5u> <!-- 基本信息 --> <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-astro-cid-evsmad5u> <h2 class="text-lg font-semibold text-gray-900 mb-4" data-astro-cid-evsmad5u>基本信息</h2> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" data-astro-cid-evsmad5u> <!-- 标题 --> <div class="lg:col-span-2" data-astro-cid-evsmad5u> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-evsmad5u>文章标题 *</label> <input type="text" id="title" name="title" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="请输入文章标题" data-astro-cid-evsmad5u> </div> <!-- 别名 --> <div data-astro-cid-evsmad5u> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-evsmad5u>文章别名 (URL)</label> <input type="text" id="slug" name="slug" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="自动生成或手动输入" data-astro-cid-evsmad5u> <p class="mt-1 text-xs text-gray-500" data-astro-cid-evsmad5u>用于URL，如果为空将自动生成</p> </div> <!-- 分类 --> <div data-astro-cid-evsmad5u> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-evsmad5u>分类 *</label> <select id="category" name="category" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" data-astro-cid-evsmad5u> <option value="" data-astro-cid-evsmad5u>请选择分类</option> </select> </div> <!-- 摘要 --> <div class="lg:col-span-2" data-astro-cid-evsmad5u> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-evsmad5u>文章摘要</label> <textarea id="description" name="description" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none" placeholder="简要描述文章内容，用于SEO和列表展示" data-astro-cid-evsmad5u></textarea> </div> <!-- 标签 --> <div data-astro-cid-evsmad5u> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-evsmad5u>标签</label> <input type="text" id="tags" name="tags" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="用逗号分隔多个标签" data-astro-cid-evsmad5u> <p class="mt-1 text-xs text-gray-500" data-astro-cid-evsmad5u>例如：JavaScript, React, 前端开发</p> </div> <!-- 封面图 --> <div data-astro-cid-evsmad5u> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-evsmad5u>封面图片</label> <input type="url" id="cover" name="cover" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="图片URL地址" data-astro-cid-evsmad5u> </div> <!-- 外部链接 --> <div class="lg:col-span-2" data-astro-cid-evsmad5u> <label class="block text-sm font-medium text-gray-700 mb-2" data-astro-cid-evsmad5u>外部链接</label> <input type="url" id="external_url" name="external_url" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" placeholder="如果是外部资源，可以添加链接" data-astro-cid-evsmad5u> <p class="mt-1 text-xs text-gray-500" data-astro-cid-evsmad5u>用户点击文章时会跳转到此链接</p> </div> </div> </div> <!-- Markdown 编辑器 --> <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" data-astro-cid-evsmad5u> <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50" data-astro-cid-evsmad5u> <h2 class="text-lg font-semibold text-gray-900" data-astro-cid-evsmad5u>文章内容</h2> <div class="flex items-center gap-3" data-astro-cid-evsmad5u> <button type="button" id="preview-toggle" class="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors" data-astro-cid-evsmad5u> <span id="preview-text" data-astro-cid-evsmad5u>显示预览</span> </button> <div class="text-sm text-gray-500" data-astro-cid-evsmad5u>
支持 <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" class="text-blue-600 hover:underline" data-astro-cid-evsmad5u>Markdown 语法</a> </div> </div> </div> <div class="flex" style="height: 600px;" data-astro-cid-evsmad5u> <!-- 编辑器 --> <div id="editor-pane" class="flex-1 flex flex-col min-w-0" data-astro-cid-evsmad5u> <div class="flex-1 relative" data-astro-cid-evsmad5u> <textarea id="content" name="content" class="w-full h-full p-6 border-0 resize-none focus:ring-0 focus:outline-none font-mono text-sm leading-relaxed" placeholder="# 开始写作...

在这里使用 Markdown 语法编写你的文章内容。

## 支持的语法

- **粗体文本**
- *斜体文本*
- [链接](https://example.com)
- \`代码\`
- 列表项

\`\`\`javascript
console.log('代码块');
\`\`\`

> 引用文本

---

## 更多内容..." data-astro-cid-evsmad5u></textarea> </div> </div> <!-- 预览区域 --> <div id="preview-pane" class="hidden flex-1 border-l border-gray-200 min-w-0" data-astro-cid-evsmad5u> <div class="flex-1 p-6 overflow-y-auto bg-gray-50" data-astro-cid-evsmad5u> <div id="preview-content" class="prose prose-sm max-w-none" data-astro-cid-evsmad5u> <p class="text-gray-500 italic" data-astro-cid-evsmad5u>预览内容将在这里显示...</p> </div> </div> </div> </div> </div> </form> </div> </div> ` })} <!-- 引入 marked.js 用于 Markdown 解析 -->   `;
}, "/home/zhuima/github/javascript/EeveNav/src/pages/admin/posts/new.astro", void 0);

const $$file = "/home/zhuima/github/javascript/EeveNav/src/pages/admin/posts/new.astro";
const $$url = "/admin/posts/new";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$New,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
