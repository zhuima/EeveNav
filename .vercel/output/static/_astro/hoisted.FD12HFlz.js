import"https://cdn.tailwindcss.com";const d=document.getElementById("toggle-password"),t=document.getElementById("password"),s=document.getElementById("eye-open"),n=document.getElementById("eye-closed");d&&t&&s&&n&&d.addEventListener("click",()=>{t.type==="password"?(t.type="text",s.classList.add("hidden"),n.classList.remove("hidden")):(t.type="password",s.classList.remove("hidden"),n.classList.add("hidden"))});const e=document.querySelector("form");e&&e.addEventListener("submit",r=>{const c=document.getElementById("username").value.trim(),i=document.getElementById("password").value.trim();if(!c||!i){r.preventDefault(),alert("请输入用户名和密码");return}});const o=e?.querySelector('button[type="submit"]');o&&e&&e.addEventListener("submit",()=>{o.disabled=!0,o.innerHTML=`
          <div class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            登录中...
          </div>
        `});
