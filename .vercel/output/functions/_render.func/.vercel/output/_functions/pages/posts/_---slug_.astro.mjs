/* empty css                                    */
import { c as createComponent, a as createAstro, f as renderComponent, F as Fragment, e as renderTemplate, m as maybeRenderHead, d as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../../chunks/Layout_ByjgofFJ.mjs';
import { $ as $$PostLayout, g as getDate } from '../../chunks/PostLayout_DAIf_Iy7.mjs';
import { g as getDatabase } from '../../chunks/database_kl_IERA1.mjs';
import { marked } from 'marked';
import hljs from 'highlight.js';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const renderer = new marked.Renderer();
renderer.code = function({ text: code, lang: language }) {
  const lang = language || "text";
  if (lang === "mermaid") {
    const id = "mermaid-" + Math.random().toString(36).substring(2, 9);
    return `<div class="mermaid-container">
      <div class="mermaid" id="${id}">${code}</div>
    </div>`;
  }
  if (lang === "echarts") {
    const id = "echarts-" + Math.random().toString(36).substring(2, 9);
    return `<div class="echarts-container">
      <div class="echarts-chart" id="${id}" data-config="${encodeURIComponent(code)}" style="width: 100%; height: 400px;"></div>
    </div>`;
  }
  let highlightedCode;
  if (hljs.getLanguage(lang)) {
    try {
      highlightedCode = hljs.highlight(code, { language: lang }).value;
    } catch (err) {
      console.error("Highlight.js error:", err);
      highlightedCode = hljs.highlightAuto(code).value;
    }
  } else {
    highlightedCode = hljs.highlightAuto(code).value;
  }
  const lines = highlightedCode.split("\n");
  const numberedLines = lines.map((line, index) => {
    return `<span class="code-line" data-line="${index + 1}">${line}</span>`;
  }).join("\n");
  const copyId = "copy-" + Math.random().toString(36).substring(2, 9);
  return `<div class="code-block-container">
    <div class="code-header">
      <span class="code-language">${lang}</span>
    </div>
    <div class="code-content-wrapper">
      <pre class="code-block" data-language="${lang}"><code id="${copyId}" class="hljs language-${lang}">${numberedLines}</code></pre>
      <button class="copy-button" data-copy-id="${copyId}" title="复制代码" aria-label="复制代码">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="m4 16c-1.1 0-2-.9-2-2v-10c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
      </button>
    </div>
  </div>`;
};
marked.setOptions({
  renderer,
  breaks: true,
  gfm: true
});
async function parseMarkdown(content) {
  return await marked.parse(content);
}
function initializeCharts() {
  return `
    <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs'
      import * as echarts from 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.esm.min.js'
      
      // 初始化Mermaid
      mermaid.initialize({ 
        startOnLoad: true,
        theme: 'default',
        themeVariables: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#1f2937',
          primaryBorderColor: '#e5e7eb',
          lineColor: '#6b7280',
          secondaryColor: '#f3f4f6',
          tertiaryColor: '#ffffff'
        }
      })
      
      // 初始化ECharts
      document.addEventListener('DOMContentLoaded', () => {
        // 渲染所有ECharts图表
        document.querySelectorAll('.echarts-chart').forEach(container => {
          try {
            const configStr = decodeURIComponent(container.dataset.config || '')
            const config = JSON.parse(configStr)
            const chart = echarts.init(container)
            chart.setOption(config)
            
            // 响应式调整
            window.addEventListener('resize', () => {
              chart.resize()
            })
          } catch (error) {
            console.error('ECharts渲染错误:', error)
            container.innerHTML = '<div class="error">图表配置错误</div>'
          }
        })
        
        // 代码复制功能
        document.querySelectorAll('.copy-button').forEach(button => {
          button.addEventListener('click', async () => {
            const copyId = button.dataset.copyId
            const codeElement = document.getElementById(copyId || '')
            if (codeElement) {
              try {
                // 获取纯文本内容（去掉HTML标签和行号）
                const text = codeElement.innerText || codeElement.textContent || ''
                await navigator.clipboard.writeText(text)
                
                // 显示复制成功状态
                const originalHTML = button.innerHTML
                button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>'
                button.classList.add('copied')
                
                // 2秒后恢复原状
                setTimeout(() => {
                  button.innerHTML = originalHTML
                  button.classList.remove('copied')
                }, 2000)
              } catch (err) {
                console.error('复制失败:', err)
                // 显示复制失败状态
                const originalHTML = button.innerHTML
                button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>'
                button.classList.add('copy-error')
                
                setTimeout(() => {
                  button.innerHTML = originalHTML
                  button.classList.remove('copy-error')
                }, 1500)
              }
            }
          })
        })
      })
    <\/script>
  `;
}

const $$Astro = createAstro();
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { slug } = Astro2.params;
  const db = getDatabase();
  const post = await db.getPostBySlug(slug);
  if (!post) {
    return Astro2.redirect("/404");
  }
  if (post.external_url) {
    return Astro2.redirect(post.external_url);
  }
  const relatedPosts = await db.getRelatedPosts(post.id, 4);
  const htmlContent = await parseMarkdown(post.content);
  const seoConfig = {
    title: `${post.title} - EeveNav`,
    description: post.des || `\u63A2\u7D22${post.title}\u7684\u8BE6\u7EC6\u5185\u5BB9\u3002${post.category}\u5206\u7C7B\u4E0B\u7684\u7CBE\u9009\u8D44\u6E90\uFF0C\u5305\u542B\u5B9E\u7528\u6280\u5DE7\u548C\u6DF1\u5EA6\u5206\u6790\u3002`,
    keywords: [
      ...post.tags,
      post.category,
      "\u6280\u672F\u6587\u7AE0",
      "EeveNav",
      "\u8D44\u6E90\u63A8\u8350",
      "\u5F00\u53D1\u5DE5\u5177",
      "\u8BBE\u8BA1\u8D44\u6E90"
    ],
    type: "article",
    image: post.cover || "/og-article.jpg",
    imageAlt: `${post.title}\u7684\u5C01\u9762\u56FE`,
    author: "EeveNav Team",
    publishDate: post.date,
    modifiedDate: post.updated_at || post.date,
    category: post.category,
    tags: post.tags,
    canonicalUrl: `${Astro2.url.origin}/posts/${post.slug}`
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { ...seoConfig }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="py-6"> <!-- 文章内容区域 - 使用PostLayout保持左右结构 --> ${renderComponent($$result2, "PostLayout", $$PostLayout, {}, { "default": async ($$result3) => renderTemplate` <article class="max-w-4xl" itemscope itemtype="https://schema.org/Article"> <!-- 面包屑导航 --> <nav class="mb-6" aria-label="面包屑导航"> <ol class="flex items-center space-x-2 text-sm text-gray-500"> <li> <a href="/" class="hover:text-gray-700 transition-colors">首页</a> </li> <li> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </li> <li> <a href="/blog" class="hover:text-gray-700 transition-colors">博客</a> </li> <li> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path> </svg> </li> <li aria-current="page" class="text-gray-900 font-medium truncate"> ${post.title} </li> </ol> </nav> <!-- 文章头部 --> <header class="mb-8"> ${post.cover && renderTemplate`<div class="mb-6"> <img${addAttribute(1020, "width")}${addAttribute(510, "height")}${addAttribute(post.cover, "src")}${addAttribute(`${post.title}\u7684\u5C01\u9762\u56FE`, "alt")} class="w-full h-auto rounded-lg shadow-lg" loading="eager" itemprop="image"> </div>`} <!-- 分类标签 --> <div class="mb-4"> <a${addAttribute(`/categories/${post.category}`, "href")} class="inline-block px-3 py-1 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all" itemprop="genre"> ${post.category} </a> </div> <!-- 文章标题 --> <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight" itemprop="headline"> ${post.title} </h1> <!-- 文章元信息 --> <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200"> <!-- 作者 --> <div class="flex items-center gap-2" itemprop="author" itemscope itemtype="https://schema.org/Person"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> <span itemprop="name">EeveNav Team</span> </div> <!-- 发布日期 --> <div class="flex items-center gap-2"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> <time${addAttribute(post.date.toISOString(), "datetime")} itemprop="datePublished"> ${getDate(post.date)} </time> </div> <!-- 标签 --> ${post.tags && post.tags.length > 0 && renderTemplate`<div class="flex items-center gap-2"> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path> </svg> <ul class="flex gap-2 flex-wrap"> ${post.tags.map((tag) => renderTemplate`<li> <a${addAttribute(`/tags/${tag}`, "href")} class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors" itemprop="keywords"> ${tag} </a> </li>`)} </ul> </div>`} </div> </header> <!-- 文章摘要 --> ${post.des && renderTemplate`<div class="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg"> <p class="text-gray-700 leading-relaxed" itemprop="description"> ${post.des} </p> </div>`} <!-- 文章内容 --> <div class="content prose prose-lg max-w-none" itemprop="articleBody"> <div>${unescapeHTML(htmlContent)}</div> </div> <!-- 文章底部操作 --> <footer class="mt-12 pt-8 border-t border-gray-200"> ${post.external_url && renderTemplate`<div class="mb-6"> <a${addAttribute(post.external_url, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-6 py-3 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"${addAttribute(`\u8BBF\u95EE${post.title}\u7684\u5B98\u65B9\u7F51\u7AD9`, "aria-label")}>
访问官方网站
<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg> </a> </div>`} <!-- 分享按钮 --> <div class="flex flex-wrap gap-3 mb-8"> <button class="share-btn inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" data-share="twitter" aria-label="分享到Twitter"> <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path> </svg>
Twitter
</button> <button class="share-btn inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" data-share="weibo" aria-label="分享到微博"> <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path d="M9.296 15.2c-2.144 0-3.885-1.34-3.885-2.992 0-1.651 1.741-2.992 3.885-2.992s3.885 1.34 3.885 2.992c0 1.651-1.741 2.992-3.885 2.992z"></path> </svg>
微博
</button> <button class="share-btn inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" data-share="copy" aria-label="复制链接"> <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path> </svg>
复制链接
</button> </div> </footer> </article> ` })} <!-- 相关文章推荐 - 在PostLayout外面，真正的底部 --> ${relatedPosts && relatedPosts.length > 0 && renderTemplate`<section class="mt-16"> <div class="mb-8"> <h2 class="text-2xl font-bold text-gray-900 mb-2">相关文章推荐</h2> <p class="text-gray-600">基于当前文章的分类和标签为您推荐相关内容</p> </div> <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> ${relatedPosts.map((related) => renderTemplate`<article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"> ${related.cover && renderTemplate`<div class="relative overflow-hidden"> <img${addAttribute(related.cover, "src")}${addAttribute(`${related.title}\u7684\u9884\u89C8\u56FE`, "alt")} class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"> <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> </div>`} <div class="p-6"> <div class="mb-3"> <span class="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded"> ${related.category} </span> </div> <h3 class="font-bold text-gray-900 mb-3 line-clamp-2 leading-tight"> <a${addAttribute(`/posts/${related.slug}`, "href")} class="hover:text-blue-600 transition-colors"> ${related.title} </a> </h3> <p class="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed"> ${related.des} </p> <div class="flex items-center justify-between"> <div class="text-xs text-gray-500"> ${getDate(related.date)} </div> <a${addAttribute(`/posts/${related.slug}`, "href")} class="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
阅读更多 →
</a> </div> </div> </article>`)} </div> </section>`} </div> </div> ` })} <!-- 分享功能脚本 -->  <!-- 图表和代码增强脚本 --> ${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(initializeCharts())}` })} `;
}, "/home/zhuima/github/javascript/EeveNav/src/pages/posts/[...slug].astro", void 0);

const $$file = "/home/zhuima/github/javascript/EeveNav/src/pages/posts/[...slug].astro";
const $$url = "/posts/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
