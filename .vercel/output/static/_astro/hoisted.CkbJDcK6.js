import"./AdminLayout.astro_astro_type_script_index_1_lang.CpY0iB58.js";import"https://cdn.tailwindcss.com";async function y(){try{console.log("开始加载统计信息...");const[n,t,s]=await Promise.all([fetch("/api/blog?action=posts"),fetch("/api/blog?action=categories"),fetch("/api/blog?action=tags")]);if(console.log("API响应状态:",{posts:n.status,categories:t.status,tags:s.status}),!n.ok)throw new Error(`Posts API failed: ${n.status}`);if(!t.ok)throw new Error(`Categories API failed: ${t.status}`);if(!s.ok)throw new Error(`Tags API failed: ${s.status}`);const d=await n.json(),g=await t.json(),c=await s.json();console.log("原始数据:",{posts:d,categories:g,tags:c});const u=Array.isArray(d)?d:[],e=Array.isArray(g)?g:[],a=Array.isArray(c)?c:[];console.log("处理后的数组:",{postsCount:u.length,categoriesCount:e.length,tagsCount:a.length});const l=document.getElementById("posts-count"),o=document.getElementById("categories-count"),r=document.getElementById("tags-count");l&&(l.textContent=u.length.toString(),console.log("更新文章数量:",u.length)),o&&(o.textContent=e.length.toString(),console.log("更新分类数量:",e.length)),r&&(r.textContent=a.length.toString(),console.log("更新标签数量:",a.length)),v(u),E(e)}catch(n){console.error("加载统计信息失败:",n);const t=document.getElementById("posts-count"),s=document.getElementById("categories-count"),d=document.getElementById("tags-count");t&&(t.textContent="ERR"),s&&(s.textContent="ERR"),d&&(d.textContent="ERR");const g=document.getElementById("posts-table");g&&(g.innerHTML='<tr><td colspan="5" class="text-center py-4 text-red-500">加载失败，请刷新页面重试<br>错误: '+n.message+"</td></tr>")}}function v(n){const t=document.getElementById("posts-table");if(!Array.isArray(n)||n.length===0){t.innerHTML='<tr><td colspan="5" class="text-center py-4 text-gray-500">暂无文章</td></tr>';return}t.innerHTML=n.map(s=>`
    <tr>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${s.title||"无标题"}</div>
        <div class="text-sm text-gray-500">${s.slug||"无slug"}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          ${s.category||"未分类"}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${Array.isArray(s.tags)?s.tags.join(", "):"无标签"}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ${s.date?new Date(s.date).toLocaleDateString():"未知日期"}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          onclick="window.editPost(${s.id})"
          class="text-indigo-600 hover:text-indigo-900 mr-3"
        >
          编辑
        </button>
        <button 
          onclick="window.copyPost(${s.id})"
          class="text-green-600 hover:text-green-900 mr-3"
        >
          复制
        </button>
        <button 
          onclick="window.deletePost(${s.id})"
          class="text-red-600 hover:text-red-900"
        >
          删除
        </button>
      </td>
    </tr>
  `).join("")}function E(n){const t=document.getElementById("categories-overview");if(t){if(!Array.isArray(n)||n.length===0){t.innerHTML='<p class="text-sm text-gray-500">暂无分类</p>';return}t.innerHTML=n.slice(0,5).map(s=>`
    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span class="text-sm font-medium text-gray-900">${s.name}</span>
      </div>
      <span class="text-xs text-gray-500">${s.count} 篇</span>
    </div>
  `).join("")}}document.addEventListener("DOMContentLoaded",()=>{y();const n=document.getElementById("post-modal"),t=document.getElementById("post-form"),s=document.getElementById("add-post-btn"),d=document.getElementById("cancel-btn"),g=document.getElementById("close-modal-btn");function c(){n.classList.add("hidden"),n.classList.remove("flex"),console.log("Modal closed")}function u(){n.classList.remove("hidden"),n.classList.add("flex"),console.log("Modal opened")}s.addEventListener("click",()=>{console.log("Add button clicked"),document.getElementById("modal-title").textContent="添加文章",t.reset(),t.dataset.mode="add",t.dataset.id="",u()}),d.addEventListener("click",e=>{e.preventDefault(),console.log("Cancel button clicked"),c()}),g.addEventListener("click",e=>{e.preventDefault(),console.log("Close X button clicked"),c()}),n.addEventListener("click",e=>{e.target===n&&(console.log("Background clicked"),c())}),document.querySelector("#post-modal > div")?.addEventListener("click",e=>{e.stopPropagation()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&!n.classList.contains("hidden")&&(console.log("ESC key pressed"),c())}),t.addEventListener("submit",async e=>{e.preventDefault(),e.stopPropagation();const a=new FormData(t),l=a.get("tags"),o=a.get("date"),r=a.get("external_url"),f={title:a.get("title"),slug:a.get("slug"),category:a.get("category"),date:new Date(o),cover:a.get("cover"),des:a.get("des"),tags:l?l.split(",").map(i=>i.trim()).filter(i=>i):[],content:a.get("content"),external_url:r||void 0};try{const i=t.dataset.mode==="edit",w="/api/blog",h="POST",x={action:i?"update":"add",data:i?{...f,id:Number.parseInt(t.dataset.id||"0")}:f};console.log("提交数据:",x);const p=await fetch(w,{method:h,headers:{"Content-Type":"application/json"},body:JSON.stringify(x)});if(p.ok){const m=await p.json();console.log("提交成功:",m),c(),y(),alert(i?"文章更新成功！":"文章添加成功！")}else{const m=await p.json();console.error("API错误:",m),alert(`操作失败: ${m.error}${m.details?`
`+m.details:""}`)}}catch(i){console.error("提交失败:",i),alert("操作失败，请重试")}}),window.editPost=async e=>{try{const o=(await(await fetch("/api/blog?action=posts")).json()).find(r=>r.id===e);if(!o){alert("文章不存在");return}document.getElementById("modal-title").textContent="编辑文章",t.dataset.mode="edit",t.dataset.id=e.toString(),t.querySelector('[name="title"]').value=o.title,t.querySelector('[name="slug"]').value=o.slug,t.querySelector('[name="category"]').value=o.category,t.querySelector('[name="date"]').value=new Date(o.date).toISOString().slice(0,16),t.querySelector('[name="cover"]').value=o.cover,t.querySelector('[name="des"]').value=o.des,t.querySelector('[name="tags"]').value=o.tags.join(", "),t.querySelector('[name="content"]').value=o.content,t.querySelector('[name="external_url"]').value=o.external_url||"",u()}catch(a){console.error("加载文章失败:",a),alert("加载文章失败")}},window.deletePost=async e=>{const l=document.querySelector(`button[onclick="window.deletePost(${e})"]`)?.closest("tr")?.querySelector(".text-gray-900")?.textContent||"未知文章";if(confirm(`确定要删除文章 "${l}" 吗？`))try{const o=await fetch("/api/blog",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"delete",data:{id:e}})});if(o.ok)y(),alert("文章删除成功！");else{const r=await o.json();alert(`删除失败: ${r.error}`)}}catch(o){console.error("删除失败:",o),alert("删除失败，请重试")}},window.copyPost=async e=>{const l=document.querySelector(`button[onclick="window.copyPost(${e})"]`)?.closest("tr")?.querySelector(".text-gray-900")?.textContent||"未知文章";if(confirm(`确定要复制文章 "${l}" 吗？`))try{const o=await fetch("/api/blog",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"copy-post",data:{postId:e}})});if(o.ok){const r=await o.json();y(),alert(`文章复制成功！新文章ID: ${r.id}`)}else{const r=await o.json();alert(`复制失败: ${r.error}`)}}catch(o){console.error("复制失败:",o),alert("复制失败，请重试")}}});
