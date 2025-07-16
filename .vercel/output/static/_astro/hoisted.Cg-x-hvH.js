import"./AdminLayout.astro_astro_type_script_index_1_lang.CpY0iB58.js";import"https://cdn.tailwindcss.com";async function p(){try{const[e,s]=await Promise.all([fetch("/api/blog?action=tags"),fetch("/api/blog?action=posts")]);if(!e.ok||!s.ok)throw new Error("API请求失败");const a=await e.json(),t=await s.json(),r=Array.isArray(a)?a:[],o=Array.isArray(t)?t:[],n=new Map,i=new Set;o.forEach(l=>{l.tags&&Array.isArray(l.tags)&&l.tags.forEach(c=>{if(c&&c.trim()){const d=c.trim();n.set(d,(n.get(d)||0)+1),i.add(l.id)}})}),document.getElementById("total-tags").textContent=n.size.toString(),document.getElementById("tagged-posts").textContent=i.size.toString(),g(Array.from(n.entries())),m(Array.from(n.entries()),o)}catch(e){console.error("加载标签失败:",e);const s=document.getElementById("tags-table");s.innerHTML='<tr><td colspan="4" class="text-center py-4 text-gray-500">加载失败，请刷新页面重试</td></tr>'}}function g(e){const s=document.getElementById("tags-cloud");if(e.length===0){s.innerHTML='<p class="text-gray-500">暂无标签</p>';return}e.sort((t,r)=>r[1]-t[1]);const a=Math.max(...e.map(([,t])=>t));s.innerHTML=e.map(([t,r])=>{const o=Math.max(.75,Math.min(1.5,r/a*1.2+.5)),n=["bg-blue-100 text-blue-800 hover:bg-blue-200","bg-green-100 text-green-800 hover:bg-green-200","bg-purple-100 text-purple-800 hover:bg-purple-200","bg-pink-100 text-pink-800 hover:bg-pink-200","bg-orange-100 text-orange-800 hover:bg-orange-200","bg-teal-100 text-teal-800 hover:bg-teal-200"],i=n[Math.floor(Math.random()*n.length)];return`
      <button 
        onclick="window.viewTagPosts('${t}')"
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${i}"
        style="font-size: ${o}rem"
        title="查看使用标签 ${t} 的文章"
      >
        ${t}
        <span class="ml-1 text-xs opacity-75">${r}</span>
      </button>
    `}).join("")}function m(e,s){const a=document.getElementById("tags-table");if(e.length===0){a.innerHTML='<tr><td colspan="4" class="text-center py-4 text-gray-500">暂无标签</td></tr>';return}e.sort((t,r)=>r[1]-t[1]),a.innerHTML=e.map(([t,r])=>{const o=s.filter(n=>n.tags&&Array.isArray(n.tags)&&n.tags.includes(t));return`
      <tr>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
              <span class="text-white text-xs font-bold">#</span>
            </div>
            <div class="text-sm font-medium text-gray-900">${t}</div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            ${r} 次使用
          </span>
        </td>
        <td class="px-6 py-4">
          <div class="text-sm text-gray-500">
            ${o.slice(0,3).map(n=>n.title).join(", ")}
            ${o.length>3?`... 等 ${o.length} 篇文章`:""}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button 
            onclick="window.viewTagPosts('${t}')"
            class="text-purple-600 hover:text-purple-900 mr-3"
          >
            查看文章
          </button>
        </td>
      </tr>
    `}).join("")}document.addEventListener("DOMContentLoaded",()=>{p(),window.viewTagPosts=e=>{alert(`功能开发中：查看标签 "${e}" 的相关文章

您可以在文章管理页面搜索该标签来查看相关文章。`)}});
