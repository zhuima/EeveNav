import"./AdminLayout.astro_astro_type_script_index_1_lang.CpY0iB58.js";import"https://cdn.tailwindcss.com";async function r(){try{const o=await fetch("/api/blog?action=posts");if(!o.ok)throw new Error(`Posts API failed: ${o.status}`);const t=await o.json(),e=Array.isArray(t)?t:[];n(e)}catch(o){console.error("加载文章失败:",o);const t=document.getElementById("posts-table");t.innerHTML='<tr><td colspan="5" class="text-center py-4 text-gray-500">加载失败，请刷新页面重试</td></tr>'}}function n(o){const t=document.getElementById("posts-table");if(!Array.isArray(o)||o.length===0){t.innerHTML='<tr><td colspan="5" class="text-center py-4 text-gray-500">暂无文章</td></tr>';return}t.innerHTML=o.map(e=>`
    <tr>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${e.title||"无标题"}</div>
        <div class="text-sm text-gray-500">${e.slug||"无slug"}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          ${e.category||"未分类"}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${Array.isArray(e.tags)?e.tags.join(", "):"无标签"}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${e.date?new Date(e.date).toLocaleDateString():"未知日期"}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onclick="window.editPost(${e.id})"
          class="text-indigo-600 hover:text-indigo-900 mr-3"
        >
          编辑
        </button>
        <button 
          onclick="window.copyPost(${e.id})"
          class="text-green-600 hover:text-green-900 mr-3"
        >
          复制
        </button>
        <button 
          onclick="window.deletePost(${e.id})"
          class="text-red-600 hover:text-red-900"
        >
          删除
        </button>
      </td>
    </tr>
  `).join("")}document.addEventListener("DOMContentLoaded",()=>{r(),window.editPost=async o=>{window.location.href=`/admin/posts/edit/${o}`},window.deletePost=async o=>{if(confirm("确定要删除这篇文章吗？"))try{const t=await fetch("/api/blog",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"delete",data:{id:o}})});if(t.ok)r(),alert("文章删除成功！");else{const e=await t.json();alert(`删除失败: ${e.error}`)}}catch(t){console.error("删除失败:",t),alert("删除失败，请重试")}},window.copyPost=async o=>{if(confirm("确定要复制这篇文章吗？"))try{const t=await fetch("/api/blog",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"copy-post",data:{postId:o}})});if(t.ok){const e=await t.json();r(),alert(`文章复制成功！新文章ID: ${e.id}`)}else{const e=await t.json();alert(`复制失败: ${e.error}`)}}catch(t){console.error("复制失败:",t),alert("复制失败，请重试")}}});
