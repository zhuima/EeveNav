/* empty css                                 */
import { c as createComponent, a as createAstro, r as renderHead, e as renderTemplate } from '../chunks/astro/server_zWkKcK-x.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const cookies = Astro2.cookies;
  const isAuthenticated = cookies.get("admin_auth")?.value === "authenticated";
  if (isAuthenticated) {
    return Astro2.redirect("/admin");
  }
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "admin123";
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      cookies.set("admin_auth", "authenticated", {
        path: "/",
        maxAge: 60 * 60 * 24,
        // 24小时
        httpOnly: true,
        secure: true,
        // 生产环境使用HTTPS
        sameSite: "strict"
      });
      return Astro2.redirect("/admin");
    } else {
      var loginError = true;
    }
  }
  return renderTemplate`<html lang="zh-CN"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>管理员登录 - EeveNav</title>${renderHead()}</head> <body class="min-h-screen bg-gray-100 overflow-hidden"> <div class="flex min-h-screen"> <!-- 左侧图片区域 --> <div class="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden"> <!-- 背景渐变 --> <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800"></div> <!-- 装饰图形 --> <div class="absolute inset-0"> <!-- 网格背景 --> <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px]"></div> <!-- 浮动圆圈 --> <div class="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div> <div class="absolute bottom-32 right-16 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl animate-pulse" style="animation-delay: 1s;"></div> <div class="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-400/15 rounded-full blur-lg animate-pulse" style="animation-delay: 2s;"></div> </div> <!-- 内容 --> <div class="relative z-10 flex flex-col justify-center items-center p-12 text-white"> <!-- Logo区域 --> <div class="mb-12 text-center"> <div class="w-20 h-20 mx-auto mb-6 relative"> <div class="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div> <div class="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl flex items-center justify-center w-full h-full"> <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg> </div> </div> <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
EeveNav
</h1> <p class="text-xl text-white/80 font-light">精选资源导航平台</p> </div> <!-- 特性介绍 --> <div class="space-y-6 max-w-md"> <div class="flex items-center space-x-4"> <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path> </svg> </div> <div> <h3 class="text-lg font-semibold text-white">智能搜索</h3> <p class="text-white/70 text-sm">快速找到你需要的优质资源</p> </div> </div> <div class="flex items-center space-x-4"> <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path> </svg> </div> <div> <h3 class="text-lg font-semibold text-white">分类管理</h3> <p class="text-white/70 text-sm">精心组织的资源分类体系</p> </div> </div> <div class="flex items-center space-x-4"> <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"> <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path> </svg> </div> <div> <h3 class="text-lg font-semibold text-white">高效管理</h3> <p class="text-white/70 text-sm">强大的后台管理系统</p> </div> </div> </div> </div> </div> <!-- 右侧登录区域 --> <div class="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8 lg:p-12 bg-white"> <div class="w-full max-w-md"> <!-- 移动端Logo --> <div class="lg:hidden text-center mb-8"> <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path> </svg> </div> <h1 class="text-3xl font-bold text-gray-900 mb-2">EeveNav</h1> <p class="text-gray-600">管理控制台</p> </div> <!-- 登录表单 --> <div class="space-y-8"> <!-- 标题 --> <div class="text-center lg:text-left"> <h2 class="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h2> <p class="text-gray-600">请登录您的管理员账户</p> </div> <!-- 错误提示 --> ${loginError && renderTemplate`<div class="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg"> <div class="flex items-center"> <div class="flex-shrink-0"> <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div class="ml-3"> <p class="text-sm text-red-700 font-medium">登录失败，请检查用户名和密码</p> </div> </div> </div>`} <!-- 表单 --> <form method="POST" class="space-y-6"> <div> <label for="username" class="block text-sm font-semibold text-gray-900 mb-2">
用户名
</label> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path> </svg> </div> <input type="text" id="username" name="username" required class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500" placeholder="请输入管理员用户名"> </div> </div> <div> <label for="password" class="block text-sm font-semibold text-gray-900 mb-2">
密码
</label> <div class="relative"> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path> </svg> </div> <input type="password" id="password" name="password" required class="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500" placeholder="请输入管理员密码"> <button type="button" id="toggle-password" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"> <svg id="eye-open" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path> </svg> <svg id="eye-closed" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path> </svg> </button> </div> </div> <button type="submit" class="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"> <span>登录管理后台</span> <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path> </svg> </button> </form> <!-- 安全提示 --> <div class="bg-gray-50 rounded-xl p-4"> <div class="flex items-start"> <div class="flex-shrink-0"> <svg class="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg> </div> <div class="ml-3"> <p class="text-sm font-medium text-gray-900">安全提示</p> <ul class="mt-1 text-xs text-gray-600 space-y-1"> <li>• 确保在安全的网络环境中登录</li> <li>• 会话将在24小时后自动过期</li> <li>• 请勿在公共设备上保存登录信息</li> </ul> </div> </div> </div> <!-- 返回首页 --> <div class="text-center"> <a href="/" class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors group"> <svg class="w-4 h-4 mr-1 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path> </svg>
返回首页
</a> </div> <!-- 开发环境提示 --> ${false} </div> </div> </div> </div>  </body> </html>`;
}, "/home/zhuima/github/javascript/EeveNav/src/pages/login.astro", void 0);
const $$file = "/home/zhuima/github/javascript/EeveNav/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
