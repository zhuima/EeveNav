import fs from 'node:fs'
import path from 'node:path'
import { getCollection } from 'astro:content'
import { getDatabase } from '../lib/database'

// 添加external_url列到posts表
export function migrateAddExternalUrlColumn() {
  const db = getDatabase()
  
  try {
    // 检查列是否存在
    const checkColumnExists = db['db'].prepare(`
      SELECT COUNT(*) as count FROM pragma_table_info('posts') WHERE name = 'external_url'
    `).get() as { count: number }
    
    if (checkColumnExists.count === 0) {
      console.log('添加external_url列到posts表...')
      // 添加列
      db['db'].exec(`ALTER TABLE posts ADD COLUMN external_url TEXT`)
      console.log('external_url列添加成功')
    } else {
      console.log('external_url列已存在，跳过添加')
    }
  } catch (error) {
    console.error('添加external_url列失败:', error)
  }
}

export async function migrateToDatabase() {
  const db = getDatabase()

  try {
    // 获取所有现有的博客文章
    const posts = await getCollection('blog')

    console.log(`正在迁移 ${posts.length} 篇文章到数据库...`)

    let successCount = 0
    let errorCount = 0

    for (const post of posts) {
      try {
        // 读取文章内容
        const contentPath = path.join(process.cwd(), 'src', 'content', 'blog', `${post.slug}.md`)
        let content = ''

        if (fs.existsSync(contentPath)) {
          content = fs.readFileSync(contentPath, 'utf-8')
          // 移除 frontmatter，只保留正文内容
          content = content.replace(/^---[\s\S]*?---\n/, '')
        }

        // 准备数据
        const postData = {
          title: post.data.title,
          date: post.data.date,
          des: post.data.des,
          cover: post.data.cover,
          category: post.data.category || 'unsorted',
          tags: post.data.tags || [],
          content,
          slug: post.slug,
        }

        // 插入到数据库
        const postId = db.addPost(postData)
        console.log(`✓ 成功迁移文章: ${post.data.title} (ID: ${postId})`)
        successCount++
      }
      catch (error) {
        console.error(`✗ 迁移文章失败: ${post.data.title}`, error)
        errorCount++
      }
    }

    console.log(`\n迁移完成！`)
    console.log(`成功: ${successCount} 篇`)
    console.log(`失败: ${errorCount} 篇`)

    // 显示数据库统计信息
    const allPosts = db.getPosts()
    const categories = db.getCategories()
    const tags = db.getTags()

    console.log(`\n数据库统计:`)
    console.log(`文章总数: ${allPosts.length}`)
    console.log(`分类数量: ${categories.length}`)
    console.log(`标签数量: ${tags.length}`)
  }
  catch (error) {
    console.error('迁移过程中发生错误:', error)
  }
}

// 检查数据库是否已初始化
export function isDatabaseInitialized(): boolean {
  const db = getDatabase()
  const posts = db.getPosts()
  return posts.length > 0
}

// 同步检查函数：确保数据库有数据，如果没有则自动迁移
export async function ensureDatabaseData() {
  try {
    if (!isDatabaseInitialized()) {
      console.log('数据库为空，开始自动迁移...')
      await migrateToDatabase()
    } else {
      console.log('数据库已有数据，跳过迁移')
    }
    
    // 确保external_url列存在
    migrateAddExternalUrlColumn()
  } catch (error) {
    console.error('确保数据库数据时出错:', error)
    // 即使出错也不抛出异常，允许API继续运行
  }
}
