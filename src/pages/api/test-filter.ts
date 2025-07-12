import type { APIRoute } from 'astro'
import { getDatabase } from '../../lib/database'

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams
    const type = searchParams.get('type') // 'category' 或 'tag'
    const value = searchParams.get('value') // 分类名或标签名
    
    if (!type || !value) {
      return new Response(JSON.stringify({
        error: '缺少参数',
        usage: '/api/test-filter?type=category&value=工具资源 或 /api/test-filter?type=tag&value=工具资源'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const db = getDatabase()
    let posts = []
    
    if (type === 'category') {
      posts = await db.getPostsByCategory(value)
    } else if (type === 'tag') {
      posts = await db.getPostsByTag(value)
    }

    return new Response(JSON.stringify({
      type,
      value,
      count: posts.length,
      posts: posts.map(p => ({ id: p.id, title: p.title, category: p.category, tags: p.tags }))
    }, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Test filter error:', error)
    return new Response(JSON.stringify({ 
      error: '测试失败',
      details: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}