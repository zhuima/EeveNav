import type { APIRoute } from 'astro'
import { getDatabase, PostSchema } from '../../lib/database'

export const GET: APIRoute = async ({ url, request }) => {
  try {
    console.log('API called with URL:', url)
    console.log('Request URL:', request.url)
    
    // 使用request.url而不是url参数
    const requestUrl = new URL(request.url)
    const action = requestUrl.searchParams.get('action')
    const searchQuery = requestUrl.searchParams.get('search')
    
    console.log('Action parameter:', action)
    console.log('Search parameter:', searchQuery)
    
    const db = getDatabase()

    // 如果有搜索参数，执行搜索
    if (searchQuery) {
      try {
        const searchResults = await db.searchPosts(searchQuery.trim())
        console.log('Search results:', searchResults.length)
        return new Response(JSON.stringify({
          success: true,
          posts: searchResults,
          query: searchQuery.trim()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      } catch (searchError) {
        console.error('Search error:', searchError)
        return new Response(JSON.stringify({
          success: false,
          posts: [],
          error: '搜索失败'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

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
        searchUsage: 'http://localhost:4321/api/blog?search=关键词',
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
          const posts = await db.getPosts()
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
          const categories = await db.getCategories()
          console.log('Categories found:', categories.length)
          return new Response(JSON.stringify({
            success: true,
            categories: categories
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (dbError) {
          console.error('Database error getting categories:', dbError)
          return new Response(JSON.stringify({
            success: false,
            categories: []
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }

      case 'tags': {
        console.log('Getting tags...')
        try {
          const tags = await db.getTags()
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

        const post = await db.getPostBySlug(slug)
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
    // await ensureDatabaseData() // 临时注释掉，避免重复数据插入
    const db = getDatabase()
    
    // 添加错误处理来捕获JSON解析错误
    let body: any;
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
        availableActions: ['add', 'update', 'delete', 'delete-category', 'copy-post'],
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
          } else {
            // 如果没有提供日期，使用当前时间
            data.date = new Date();
          }

          // 处理可选的URL字段，空字符串转为null
          if (data.cover === '') {
            data.cover = null;
          }
          if (data.external_url === '') {
            data.external_url = null;
          }
          
          // 验证数据
          const validatedData = PostSchema.omit({ id: true, created_at: true, updated_at: true }).parse(data)

          // 检查slug是否已存在
          const existingPost = await db.getPostBySlug(validatedData.slug)
          if (existingPost) {
            return new Response(JSON.stringify({ error: 'Slug已存在' }), {
              status: 409,
              headers: { 'Content-Type': 'application/json' },
            })
          }

          const postId = await db.addPost(validatedData)
          return new Response(JSON.stringify({ id: postId, message: '文章添加成功' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (validationError) {
          console.error('验证错误:', validationError);
          return new Response(JSON.stringify({ 
            error: '数据验证失败', 
            details: validationError instanceof Error ? validationError.message : '未知验证错误',
            help: '确保所有必填字段都已填写且格式正确'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      case 'update': {
        const { id, ...updateData } = data
        if (!id) {
          return new Response(JSON.stringify({ 
            success: false,
            error: '文章ID必需' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        try {
          // 处理日期字段 - 如果是字符串，转换为 Date 对象，如果没有则不更新日期
          if (updateData.date) {
            if (typeof updateData.date === 'string') {
              updateData.date = new Date(updateData.date);
              if (isNaN(updateData.date.getTime())) {
                return new Response(JSON.stringify({ 
                  success: false,
                  error: '日期格式无效',
                  details: '请提供有效的日期格式，如 ISO 格式 (YYYY-MM-DD 或 YYYY-MM-DDTHH:MM:SS.sssZ)'
                }), {
                  status: 400,
                  headers: { 'Content-Type': 'application/json' },
                });
              }
            }
          }

          // 处理可选的URL字段，空字符串转为null
          if (updateData.cover === '') {
            updateData.cover = null;
          }
          if (updateData.external_url === '') {
            updateData.external_url = null;
          }

          // 验证更新数据 - 只验证提供的字段
          const validatedUpdateData = PostSchema.omit({ id: true, created_at: true, updated_at: true }).partial().parse(updateData)

          await db.updatePost(id, validatedUpdateData)
          return new Response(JSON.stringify({ 
            success: true,
            message: '文章更新成功' 
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (validationError) {
          console.error('验证错误:', validationError);
          return new Response(JSON.stringify({ 
            success: false,
            error: '数据验证失败', 
            details: validationError instanceof Error ? validationError.message : '未知验证错误',
            help: '确保所有必填字段都已填写且格式正确'
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

        await db.deletePost(deleteId)
        return new Response(JSON.stringify({ message: '文章删除成功' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      case 'delete-category': {
        const { categoryName } = data
        if (!categoryName) {
          return new Response(JSON.stringify({ error: '分类名称必需' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        try {
          await db.deleteCategory(categoryName)
          return new Response(JSON.stringify({ message: '分类删除成功' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: error instanceof Error ? error.message : '删除分类失败' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }

      case 'add-category': {
        const { categoryName } = data
        if (!categoryName) {
          return new Response(JSON.stringify({ error: '分类名称不能为空' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        try {
          await db.addCategory(categoryName)
          return new Response(JSON.stringify({ message: '分类添加成功' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '添加分类失败'
          const status = errorMessage.includes('已存在') ? 409 : 400
          return new Response(JSON.stringify({ 
            error: errorMessage
          }), {
            status: status,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }

      case 'copy-post': {
        const { postId, newSlug } = data
        if (!postId) {
          return new Response(JSON.stringify({ error: '文章ID必需' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        try {
          const newPostId = await db.copyPost(postId, newSlug)
          return new Response(JSON.stringify({ 
            id: newPostId, 
            message: '文章复制成功' 
          }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          return new Response(JSON.stringify({ 
            error: error instanceof Error ? error.message : '复制文章失败' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }

      default:
        return new Response(JSON.stringify({ 
          error: '无效的操作',
          availableActions: ['add', 'update', 'delete', 'delete-category', 'copy-post'],
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
            },
            'delete-category': {
              action: 'delete-category',
              data: {
                categoryName: '分类名称'
              }
            },
            'copy-post': {
              action: 'copy-post',
              data: {
                postId: 1,
                newSlug: 'new-slug-name' // 可选
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