import { z } from 'astro:content'
import { createClient } from '@libsql/client'

// 数据验证模式
export const PostSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1, '标题不能为空').max(200, '标题过长'),
  date: z.date(),
  des: z.string().max(500, '描述过长').default(''), // 允许为空
  cover: z.string().url('封面必须是有效的URL').or(z.literal('')).default(''), // 允许为空字符串
  category: z.string().min(1, '分类不能为空').max(100, '分类名称过长').default('unsorted'),
  tags: z.array(z.string().min(1, '标签不能为空').max(50, '标签名称过长')).default([]),
  content: z.string().min(1, '内容不能为空'),
  slug: z.string().min(1, 'slug不能为空').max(200, 'slug过长'),
  external_url: z.string().url('外部链接必须是有效的URL').optional().or(z.literal('')).nullable(), // 完全可选，允许空字符串和null
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

export type Post = z.infer<typeof PostSchema>

export class BlogDatabase {
  private db: any
  private initialized: Promise<void>

  constructor(url?: string, authToken?: string) {
    // 优先使用传入的参数，然后是环境变量，最后是hardcoded fallback
    const dbUrl = url || import.meta.env.PUBLIC_TURSO_DATABASE_URL || process.env.PUBLIC_TURSO_DATABASE_URL
    const dbToken = authToken || import.meta.env.PUBLIC_TURSO_AUTH_TOKEN || process.env.PUBLIC_TURSO_AUTH_TOKEN
    
    if (!dbUrl) {
      throw new Error('Database URL is not defined. Please set PUBLIC_TURSO_DATABASE_URL environment variable.')
    }

    this.db = createClient({
      url: dbUrl,
      authToken: dbToken,
    })
    this.initialized = this.initTables()
  }

