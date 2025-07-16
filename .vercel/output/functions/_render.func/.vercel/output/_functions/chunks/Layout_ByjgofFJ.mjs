import { c as createComponent, a as createAstro, m as maybeRenderHead, e as renderTemplate, d as addAttribute, u as unescapeHTML, f as renderComponent, F as Fragment, r as renderHead, b as renderSlot } from './astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

const $$Astro$3 = createAstro();
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Footer;
  const today = /* @__PURE__ */ new Date();
  return renderTemplate`${maybeRenderHead()}<footer class="mt-10 md:mt-36 max-w-screen-md container mx-auto flex justify-center items-center"> <p class="text-sm font-medium mb-10 pt-8 flex items-center gap-2"> <a href="https://astro.build" class="astro-sz7xmlte"><img src="https://astro.badg.es/v2/built-with-astro/tiny.svg" alt="Built with Astro" width="120" height="20" class="astro-sz7xmlte"></a> <span>
&copy; ${today.getFullYear()} ibucoin. All rights reserved.
</span> </p> </footer>`;
}, "/home/zhuima/github/javascript/EeveNav/src/components/Footer.astro", void 0);

const $$Astro$2 = createAstro();
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Header;
  const { pathname } = Astro2.url;
  const navs = [
    {
      name: "\u9996\u9875",
      href: "/",
      active: pathname === "/"
    },
    {
      name: "\u535A\u5BA2",
      href: "/blog",
      active: pathname === "/blog" || pathname.startsWith("/blog/")
    },
    {
      name: "\u5173\u4E8E",
      href: "/about",
      active: pathname === "/about"
    },
    {
      name: "\u7BA1\u7406",
      href: "/admin",
      active: pathname === "/admin"
    }
  ];
  return renderTemplate`<!-- Apple-style Header with greater height and visual appeal -->${maybeRenderHead()}<header class="sticky top-0 z-50 w-full"> <!-- Background with blur effect --> <div class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-100/80 dark:border-slate-700/80"></div> <!-- Content --> <div class="relative"> <div class="max-w-7xl mx-auto px-6 lg:px-8"> <div class="flex h-20 items-center justify-between"> <!-- Left Side: Logo and Navigation --> <div class="flex items-center space-x-8"> <!-- Logo and Brand --> <a class="flex items-center space-x-3 group transition-all duration-200" href="/"> <!-- Enhanced Logo --> <div class="relative"> <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity"></div> <div class="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="h-8 w-8 text-white"> <rect width="256" height="256" fill="none"></rect> <line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line> <line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line> </svg> </div> </div> <!-- Brand Text --> <div class="flex flex-col"> <span class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">EeveNav</span> <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">精选资源导航</span> </div> </a> <!-- Navigation --> <nav class="hidden lg:flex items-center space-x-1"> ${navs.map((nav) => renderTemplate`<a${addAttribute(`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${nav.active ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-sm" : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"}`, "class")}${addAttribute(nav.href, "href")}> ${nav.name} ${nav.active && renderTemplate`<div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-1 h-1 bg-blue-600 rounded-full"></div>`} </a>`)} </nav> </div> <!-- Right Side: Search, Submit, Theme, and Actions --> <div class="flex items-center space-x-3"> <!-- Search --> <button id="header-search-btn" class="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 group"> <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path> </svg> <span class="hidden md:inline text-sm font-medium group-hover:text-gray-900 dark:group-hover:text-gray-100">搜索</span> <kbd class="hidden md:inline-flex items-center px-1.5 py-0.5 text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded border">⌘K</kbd> </button> <!-- Submit Site --> <a href="/submit" class="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-all duration-200 group"> <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path> </svg> <span class="hidden md:inline text-sm font-medium">收录</span> </a> <!-- Theme Toggle --> <button id="theme-toggle" class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200" title="切换主题"> <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path> </svg> </button> <!-- GitHub --> <a href="https://github.com" target="_blank" class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200" title="GitHub"> <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path> </svg> </a> <!-- Mobile Menu Button --> <button id="mobile-menu-button" class="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <line x1="3" y1="12" x2="21" y2="12"></line> <line x1="3" y1="6" x2="21" y2="6"></line> <line x1="3" y1="18" x2="21" y2="18"></line> </svg> </button> </div> </div> </div> <!-- Mobile Menu --> <div id="mobile-menu" class="hidden lg:hidden border-t border-gray-100/80"> <div class="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl"> <div class="max-w-7xl mx-auto px-6 py-4 space-y-1"> <!-- Navigation Links --> ${navs.map((nav) => renderTemplate`<a${addAttribute(`block py-3 px-4 rounded-xl text-base font-medium transition-all duration-200 ${nav.active ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`, "class")}${addAttribute(nav.href, "href")}>${nav.name}</a>`)} <!-- Mobile Actions --> <div class="pt-4 border-t border-gray-100 dark:border-gray-700 mt-4"> <div class="flex items-center justify-between"> <span class="text-sm font-medium text-gray-700 dark:text-gray-300">快捷操作</span> <div class="flex items-center space-x-2"> <button id="mobile-theme-toggle" class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200" title="切换主题"> <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path> </svg> </button> <a href="https://github.com" target="_blank" class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200" title="GitHub"> <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path> </svg> </a> </div> </div> </div> </div> </div> </div> </div> <!-- Global Search Modal --> <div id="search-modal" class="hidden fixed inset-0 z-50 overflow-y-auto"> <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"> <!-- Background overlay --> <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-sm" id="search-overlay"></div> <!-- Modal content --> <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"> <!-- Header --> <div class="bg-white px-6 pt-6 pb-4"> <div class="flex items-center justify-between"> <h3 class="text-lg font-semibold text-gray-900">搜索资源</h3> <button id="close-search-modal" class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"> <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> <!-- Search input --> <div class="mt-4 relative"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path> </svg> </div> <input type="text" id="global-search-input" placeholder="搜索资源、文章..." class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" autocomplete="off"> </div> </div> <!-- Search results --> <div id="search-results" class="max-h-96 overflow-y-auto px-6 pb-6"> <div id="search-loading" class="hidden py-8 text-center"> <div class="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> <p class="mt-2 text-gray-500">搜索中...</p> </div> <div id="search-empty" class="py-8 text-center text-gray-500"> <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> <p>开始输入以搜索资源</p> </div> <div id="search-items" class="space-y-3"></div> </div> </div> </div> </div> </header> `;
}, "/home/zhuima/github/javascript/EeveNav/src/components/Header.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro();
const $$SEOHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$SEOHead;
  const {
    title = "EeveNav - \u7CBE\u9009\u8D44\u6E90\u5BFC\u822A",
    description = "\u7CBE\u5FC3\u6574\u7406\u7684\u5DE5\u5177\u3001\u6587\u7AE0\u3001\u6559\u7A0B\u548C\u7075\u611F\u5408\u96C6\uFF0C\u8BA9\u6BCF\u4E00\u6B21\u641C\u7D22\u90FD\u6709\u4EF7\u503C\u3002\u53D1\u73B0\u4F18\u8D28\u7684\u5F00\u53D1\u5DE5\u5177\u3001\u8BBE\u8BA1\u8D44\u6E90\u3001\u5B66\u4E60\u6559\u7A0B\u548C\u521B\u610F\u7075\u611F\u3002",
    keywords = ["\u8D44\u6E90\u5BFC\u822A", "\u5F00\u53D1\u5DE5\u5177", "\u8BBE\u8BA1\u8D44\u6E90", "\u5B66\u4E60\u6559\u7A0B", "\u521B\u610F\u7075\u611F", "EeveNav"],
    image = "/og-image.jpg",
    imageAlt = "EeveNav - \u7CBE\u9009\u8D44\u6E90\u5BFC\u822A",
    url,
    type = "website",
    author = "EeveNav Team",
    publishDate,
    modifiedDate,
    category,
    tags = [],
    noindex = false,
    canonicalUrl
  } = Astro2.props;
  const currentUrl = url || Astro2.url.href;
  const siteName = "EeveNav";
  const siteUrl = new URL(Astro2.url.origin);
  const fullImageUrl = image.startsWith("http") ? image : new URL(image, siteUrl).href;
  const allKeywords = [...keywords, ...tags];
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type === "article" ? "Article" : "WebSite",
      "name": title,
      "description": description,
      "url": currentUrl,
      "image": fullImageUrl,
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "url": siteUrl.href,
        "logo": {
          "@type": "ImageObject",
          "url": new URL("/logo.png", siteUrl).href
        }
      }
    };
    if (type === "article") {
      return {
        ...baseData,
        "@type": "Article",
        "headline": title,
        "datePublished": publishDate?.toISOString(),
        "dateModified": modifiedDate?.toISOString() || publishDate?.toISOString(),
        "author": {
          "@type": "Person",
          "name": author
        },
        "articleSection": category,
        "keywords": allKeywords.join(", ")
      };
    } else if (type === "website") {
      return {
        ...baseData,
        "@type": "WebSite",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl.href}?search={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };
    }
    return baseData;
  };
  const structuredData = generateStructuredData();
  return renderTemplate(_a || (_a = __template(["<!-- \u57FA\u7840Meta\u6807\u7B7E --><title>", '</title><meta name="description"', ">", '<meta name="author"', "><!-- \u641C\u7D22\u5F15\u64CE\u6307\u4EE4 -->", "", '<!-- \u8BED\u8A00\u548C\u5730\u533A --><meta name="language" content="zh-CN"><meta name="geo.region" content="CN"><!-- \u89C4\u8303URL -->', "", '<!-- Open Graph / Facebook --><meta property="og:type"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:image:alt"', '><meta property="og:url"', '><meta property="og:site_name"', '><meta property="og:locale" content="zh_CN">', '<!-- Twitter Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><meta name="twitter:image:alt"', '><meta name="twitter:site" content="@EeveNav"><meta name="twitter:creator" content="@EeveNav"><!-- \u989D\u5916\u7684Meta\u6807\u7B7E --><meta name="theme-color" content="#3b82f6"><meta name="msapplication-TileColor" content="#3b82f6"><meta name="format-detection" content="telephone=no"><!-- \u79FB\u52A8\u7AEF\u4F18\u5316 --><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title"', '><!-- \u7ED3\u6784\u5316\u6570\u636E --><script type="application/ld+json">', '<\/script><!-- Favicon --><link rel="icon" type="image/x-icon" href="/favicon.ico"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.json"><!-- DNS\u9884\u89E3\u6790\u548C\u9884\u8FDE\u63A5 --><link rel="dns-prefetch" href="//fonts.googleapis.com"><link rel="dns-prefetch" href="//cdn.tailwindcss.com"><link rel="preconnect" href="https://fonts.googleapis.com" crossorigin><!-- RSS Feed --><link rel="alternate" type="application/rss+xml"', ' href="/rss.xml">'])), title, addAttribute(description, "content"), allKeywords.length > 0 && renderTemplate`<meta name="keywords"${addAttribute(allKeywords.join(", "), "content")}>`, addAttribute(author, "content"), noindex && renderTemplate`<meta name="robots" content="noindex, nofollow">`, !noindex && renderTemplate`<meta name="robots" content="index, follow">`, canonicalUrl && renderTemplate`<link rel="canonical"${addAttribute(canonicalUrl, "href")}>`, !canonicalUrl && renderTemplate`<link rel="canonical"${addAttribute(currentUrl, "href")}>`, addAttribute(type, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(fullImageUrl, "content"), addAttribute(imageAlt, "content"), addAttribute(currentUrl, "content"), addAttribute(siteName, "content"), type === "article" && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${publishDate && renderTemplate`<meta property="article:published_time"${addAttribute(publishDate.toISOString(), "content")}>`}${modifiedDate && renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedDate.toISOString(), "content")}>`}${author && renderTemplate`<meta property="article:author"${addAttribute(author, "content")}>`}${category && renderTemplate`<meta property="article:section"${addAttribute(category, "content")}>`}${tags.map((tag) => renderTemplate`<meta property="article:tag"${addAttribute(tag, "content")}>`)}` })}`, addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(fullImageUrl, "content"), addAttribute(imageAlt, "content"), addAttribute(siteName, "content"), unescapeHTML(JSON.stringify(structuredData)), addAttribute(`${siteName} RSS Feed`, "title"));
}, "/home/zhuima/github/javascript/EeveNav/src/components/SEOHead.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const seoProps = Astro2.props;
  return renderTemplate`<html lang="zh-CN" data-astro-cid-sckkx6r4> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><!-- SEO优化 -->${renderComponent($$result, "SEOHead", $$SEOHead, { ...seoProps, "data-astro-cid-sckkx6r4": true })}<!-- 样式 --><!-- 性能优化 -->${renderHead()}</head> <body class="min-h-screen bg-background dark:bg-slate-900 text-foreground dark:text-slate-100 font-sans antialiased" data-astro-cid-sckkx6r4> <div class="relative flex min-h-screen flex-col" data-astro-cid-sckkx6r4> ${renderComponent($$result, "Header", $$Header, { "data-astro-cid-sckkx6r4": true })} <main class="flex-1" data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-sckkx6r4": true })} </div> <!-- 图片懒加载脚本 -->  </body> </html>`;
}, "/home/zhuima/github/javascript/EeveNav/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
