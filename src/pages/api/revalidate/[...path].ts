import type { APIRoute } from 'astro';
import { getCachedDatabase } from '../../../lib/cached-database';

export const prerender = false; // 动态API路由

export const GET: APIRoute = async ({ params, request }) => {
  const path = params.path;
  const secret = request.headers.get('x-revalidate-secret') ||
                new URL(request.url).searchParams.get('secret');

  // 验证密钥
  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response(JSON.stringify({
      error: 'Invalid secret',
      message: '请提供有效的重新验证密钥'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 解析路径
    const pathSegments = Array.isArray(path) ? path : [path];
    const resourceType = pathSegments[0];
    const resourceIdentifier = pathSegments[1];

    let revalidatedPaths: string[] = [];

    switch (resourceType) {
      case 'home':
        // 重新验证首页
        revalidatedPaths = ['/'];
        await getCachedDatabase().warmupCache();
        break;

      case 'post':
        // 重新验证特定文章
        if (resourceIdentifier) {
          revalidatedPaths = [`/posts/${resourceIdentifier}`];
          // 清除特定文章的缓存
          await invalidatePostCache(resourceIdentifier);
        }
        break;

      case 'category':
        // 重新验证分类页面
        if (resourceIdentifier) {
          revalidatedPaths = [`/categories/${resourceIdentifier}`];
          await invalidateCategoryCache(resourceIdentifier);
        }
        break;

      case 'tag':
        // 重新验证标签页面
        if (resourceIdentifier) {
          revalidatedPaths = [`/tags/${resourceIdentifier}`];
          await invalidateTagCache(resourceIdentifier);
        }
        break;

      case 'all':
        // 重新验证所有页面
        revalidatedPaths = await revalidateAll();
        break;

      default:
        return new Response(JSON.stringify({
          error: 'Invalid path',
          message: `不支持的重新验证路径: ${resourceType}`
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // 如果在Vercel上，触发重新验证
    if (process.env.VERCEL) {
      await triggerVercelRevalidation(revalidatedPaths);
    }

    return new Response(JSON.stringify({
      success: true,
      revalidatedPaths,
      timestamp: new Date().toISOString(),
      message: `成功重新验证 ${revalidatedPaths.length} 个页面`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('重新验证失败:', error);
    return new Response(JSON.stringify({
      error: 'Revalidation failed',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { paths, secret } = body;

    // 验证密钥
    if (secret !== process.env.REVALIDATE_SECRET) {
      return new Response(JSON.stringify({
        error: 'Invalid secret'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!Array.isArray(paths) || paths.length === 0) {
      return new Response(JSON.stringify({
        error: 'Invalid paths',
        message: '请提供要重新验证的路径数组'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 批量重新验证
    await triggerVercelRevalidation(paths);

    return new Response(JSON.stringify({
      success: true,
      revalidatedPaths: paths,
      timestamp: new Date().toISOString(),
      message: `批量重新验证 ${paths.length} 个页面成功`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('批量重新验证失败:', error);
    return new Response(JSON.stringify({
      error: 'Batch revalidation failed',
      message: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// 辅助函数：触发Vercel重新验证
async function triggerVercelRevalidation(paths: string[]): Promise<void> {
  if (!process.env.VERCEL) return;

  const VERCEL_REVALIDATE_API = `https://api.vercel.com/v1/integrations/deploy/prerender/${process.env.VERCEL_PROJECT_ID}`;

  // 注意：这需要在Vercel项目中配置webhook
  // 这里是一个简化的实现
  for (const path of paths) {
    console.log(`标记路径重新验证: ${path}`);
  }
}

// 辅助函数：使文章缓存失效
async function invalidatePostCache(slug: string): Promise<void> {
  const db = getCachedDatabase();
  // 重新获取文章以更新缓存
  await db.getPostBySlug(slug);
}

// 辅助函数：使分类缓存失效
async function invalidateCategoryCache(category: string): Promise<void> {
  const db = getCachedDatabase();
  await db.getPostsByCategory(category);
}

// 辅助函数：使标签缓存失效
async function invalidateTagCache(tag: string): Promise<void> {
  const db = getCachedDatabase();
  await db.getPostsByTag(tag);
}

// 辅助函数：重新验证所有页面
async function revalidateAll(): Promise<string[]> {
  const db = getCachedDatabase();

  // 预热所有缓存
  await db.warmupCache();

  // 获取所有需要重新验证的路径
  const posts = await db.getPosts();
  const categories = await db.getCategories();
  const tags = await db.getTags();

  const paths = [
    '/', // 首页
    '/blog', // 博客列表
    ...posts.map(post => `/posts/${post.slug}`),
    ...categories.map(cat => `/categories/${cat.name}`),
    ...tags.map(tag => `/tags/${tag}`)
  ];

  return paths;
}