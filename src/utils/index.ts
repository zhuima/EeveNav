import { getCollection } from 'astro:content'
import { getDatabase } from '../lib/database'

export async function getPosts(tag = '') {
  try {
    const db = getDatabase()

    if (tag) {
      // 根据标签筛选文章
      return db.getPostsByTag(tag)
    }
    else {
      // 获取所有文章
      return db.getPosts()
    }
  }
  catch (error) {
    console.error('Error fetching posts from database:', error)
    // 回退到原始的文件系统方式
    let posts = []
    if (!tag) {
      posts = await getCollection('blog')
    }
    return posts
  }
}

interface Category {
  name: string
  count: number
}

export async function getCategories() {
  try {
    const db = getDatabase()
    return db.getCategories()
  }
  catch (error) {
    console.error('Error fetching categories from database:', error)
    // 回退到原始的文件系统方式
    const posts = await getCollection('blog')

    // 获取分类,返回分类名称和数量,即name和count
    const categories = posts.reduce((acc, post) => {
      const category = post.data.category as string
      if (!acc[category]) {
        acc[category] = { name: category, count: 0 } as Category
      }
      acc[category].count++
      return acc
    }, {} as Record<string, Category>)

    return Object.values(categories)
  }
}

export async function getTags() {
  try {
    const db = getDatabase()
    return db.getTags()
  }
  catch (error) {
    console.error('Error fetching tags from database:', error)
    // 回退到原始的文件系统方式
    const posts = await getCollection('blog')

    // 获取标签，只返回标签名称，去重
    const uniqueTags = new Set()
    posts.forEach((post) => {
      if (post.data.tags) {
        post.data.tags.forEach(tag => uniqueTags.add(tag))
      }
    })
    return Array.from(uniqueTags)
  }
}

export function getDate(dateObj: Date) {
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  return `${year}-${month}-${day}`
}
