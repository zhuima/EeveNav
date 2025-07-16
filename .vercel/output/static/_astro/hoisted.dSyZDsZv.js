import"./Header.astro_astro_type_script_index_0_lang.DgzvyZl5.js";import"https://cdn.tailwindcss.com";const r=document.getElementById("search-input"),g=document.querySelectorAll(".resource-card"),n=document.querySelectorAll(".filter-btn"),d=document.getElementById("no-results");let i="all";function l(e){const t=e.toLowerCase().trim();let s=0;g.forEach(a=>{const o=a.dataset.title||"",c=a.dataset.description||"",b=a.dataset.tags||"",h=a.dataset.category||"";(!t||o.includes(t)||c.includes(t)||b.toLowerCase().includes(t))&&(i==="all"||h===i)?(a.style.display="block",s++):a.style.display="none"}),s===0?d.classList.remove("hidden"):d.classList.add("hidden")}function m(e){i=e,n.forEach(s=>{s.classList.remove("active","bg-gray-900","text-white","shadow-lg"),s.classList.add("bg-white","text-gray-700","border","border-gray-200","shadow-md")});const t=document.querySelector(`[data-category="${e}"]`);t&&(t.classList.add("active","bg-gray-900","text-white","shadow-lg"),t.classList.remove("bg-white","text-gray-700","border","border-gray-200","shadow-md")),r.value.trim()&&(r.value=""),l("")}function y(){document.querySelectorAll(".hot-tag").forEach(t=>{t.addEventListener("click",s=>{s.preventDefault();const a=t.dataset.search||t.textContent||"";i="all",n.forEach(c=>{c.classList.remove("active","bg-gray-900","text-white","shadow-lg"),c.classList.add("bg-white","text-gray-700","border","border-gray-200","shadow-md")});const o=document.querySelector('[data-category="all"]');o&&(o.classList.add("active","bg-gray-900","text-white","shadow-lg"),o.classList.remove("bg-white","text-gray-700","border","border-gray-200","shadow-md")),r.value=a,r.focus(),l(a)})})}function f(){document.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key==="k"&&(e.preventDefault(),r.focus(),r.select())})}function p(){const e=r.closest(".relative.bg-white\\/80");r.addEventListener("focus",()=>{e?.classList.add("ring-4","ring-blue-500/20")}),r.addEventListener("blur",()=>{e?.classList.remove("ring-4","ring-blue-500/20")})}r.addEventListener("input",e=>{const t=e.target;l(t.value)});n.forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.category||"all";m(t)})});y();f();p();const u=document.createElement("style");u.textContent=`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .filter-btn {
      backdrop-filter: blur(8px);
    }
    
    .filter-btn:hover {
      transform: translateY(-2px);
    }
    
    .resource-card {
      backdrop-filter: blur(8px);
    }
    
    .resource-card:hover {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    }
    
    @media (prefers-reduced-motion: reduce) {
      .resource-card,
      .filter-btn {
        transform: none !important;
        transition: none !important;
      }
    }
    
    /* 自定义滚动条 */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f5f9;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;document.head.appendChild(u);
