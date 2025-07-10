import type { APIRoute } from 'astro'
import { getDatabase, PostSchema } from '../../lib/database'
import { ensureDatabaseData } from '../../lib/migration'

export const GET: APIRoute = async ({ url, request }) => {
  try {
    console.log('API called with URL:', url)
    console.log('Request URL:', request.url)
    
    // 使用request.url而不是url参数
    const requestUrl = new URL(request.url)
    const action = requestUrl.searchParams.get('action')
    
    console.log('Action parameter:', action)
    
    const db = getDatabase()

    // 如果没有提供action参数，返回API使用信息而不是错误
    if (!action) {
      return new Response(JSON.stringify({
        message: '欢迎使用博客API',
        availableActions: {
          posts: '获取所有文章列表',
          categories: '获取所有分类',
          tags: '获取所有标签',
          post: '获取单篇文章（需要slug参数）'
        },
        usage: 'http://localhost:4321/api/blog?action=posts'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    switch (action) {
      case 'posts': {
        console.log('Getting posts...')
        try {
          const posts = db.getPosts()
          console.log('Posts found:', posts.length)
          return new Response(JSON.stringify(posts), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (dbError) {
          console.error('Database error getting posts:', dbError)
          // 返回空数组而不是错误
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }

      case 'categories': {
        console.log('Getting categories...')
        try {
          const categories = db.getCategories()
          console.log('Categories found:', categories.length)
          return new Response(JSON.stringify(categories), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (dbError) {
          console.error('Database error getting categories:', dbError)
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }

      case 'tags': {
        console.log('Getting tags...')
        try {
          const tags = db.getTags()
          console.log('Tags found:', tags.length)
          return new Response(JSON.stringify(tags), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (dbError) {
          console.error('Database error getting tags:', dbError)
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }

      case 'post': {
        const slug = requestUrl.searchParams.get('slug')
        if (!slug) {
          return new Response(JSON.stringify({ error: 'slug参数必需' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const post = db.getPostBySlug(slug)
        if (!post) {
          return new Response(JSON.stringify({ error: '文章不存在' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        return new Response(JSON.stringify(post), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      default:
        console.log('Unknown action:', action)
        return new Response(JSON.stringify({ 
          error: '无效的操作', 
          action,
          availableActions: ['posts', 'categories', 'tags', 'post'],
          usage: 'http://localhost:4321/api/blog?action=posts'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
    }
  } catch (error) {
    console.error('API错误:', error)
    return new Response(JSON.stringify({ 
      error: '服务器内部错误',
      details: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    await ensureDatabaseData()
    const db = getDatabase()
    
    // 添加错误处理来捕获JSON解析错误
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      return new Response(JSON.stringify({
        error: 'JSON解析错误',
        details: '请求体必须是有效的JSON格式',
        usage: '请求体必须包含action和data字段，例如: {"action": "add", "data": {...}}',
        examples: {
          add: {
            action: 'add',
            data: {
              title: '示例文章标题',
              date: '2023-06-15T12:00:00Z', // ISO格式的日期字符串
              des: '这是一篇示例文章的描述',
              cover: 'https://example.com/image.jpg',
              category: '技术',
              tags: ['JavaScript', 'Astro'],
              content: '# 示例文章\n\n这是文章内容...',
              slug: 'example-post'
            }
          },
          update: {
            action: 'update',
            data: {
              id: 1,
              title: '更新后的标题',
              date: '2023-06-16T12:00:00Z'
            }
          },
          delete: {
            action: 'delete',
            data: {
              id: 1
            }
          }
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const { action, data } = body;
    
    // 验证请求中是否包含必要的字段
    if (!action) {
      return new Response(JSON.stringify({
        error: '缺少action字段',
        availableActions: ['add', 'update', 'delete'],
        usage: 'POST请求需要包含action和data字段'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    if (!data) {
      return new Response(JSON.stringify({
        error: '缺少data字段',
        usage: 'POST请求需要包含action和data字段',
        examples: {
          add: {
            action: 'add',
            data: {
              title: '示例文章标题',
              date: '2023-06-15T12:00:00Z',
              des: '这是一篇示例文章的描述',
              cover: 'https://example.com/image.jpg',
              category: '技术',
              tags: ['JavaScript', 'Astro'],
              content: '# 示例文章\n\n这是文章内容...',
              slug: 'example-post'
            }
          }
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    switch (action) {
      case 'add': {
        try {
          // 处理日期字段 - 如果是字符串，转换为 Date 对象
          if (data.date && typeof data.date === 'string') {
            data.date = new Date(data.date);
            if (isNaN(data.date.getTime())) {
              return new Response(JSON.stringify({ 
                error: '日期格式无效',
                details: '请提供有效的日期格式，如 ISO 格式 (YYYY-MM-DD 或 YYYY-MM-DDTHH:MM:SS.sssZ)'
              }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              });
            }
          }
          
          // 验证数据
          const validatedData = PostSchema.omit({ id: true, created_at: true, updated_at: true }).parse(data)

          // 检查slug是否已存在
          const existingPost = db.getPostBySlug(validatedData.slug)
          if (existingPost) {
            return new Response(JSON.stringify({ error: 'Slug已存在' }), {
              status: 409,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const postId = db.addPost(validatedData)
          return new Response(JSON.stringify({ id: postId, message: '文章添加成功' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (validationError) {
          console.error('验证错误:', validationError);
          return new Response(JSON.stringify({ 
            error: '数据验证失败', 
            details: validationError instanceof Error ? validationError.message : '未知验证错误',
            help: '确保日期字段是有效的日期格式，如 ISO 格式 (YYYY-MM-DD 或 YYYY-MM-DDTHH:MM:SS.sssZ)'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      case 'update': {
        const { id, ...updateData } = data
        if (!id) {
          return new Response(JSON.stringify({ error: '文章ID必需' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        try {
          // 处理日期字段 - 如果是字符串，转换为 Date 对象
          if (updateData.date && typeof updateData.date === 'string') {
            updateData.date = new Date(updateData.date);
            if (isNaN(updateData.date.getTime())) {
              return new Response(JSON.stringify({ 
                error: '日期格式无效',
                details: '请提供有效的日期格式，如 ISO 格式 (YYYY-MM-DD 或 YYYY-MM-DDTHH:MM:SS.sssZ)'
              }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              });
            }
          }

          // 验证更新数据
          const validatedUpdateData = PostSchema.omit({ id: true, created_at: true, updated_at: true }).partial().parse(updateData)

          db.updatePost(id, validatedUpdateData)
          return new Response(JSON.stringify({ message: '文章更新成功' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (validationError) {
          console.error('验证错误:', validationError);
          return new Response(JSON.stringify({ 
            error: '数据验证失败', 
            details: validationError instanceof Error ? validationError.message : '未知验证错误',
            help: '确保日期字段是有效的日期格式，如 ISO 格式 (YYYY-MM-DD 或 YYYY-MM-DDTHH:MM:SS.sssZ)'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      case 'delete': {
        const deleteId = data.id
        if (!deleteId) {
          return new Response(JSON.stringify({ error: '文章ID必需' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        db.deletePost(deleteId)
        return new Response(JSON.stringify({ message: '文章删除成功' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      default:
        return new Response(JSON.stringify({ 
          error: '无效的操作',
          availableActions: ['add', 'update', 'delete'],
          usage: 'POST请求需要包含action和data字段',
          examples: {
            add: {
              action: 'add',
              data: {
                title: '示例文章标题',
                date: '2023-06-15T12:00:00Z', // ISO格式的日期字符串
                des: '这是一篇示例文章的描述',
                cover: 'https://example.com/image.jpg',
                category: '技术',
                tags: ['JavaScript', 'Astro'],
                content: '# 示例文章\n\n这是文章内容...',
                slug: 'example-post'
              }
            },
            update: {
              action: 'update',
              data: {
                id: 1,
                title: '更新后的标题',
                date: '2023-06-16T12:00:00Z'
              }
            },
            delete: {
              action: 'delete',
              data: {
                id: 1
              }
            }
          }
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
    }
  } catch (error) {
    console.error('API错误:', error)

    // 如果是验证错误，返回详细信息
    if (error instanceof Error && error.message.includes('validation')) {
      return new Response(JSON.stringify({ error: '数据验证失败', details: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ 
      error: '服务器内部错误',
      details: error instanceof Error ? error.message : '未知错误'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}