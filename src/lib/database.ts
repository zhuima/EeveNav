import { z } from 'astro:content'
import Database from 'better-sqlite3'

// 数据验证模式
export const PostSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1, '标题不能为空').max(200, '标题过长'),
  date: z.date(),
  des: z.string().min(1, '描述不能为空').max(500, '描述过长'),
  cover: z.string().url('封面必须是有效的URL'),
  category: z.string().min(1, '分类不能为空').max(100, '分类名称过长').default('unsorted'),
  tags: z.array(z.string().min(1, '标签不能为空').max(50, '标签名称过长')).default([]),
  content: z.string().min(1, '内容不能为空'),
  slug: z.string().min(1, 'slug不能为空').max(200, 'slug过长'),
  external_url: z.string().url('外部链接必须是有效的URL').optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
})

export type Post = z.infer<typeof PostSchema>

export class BlogDatabase {
  private db: Database.Database

  constructor(dbPath: string = 'blog.db') {
    this.db = new Database(dbPath)
    this.initTables()
  }

  private initTables() {
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

    this.db.exec(createPostsTable)
    this.db.exec(createTagsTable)
    this.db.exec(createPostTagsTable)
    this.db.exec(createCategoriesTable)

    createIndexes.forEach(index => this.db.exec(index))
  }

  // 添加文章
  addPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): number {
    // 验证数据
    const validatedData = PostSchema.omit({ id: true, created_at: true, updated_at: true }).parse(postData)

    const now = new Date().toISOString()

    // 插入分类（如果不存在）
    const insertCategory = this.db.prepare(`
      INSERT OR IGNORE INTO categories (name) VALUES (?)
    `)
    insertCategory.run(validatedData.category)

    // 插入文章
    const insertPost = this.db.prepare(`
      INSERT INTO posts (title, date, des, cover, category, content, slug, external_url, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = insertPost.run(
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
    )

    const postId = result.lastInsertRowid as number

    // 处理标签
    if (validatedData.tags && validatedData.tags.length > 0) {
      this.addTagsToPost(postId, validatedData.tags)
    }

    return postId
  }

  // 为文章添加标签
  private addTagsToPost(postId: number, tags: string[]) {
    const insertTag = this.db.prepare(`
      INSERT OR IGNORE INTO tags (name) VALUES (?)
    `)

    const getTagId = this.db.prepare(`
      SELECT id FROM tags WHERE name = ?
    `)

    const insertPostTag = this.db.prepare(`
      INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)
    `)

    tags.forEach((tagName) => {
      // 插入标签（如果不存在）
      insertTag.run(tagName)

      // 获取标签ID
      const tag = getTagId.get(tagName) as { id: number }

      // 关联文章和标签
      insertPostTag.run(postId, tag.id)
    })
  }

  // 获取所有文章
  getPosts(): Post[] {
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

    const rows = this.db.prepare(query).all() as any[]

    return rows.map(row => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(',') : [],
    }))
  }

  // 根据slug获取文章
  getPostBySlug(slug: string): Post | null {
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

    const row = this.db.prepare(query).get(slug) as any

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
  getCategories(): { name: string, count: number }[] {
    const query = `
      SELECT 
        c.name,
        COUNT(p.id) as count
      FROM categories c
      LEFT JOIN posts p ON c.name = p.category
      GROUP BY c.name
      ORDER BY count DESC, c.name
    `

    return this.db.prepare(query).all() as { name: string, count: number }[]
  }

  // 获取所有标签
  getTags(): string[] {
    const query = `
      SELECT DISTINCT t.name
      FROM tags t
      INNER JOIN post_tags pt ON t.id = pt.tag_id
      ORDER BY t.name
    `

    const rows = this.db.prepare(query).all() as { name: string }[]
    return rows.map(row => row.name)
  }

  // 根据分类获取文章
  getPostsByCategory(category: string): Post[] {
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

    const rows = this.db.prepare(query).all(category) as any[]

    return rows.map(row => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(',') : [],
    }))
  }

  // 根据标签获取文章
  getPostsByTag(tag: string): Post[] {
    const query = `
      SELECT 
        p.*,
        GROUP_CONCAT(t2.name) as tags
      FROM posts p
      INNER JOIN post_tags pt ON p.id = pt.post_id
      INNER JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN post_tags pt2 ON p.id = pt2.post_id
      LEFT JOIN tags t2 ON pt2.tag_id = t2.id
      WHERE t.name = ?
      GROUP BY p.id
      ORDER BY p.date DESC
    `

    const rows = this.db.prepare(query).all(tag) as any[]

    return rows.map(row => ({
      ...row,
      date: new Date(row.date),
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      tags: row.tags ? row.tags.split(',') : [],
    }))
  }

  // 更新文章
  updatePost(id: number, postData: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>) {
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
      const insertCategory = this.db.prepare(`
        INSERT OR IGNORE INTO categories (name) VALUES (?)
      `)
      insertCategory.run(validatedData.category)
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
    this.db.prepare(query).run(...updateValues)

    // 更新标签
    if (postData.tags !== undefined) {
      // 删除旧的标签关联
      this.db.prepare('DELETE FROM post_tags WHERE post_id = ?').run(id)

      // 添加新的标签关联
      if (postData.tags.length > 0) {
        this.addTagsToPost(id, postData.tags)
      }
    }
  }

  // 删除文章
  deletePost(id: number) {
    this.db.prepare('DELETE FROM posts WHERE id = ?').run(id)
  }

  // 关闭数据库连接
  close() {
    this.db.close()
  }
}

// 单例模式
let dbInstance: BlogDatabase | null = null

export function getDatabase(): BlogDatabase {
  if (!dbInstance) {
    dbInstance = new BlogDatabase()
  }
  return dbInstance
}
