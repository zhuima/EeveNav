const r=document.getElementById("sidebar-search-input"),a=document.getElementById("sidebar-search-results"),i=document.getElementById("sidebar-search-loading"),d=document.getElementById("sidebar-search-empty"),s=document.getElementById("sidebar-search-items");let o;function m(e){clearTimeout(o),o=setTimeout(()=>{h(e)},300)}async function h(e){if(!e.trim()){c();return}a&&a.classList.remove("hidden"),i&&i.classList.remove("hidden"),d&&d.classList.add("hidden"),s&&(s.innerHTML="");try{const t=await(await fetch(`/api/blog?search=${encodeURIComponent(e)}`)).json();i&&i.classList.add("hidden"),t.success&&t.posts&&t.posts.length>0?u(t.posts):s&&(s.innerHTML=`
            <div class="p-4 text-center text-gray-500">
              <p class="text-sm">没有找到相关文章</p>
            </div>
          `)}catch(n){console.error("Sidebar search error:",n),i&&i.classList.add("hidden"),s&&(s.innerHTML=`
          <div class="p-4 text-center text-red-500">
            <p class="text-sm">搜索出错，请稍后重试</p>
          </div>
        `)}}function u(e){if(!s)return;const n=e.slice(0,6).map(t=>`
      <div class="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0" onclick="window.location.href='/posts/${t.slug}'">
        <div class="flex items-start space-x-3">
          <img src="${t.cover}" alt="${t.title}" class="w-10 h-10 object-cover rounded flex-shrink-0">
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 truncate">${t.title}</h4>
            <p class="text-xs text-gray-600 mt-1 line-clamp-2">${t.des}</p>
            <div class="flex items-center mt-1">
              <span class="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">${t.category}</span>
            </div>
          </div>
        </div>
      </div>
    `).join("");s.innerHTML=n}function c(){a&&a.classList.add("hidden"),i&&i.classList.add("hidden"),d&&d.classList.remove("hidden"),s&&(s.innerHTML="")}r&&(r.addEventListener("input",e=>{m(e.target.value)}),r.addEventListener("focus",()=>{r.value.trim()&&a&&a.classList.remove("hidden")}),r.addEventListener("keydown",e=>{e.key==="Escape"&&(c(),r.blur())}));document.addEventListener("click",e=>{a&&!a.contains(e.target)&&e.target!==r&&c()});const l=document.createElement("style");l.textContent=`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `;document.head.appendChild(l);
