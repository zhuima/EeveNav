import { getCollection } from 'astro:content'

export async function getPosts(tag = '') {
  let posts = []
  if (!tag) {
    posts = await getCollection('blog')
  }
  return posts
}

interface Category {
  name: string
  count: number
}

export async function getCategories() {
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

export async function getTags() {
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

export function getDate(dateObj: Date) {
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  return `${year}-${month}-${day}`
}