  private async initTables() {
    // 创建文章表
    const createPostsTable = `
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        des TEXT NOT NULL,
        cover TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'unsorted',
        content TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        external_url TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `

    // 创建标签表
    const createTagsTable = `
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `

    // 创建文章标签关联表
    const createPostTagsTable = `
      CREATE TABLE IF NOT EXISTS post_tags (
        post_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (post_id, tag_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      )
    `

    // 创建分类表
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `

    // 创建索引
    const createIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category)',
      'CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date)',
      'CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)',
      'CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id)',
      'CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id)',
    ]

    await this.db.execute(createPostsTable)
    await this.db.execute(createTagsTable)
    await this.db.execute(createPostTagsTable)
    await this.db.execute(createCategoriesTable)

    for (const index of createIndexes) {
      await this.db.execute(index)
    }
  }

  // 添加文章
  async addPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    await this.initialized
    // 验证数据
    const validatedData = PostSchema.omit({ id: true, created_at: true, updated_at: true }).parse(postData)

    const now = new Date().toISOString()

    // 插入分类（如果不存在）
    await this.db.execute({
      sql: 'INSERT OR IGNORE INTO categories (name) VALUES (?)',
      args: [validatedData.category]
    })

    // 插入文章
    const result = await this.db.execute({
      sql: 'INSERT INTO posts (title, date, des, cover, category, content, slug, external_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [
        validatedData.title,
        validatedData.date.toISOString(),
        validatedData.des,
        validatedData.cover,
        validatedData.category,
        validatedData.content,
        validatedData.slug,
        validatedData.external_url || null,
        now,
        now,
      ]
    })

    const postId = Number(result.lastInsertRowid)

    // 处理标签
    if (validatedData.tags && validatedData.tags.length > 0) {
      await this.addTagsToPost(postId, validatedData.tags)
    }

    return postId
  }

  // 为文章添加标签
  private async addTagsToPost(postId: number, tags: string[]) {
    for (const tagName of tags) {
      // 插入标签（如果不存在）
      await this.db.execute({
        sql: 'INSERT OR IGNORE INTO tags (name) VALUES (?)',
        args: [tagName]
      })

      // 获取标签ID
      const tagResult = await this.db.execute({
        sql: 'SELECT id FROM tags WHERE name = ?',
        args: [tagName]
      })
      const tag = tagResult.rows[0] as { id: number }

      // 关联文章和标签
      await this.db.execute({
        sql: 'INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)',
        args: [postId, tag.id]
      })
    }
  }

  // 获取所有文章
  async getPosts(): Promise<Post[]> {
    await this.initialized
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      GROUP BY p.id
      ORDER BY p.date DESC
    `

    const result = await this.db.execute(query)
    const rows = result.rows as any[]

    return rows.map(row => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(',') : [],
    }))
  }

  // 根据slug获取文章
  async getPostBySlug(slug: string): Promise<Post | null> {
    await this.initialized
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.slug = ?
      GROUP BY p.id
    `

    const result = await this.db.execute({
      sql: query,
      args: [slug]
    })
    const row = result.rows[0] as any

    if (!row)
      return null

    return {
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(',') : [],
    }
  }

  // 根据ID获取文章
  async getPostById(id: number): Promise<Post | null> {
    await this.initialized
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id = ?
      GROUP BY p.id
    `

    const result = await this.db.execute({
      sql: query,
      args: [id]
    })
    const row = result.rows[0] as any

    if (!row)
      return null

    return {
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(',') : [],
    }
  }

  // 获取分类和文章数量
  async getCategories(): Promise<{ name: string, count: number }[]> {
    await this.initialized
    const query = `
      SELECT 
        c.name,
        COUNT(p.id) as count
      FROM categories c
      LEFT JOIN posts p ON c.name = p.category
      GROUP BY c.name
      ORDER BY count DESC, c.name
    `

    const result = await this.db.execute(query)
    return result.rows as { name: string, count: number }[]
  }

  // 获取所有标签
  async getTags(): Promise<string[]> {
    await this.initialized
    const query = `
      SELECT DISTINCT t.name
      FROM tags t
      INNER JOIN post_tags pt ON t.id = pt.tag_id
      ORDER BY t.name
    `

    const result = await this.db.execute(query)
    const rows = result.rows as { name: string }[]
    const unique = new Set<string>()
    for (const row of rows) {
      const name = row.name || ''
      const parts = name.split(/[\s,]+/)
      for (const p of parts) {
        const t = p.trim().replace(/^#+/, '')
        if (t) unique.add(t)
      }
    }
    return Array.from(unique)
  }

  // 根据分类获取文章
  async getPostsByCategory(category: string): Promise<Post[]> {
    await this.initialized
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.category = ?
      GROUP BY p.id
      ORDER BY p.date DESC
    `

    const result = await this.db.execute({
      sql: query,
      args: [category]
    })
    const rows = result.rows as any[]

    return rows.map(row => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(',') : [],
    }))
  }

  // 根据标签获取文章
  async getPostsByTag(tag: string): Promise<Post[]> {
    await this.initialized
    const query = `
      SELECT 
        p.*, 
        GROUP_CONCAT(t2.name) as tags
      FROM posts p
      INNER JOIN post_tags pt ON p.id = pt.post_id
      INNER JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN post_tags pt2 ON p.id = pt2.post_id
      LEFT JOIN tags t2 ON pt2.tag_id = t2.id
      WHERE t.name = ? OR t.name LIKE ? COLLATE NOCASE
      GROUP BY p.id
      ORDER BY p.date DESC
    `

    const result = await this.db.execute({
      sql: query,
      args: [tag, `%${tag}%`]
    })
    const rows = result.rows as any[]

    return rows.map(row => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(',') : [],
    }))
  }

  // 更新文章
  async updatePost(id: number, postData: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>) {
    await this.initialized
    // 验证数据
    const validatedData = PostSchema.partial().omit({ id: true, created_at: true, updated_at: true }).parse(postData)

    const now = new Date().toISOString()

    // 构建更新字段
    const updateFields: string[] = []
    const updateValues: any[] = []

    if (validatedData.title !== undefined) {
      updateFields.push('title = ?')
      updateValues.push(validatedData.title)
    }

    if (validatedData.date !== undefined) {
      updateFields.push('date = ?')
      updateValues.push(validatedData.date.toISOString())
    }

    if (validatedData.des !== undefined) {
      updateFields.push('des = ?')
      updateValues.push(validatedData.des)
    }

    if (validatedData.cover !== undefined) {
      updateFields.push('cover = ?')
      updateValues.push(validatedData.cover)
    }

    if (validatedData.category !== undefined) {
      updateFields.push('category = ?')
      updateValues.push(validatedData.category)

      // 插入分类（如果不存在）
      await this.db.execute({
        sql: 'INSERT OR IGNORE INTO categories (name) VALUES (?)',
        args: [validatedData.category]
      })
    }

    if (validatedData.content !== undefined) {
      updateFields.push('content = ?')
      updateValues.push(validatedData.content)
    }

    if (validatedData.slug !== undefined) {
      updateFields.push('slug = ?')
      updateValues.push(validatedData.slug)
    }
    
    if (validatedData.external_url !== undefined) {
      updateFields.push('external_url = ?')
      updateValues.push(validatedData.external_url)
    }

    // 添加更新时间
    updateFields.push('updated_at = ?')
    updateValues.push(now)

    // 添加ID到更新值数组的末尾
    updateValues.push(id)

    if (updateFields.length === 0)
      return

    const query = `UPDATE posts SET ${updateFields.join(', ')} WHERE id = ?`
    await this.db.execute({
      sql: query,
      args: updateValues
    })

    // 更新标签
    if (postData.tags !== undefined) {
      // 删除旧的标签关联
      await this.db.execute({
        sql: 'DELETE FROM post_tags WHERE post_id = ?',
        args: [id]
      })

      // 添加新的标签关联
      if (postData.tags.length > 0) {
        await this.addTagsToPost(id, postData.tags)
      }
    }
  }

  // 删除文章
  async deletePost(id: number) {
    await this.initialized
    await this.db.execute({
      sql: 'DELETE FROM posts WHERE id = ?',
      args: [id]
    })
  }

  // 删除分类
  async deleteCategory(categoryName: string) {
    await this.initialized
    // 检查是否有文章使用该分类
    const result = await this.db.execute({
      sql: 'SELECT COUNT(*) as count FROM posts WHERE category = ?',
      args: [categoryName]
    })
    const postsWithCategory = result.rows[0] as { count: number }
    
    if (postsWithCategory.count > 0) {
      throw new Error(`无法删除分类 "${categoryName}"，因为还有 ${postsWithCategory.count} 篇文章使用该分类`)
    }

    // 删除分类
    const deleteResult = await this.db.execute({
      sql: 'DELETE FROM categories WHERE name = ?',
      args: [categoryName]
    })
    
    if (deleteResult.rowsAffected === 0) {
      throw new Error(`分类 "${categoryName}" 不存在`)
    }

    return deleteResult.rowsAffected
  }

  // 复制文章
  async copyPost(originalId: number, newSlug?: string): Promise<number> {
    await this.initialized
    // 获取原始文章
    const result = await this.db.execute({
      sql: 'SELECT * FROM posts WHERE id = ?',
      args: [originalId]
    })
    const originalPost = result.rows[0] as any

    if (!originalPost) {
      throw new Error('原始文章不存在')
    }

    // 获取原始文章的标签
    const tagsResult = await this.db.execute({
      sql: 'SELECT t.name FROM tags t INNER JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?',
      args: [originalId]
    })
    const originalTags = tagsResult.rows as { name: string }[]

    const now = new Date().toISOString()
    
    // 生成新的slug
    const baseSlug = newSlug || `${originalPost.slug}-copy`
    let finalSlug = baseSlug
    let counter = 1

    // 确保slug是唯一的
    while (await this.getPostBySlug(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`
      counter++
    }

    // 创建复制的文章数据
    const copyData = {
      title: `${originalPost.title} (副本)`,
      date: new Date(originalPost.date),
      des: originalPost.des,
      cover: originalPost.cover,
      category: originalPost.category,
      content: originalPost.content,
      slug: finalSlug,
      external_url: originalPost.external_url,
      tags: originalTags.map(tag => tag.name)
    }

    // 插入新文章
    const newPostId = await this.addPost(copyData)
    
    return newPostId
  }

  // 搜索文章（搜索标题、描述和内容）
  async searchPosts(query: string): Promise<Post[]> {
    await this.initialized
    if (!query.trim()) {
      return []
    }

    const searchTerm = `%${query.trim()}%`
    
    const searchQuery = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE (
        p.title LIKE ? COLLATE NOCASE
        OR p.des LIKE ? COLLATE NOCASE
        OR p.content LIKE ? COLLATE NOCASE
        OR p.category LIKE ? COLLATE NOCASE
        OR EXISTS (
          SELECT 1 FROM post_tags pt2 
          INNER JOIN tags t2 ON pt2.tag_id = t2.id 
          WHERE pt2.post_id = p.id AND t2.name LIKE ? COLLATE NOCASE
        )
      )
      GROUP BY p.id
      ORDER BY 
        CASE 
          WHEN p.title LIKE ? COLLATE NOCASE THEN 1
          WHEN p.des LIKE ? COLLATE NOCASE THEN 2
          WHEN p.category LIKE ? COLLATE NOCASE THEN 3
          ELSE 4
        END,
        p.date DESC
    `

    const result = await this.db.execute({
      sql: searchQuery,
      args: [
        searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, // WHERE 条件
        searchTerm, searchTerm, searchTerm // ORDER BY 条件
      ]
    })
    const rows = result.rows as any[]

    return rows.map(row => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(',') : [],
    }))
  }

  // 获取相关文章（基于分类和标签）
  async getRelatedPosts(postId: number, limit: number = 4): Promise<Post[]> {
    await this.initialized
    
    // 首先获取当前文章的分类和标签
    const currentPostResult = await this.db.execute({
      sql: `
        SELECT p.category, GROUP_CONCAT(t.name) as tags
        FROM posts p
        LEFT JOIN post_tags pt ON p.id = pt.post_id
        LEFT JOIN tags t ON pt.tag_id = t.id
        WHERE p.id = ?
        GROUP BY p.id
      `,
      args: [postId]
    })

    if (!currentPostResult.rows[0]) {
      return []
    }

    const currentPost = currentPostResult.rows[0] as { category: string, tags: string | null }
    const currentTags = currentPost.tags ? currentPost.tags.split(',') : []

    // 如果没有标签，只按分类查找
    if (currentTags.length === 0) {
      const result = await this.db.execute({
        sql: `
          SELECT 
            p.*,
            GROUP_CONCAT(t.name) as tags
          FROM posts p
          LEFT JOIN post_tags pt ON p.id = pt.post_id
          LEFT JOIN tags t ON pt.tag_id = t.id
          WHERE p.id != ? AND p.category = ?
          GROUP BY p.id
          ORDER BY p.date DESC
          LIMIT ?
        `,
        args: [postId, currentPost.category, limit]
      })

      const rows = result.rows as any[]
      return rows.map(row => ({
        ...row,
        date: new Date(row.date),
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
        tags: row.tags ? row.tags.split(',') : [],
      }))
    }

    // 查找相关文章 - 优先级：相同分类+共同标签 > 相同分类 > 共同标签
    const placeholders = currentTags.map(() => '?').join(',')
    const relatedQuery = `
      SELECT 
        p.*,
        GROUP_CONCAT(t.name) as tags,
        CASE 
          WHEN p.category = ? THEN 2
          ELSE 0
        END +
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM post_tags pt2 
            INNER JOIN tags t2 ON pt2.tag_id = t2.id 
            WHERE pt2.post_id = p.id AND t2.name IN (${placeholders})
          ) THEN 1
          ELSE 0
        END as relevance_score
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.id != ? 
        AND (
          p.category = ? 
          OR EXISTS (
            SELECT 1 FROM post_tags pt3 
            INNER JOIN tags t3 ON pt3.tag_id = t3.id 
            WHERE pt3.post_id = p.id AND t3.name IN (${placeholders})
          )
        )
      GROUP BY p.id
      HAVING relevance_score > 0
      ORDER BY relevance_score DESC, p.date DESC
      LIMIT ?
    `

    const args = [
      currentPost.category,  // 第一个分类条件
      ...currentTags,        // 标签条件1
      postId,               // 排除当前文章
      currentPost.category,  // 第二个分类条件
      ...currentTags,        // 标签条件2
      limit                 // 限制数量
    ]

    const result = await this.db.execute({
      sql: relatedQuery,
      args: args
    })

    const rows = result.rows as any[]
    return rows.map(row => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(',') : [],
    }))
  }

  // 添加分类
  async addCategory(categoryName: string): Promise<void> {
    await this.initialized
    
    // 检查分类是否已存在
    const existingCategories = await this.getCategories()
    const exists = existingCategories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())
    
    if (exists) {
      throw new Error(`分类 "${categoryName}" 已存在`)
    }

    // 添加新分类
    await this.db.execute({
      sql: 'INSERT INTO categories (name) VALUES (?)',
      args: [categoryName]
    })
  }

  // 关闭数据库连接
  close() {
    // Turso client 不需要手动关闭连接
  }
}

// 单例模式
let dbInstance: BlogDatabase | null = null

export function getDatabase(): BlogDatabase {
  if (!dbInstance) {
    dbInstance = new BlogDatabase(
      import.meta.env.PUBLIC_TURSO_DATABASE_URL || process.env.PUBLIC_TURSO_DATABASE_URL,
      import.meta.env.PUBLIC_TURSO_AUTH_TOKEN || process.env.PUBLIC_TURSO_AUTH_TOKEN
    )
  }
  return dbInstance
}
