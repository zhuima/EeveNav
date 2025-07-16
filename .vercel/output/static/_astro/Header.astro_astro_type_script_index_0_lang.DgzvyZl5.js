document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll('img[loading="lazy"]').forEach(a=>{a.complete?a.classList.add("loaded"):a.addEventListener("load",()=>{a.classList.add("loaded")})})});window.tailwind.config={darkMode:"class",theme:{extend:{fontFamily:{sans:["system-ui","sans-serif"]}}}};const m=document.getElementById("mobile-menu-button"),h=document.getElementById("mobile-menu");m&&h&&m.addEventListener("click",()=>{h.classList.toggle("hidden")});const b=document.getElementById("theme-toggle"),v=document.getElementById("mobile-theme-toggle");function w(){const e=localStorage.getItem("theme"),a=window.matchMedia("(prefers-color-scheme: dark)").matches;e==="dark"||!e&&a?(document.documentElement.classList.add("dark"),c(!0)):(document.documentElement.classList.remove("dark"),c(!1))}function c(e){[b,v].filter(Boolean).forEach(t=>{if(t){const d=t.querySelector("svg");d&&(e?d.innerHTML='<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>':d.innerHTML='<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>')}})}function M(){document.documentElement.classList.contains("dark")?(document.documentElement.classList.remove("dark"),localStorage.setItem("theme","light"),c(!1)):(document.documentElement.classList.add("dark"),localStorage.setItem("theme","dark"),c(!0))}[b,v].forEach(e=>{e&&e.addEventListener("click",M)});window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",e=>{localStorage.getItem("theme")||(e.matches?(document.documentElement.classList.add("dark"),c(!0)):(document.documentElement.classList.remove("dark"),c(!1)))});w();const u=document.getElementById("header-search-btn"),s=document.getElementById("search-modal"),g=document.getElementById("search-overlay"),f=document.getElementById("close-search-modal"),n=document.getElementById("global-search-input"),o=document.getElementById("search-loading"),i=document.getElementById("search-empty"),r=document.getElementById("search-items");function p(){s&&(s.classList.remove("hidden"),setTimeout(()=>{n&&n.focus()},100))}function l(){s&&(s.classList.add("hidden"),n&&(n.value=""),y())}function y(){o&&o.classList.add("hidden"),i&&i.classList.remove("hidden"),r&&(r.innerHTML="")}async function I(e){if(!e.trim()){y();return}o&&o.classList.remove("hidden"),i&&i.classList.add("hidden"),r&&(r.innerHTML="");try{const t=await(await fetch(`/api/blog?search=${encodeURIComponent(e)}`)).json();o&&o.classList.add("hidden"),t.success&&t.posts&&t.posts.length>0?T(t.posts):r&&(r.innerHTML=`
            <div class="py-8 text-center text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <p>没有找到相关资源</p>
              <p class="text-sm mt-1">尝试使用其他关键词</p>
            </div>
          `)}catch(a){console.error("Search error:",a),o&&o.classList.add("hidden"),r&&(r.innerHTML=`
          <div class="py-8 text-center text-red-500">
            <p>搜索出错，请稍后重试</p>
          </div>
        `)}}function T(e){if(!r)return;const a=e.slice(0,8).map(t=>`
      <div class="p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer" onclick="window.location.href='/posts/${t.slug}'">
        <div class="flex items-start space-x-3">
          <img src="${t.cover}" alt="${t.title}" class="w-12 h-12 object-cover rounded-lg flex-shrink-0">
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-gray-900 truncate">${t.title}</h4>
            <p class="text-xs text-gray-600 mt-1 line-clamp-2">${t.des}</p>
            <div class="flex items-center mt-2 space-x-2">
              <span class="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">${t.category}</span>
              ${t.external_url?'<span class="text-xs text-green-600">• 可访问</span>':""}
            </div>
          </div>
        </div>
      </div>
    `).join("");r.innerHTML=a}function S(e,a){let t;return function(...L){const E=()=>{clearTimeout(t),e(...L)};clearTimeout(t),t=setTimeout(E,a)}}u&&u.addEventListener("click",p);f&&f.addEventListener("click",l);g&&g.addEventListener("click",l);if(n){const e=S(I,300);n.addEventListener("input",a=>{e(a.target.value)}),n.addEventListener("keydown",a=>{a.key==="Escape"&&l()})}document.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key==="k"&&(e.preventDefault(),p())});const x=document.createElement("style");x.textContent=`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `;document.head.appendChild(x);const k=document.createElement("style");k.textContent=`
    :root {
      --header-bg: rgba(255, 255, 255, 0.8);
      --header-border: rgba(156, 163, 175, 0.8);
      --text-primary: #374151;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      --hover-bg: #f3f4f6;
      --active-bg: #eff6ff;
      --active-text: #2563eb;
      --mobile-bg: rgba(255, 255, 255, 0.9);
    }

    .dark {
      --header-bg: rgba(15, 23, 42, 0.8);
      --header-border: rgba(51, 65, 85, 0.8);
      --text-primary: #f8fafc;
      --text-secondary: #cbd5e1;
      --text-muted: #94a3b8;
      --hover-bg: #334155;
      --active-bg: rgba(30, 58, 138, 0.3);
      --active-text: #60a5fa;
      --mobile-bg: rgba(15, 23, 42, 0.9);
    }

    /* 应用主题变量到现有类 */
    header .absolute {
      background-color: var(--header-bg) !important;
      border-color: var(--header-border) !important;
    }

    header .text-gray-900,
    header .text-gray-700 {
      color: var(--text-primary) !important;
    }

    header .text-gray-500,
    header .text-gray-600 {
      color: var(--text-secondary) !important;
    }

    header .text-gray-400 {
      color: var(--text-muted) !important;
    }

    header .hover\\:bg-gray-50:hover,
    header .hover\\:bg-gray-100:hover {
      background-color: var(--hover-bg) !important;
    }

    header .hover\\:text-gray-900:hover {
      color: var(--text-primary) !important;
    }

    header .bg-blue-50 {
      background-color: var(--active-bg) !important;
    }

    header .text-blue-600 {
      color: var(--active-text) !important;
    }

    header .bg-white\\/90 {
      background-color: var(--mobile-bg) !important;
    }

    header .bg-gray-100 {
      background-color: var(--hover-bg) !important;
    }

    /* 搜索模态框暗色模式 */
    .dark #search-modal .bg-white {
      background-color: #1e293b !important;
      color: #f8fafc !important;
    }

    .dark #search-modal .text-gray-900 {
      color: #f8fafc !important;
    }

    .dark #search-modal .text-gray-500 {
      color: #94a3b8 !important;
    }

    .dark #search-modal .border-gray-300 {
      border-color: #475569 !important;
    }

    .dark #search-modal .hover\\:bg-gray-50:hover {
      background-color: #334155 !important;
    }
  `;document.head.appendChild(k);
