import"./AdminLayout.astro_astro_type_script_index_1_lang.CpY0iB58.js";import"https://cdn.tailwindcss.com";async function d(){try{const[t,n]=await Promise.all([fetch("/api/blog?action=categories"),fetch("/api/blog?action=posts")]);if(!t.ok||!n.ok)throw new Error("API请求失败");const e=await t.json(),s=await n.json(),a=Array.isArray(e)?e:[],c=Array.isArray(s)?s:[];document.getElementById("total-categories").textContent=a.length.toString(),document.getElementById("total-posts").textContent=c.length.toString(),document.getElementById("avg-posts").textContent=a.length>0?Math.round(c.length/a.length).toString():"0",l(a)}catch(t){console.error("加载分类失败:",t);const n=document.getElementById("categories-table");n.innerHTML='<tr><td colspan="4" class="text-center py-4 text-gray-500">加载失败，请刷新页面重试</td></tr>'}}function l(t){const n=document.getElementById("categories-table");if(!Array.isArray(t)||t.length===0){n.innerHTML='<tr><td colspan="4" class="text-center py-4 text-gray-500">暂无分类</td></tr>';return}n.innerHTML=t.map(e=>`
    <tr>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <span class="text-white text-sm font-bold">${(e.name||"").charAt(0).toUpperCase()}</span>
          </div>
          <div class="text-sm font-medium text-gray-900">${e.name||"未知分类"}</div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${e.count>0?"bg-green-100 text-green-800":"bg-gray-100 text-gray-800"}">
          ${e.count||0} 篇文章
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        刚刚创建
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onclick="window.deleteCategory('${e.name}')"
          class="text-red-600 hover:text-red-900 ${e.count>0?"opacity-50 cursor-not-allowed":""}"
          ${e.count>0?'disabled title="有文章使用此分类，无法删除"':""}
        >
          删除
        </button>
      </td>
    </tr>
  `).join("")}document.addEventListener("DOMContentLoaded",()=>{d();const t=document.getElementById("category-modal"),n=document.getElementById("category-form"),e=document.getElementById("add-category-btn"),s=document.getElementById("cancel-category-btn");function a(){t.classList.add("hidden"),t.classList.remove("flex")}function c(){t.classList.remove("hidden"),t.classList.add("flex")}e.addEventListener("click",()=>{n.reset(),c()}),s.addEventListener("click",o=>{o.preventDefault(),a()}),t.addEventListener("click",o=>{o.target===t&&a()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&!t.classList.contains("hidden")&&a()}),n.addEventListener("submit",async o=>{o.preventDefault(),new FormData(n).get("categoryName"),alert(`分类将在添加文章时自动创建！

您可以在添加文章时输入新的分类名称。`),a()}),window.deleteCategory=async o=>{if(confirm(`确定要删除分类 "${o}" 吗？`))try{const r=await fetch("/api/blog",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"delete-category",data:{categoryName:o}})});if(r.ok)d(),alert("分类删除成功！");else{const i=await r.json();alert(`删除失败: ${i.error}`)}}catch(r){console.error("删除失败:",r),alert("删除失败，请重试")}}});
