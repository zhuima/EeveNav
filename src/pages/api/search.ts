import type { APIRoute } from 'astro'
import { getDatabase } from '../../lib/database'

// 防止预渲染,确保作为服务器端点运行
export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('POST request received')

    // 检查请求方法
    console.log('Request method:', request.method)

    // 检查请求头
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))

    // 从请求体获取搜索参数
    let body;
    try {
      const text = await request.text();
      console.log('Request body text:', text)
      console.log('Request body length:', text.length)

      if (!text) {
        return new Response(JSON.stringify({
          success: false,
          error: '请求体不能为空'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      body = JSON.parse(text);
      console.log('Parsed body:', body)
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError)
      return new Response(JSON.stringify({
        success: false,
        error: '请求体格式错误，需要有效的JSON'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const searchQuery = body.search

    console.log('Search API called (POST)')
    console.log('Search query:', searchQuery)

    if (!searchQuery || !searchQuery.trim()) {
      return new Response(JSON.stringify({
        success: false,
        error: '搜索关键词不能为空'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const db = getDatabase()
    const searchResults = await db.searchPosts(searchQuery.trim())

    console.log('Found results:', searchResults.length)

    return new Response(JSON.stringify({
      success: true,
      posts: searchResults,
      query: searchQuery.trim()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Search API error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: '搜索失败',
      details: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// 同时支持GET方法（用于直接测试）
export const GET: APIRoute = async ({ request }) => {
  try {
    // 从request.url获取查询参数
    const requestUrl = new URL(request.url)
    const searchQuery = requestUrl.searchParams.get('search')

    console.log('Search API called (GET)')
    console.log('Request URL:', request.url)
    console.log('Search query:', searchQuery)

    if (!searchQuery || !searchQuery.trim()) {
      return new Response(JSON.stringify({
        success: false,
        error: '搜索关键词不能为空'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const db = getDatabase()
    const searchResults = await db.searchPosts(searchQuery.trim())

    console.log('Found results:', searchResults.length)

    return new Response(JSON.stringify({
      success: true,
      posts: searchResults,
      query: searchQuery.trim()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Search API error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: '搜索失败',
      details: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}