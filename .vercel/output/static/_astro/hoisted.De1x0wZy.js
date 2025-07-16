import"./AdminLayout.astro_astro_type_script_index_1_lang.CpY0iB58.js";import"https://cdn.tailwindcss.com";document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll('button[class*="inline-flex h-6 w-11"]').forEach(t=>{t.addEventListener("click",()=>{const s=t.classList.contains("bg-blue-600"),e=t.querySelector("span");s?(t.classList.remove("bg-blue-600"),t.classList.add("bg-gray-200"),e?.classList.remove("translate-x-6"),e?.classList.add("translate-x-1")):(t.classList.remove("bg-gray-200"),t.classList.add("bg-blue-600"),e?.classList.remove("translate-x-1"),e?.classList.add("translate-x-6"))})}),document.querySelector('button[class*="bg-gradient-to-r from-blue-600"]')?.addEventListener("click",()=>{alert(`设置保存成功！

注意：这是演示功能，实际项目中需要连接后端API保存配置。`)}),document.querySelector('button[class*="from-green-600"]')?.addEventListener("click",()=>{alert(`数据备份功能

这个功能将导出数据库文件，请在实际项目中实现具体的备份逻辑。`)}),document.querySelector('button[class*="bg-orange-600"]')?.addEventListener("click",()=>{confirm(`确定要恢复数据吗？

这将覆盖当前所有数据，请确保您已经备份了当前数据。`)&&alert(`数据恢复功能

请在实际项目中实现具体的恢复逻辑。`)})});
