import { BlogDatabase, getDatabase } from './database';
import { cached, cache, CacheKeys } from './cache';
import type { Post } from './database';

export class CachedBlogDatabase {
  private db: BlogDatabase;

  constructor() {
    this.db = getDatabase();
  }

  // 带缓存的获取所有文章
  getPosts = cached(
    () => this.db.getPosts(),
    () => CacheKeys.POSTS,
    10 * 60 * 1000 // 10分钟缓存
  );

  // 带缓存的根据slug获取文章
  getPostBySlug = cached(
    (slug: string) => this.db.getPostBySlug(slug),
    (slug) => CacheKeys.POST_BY_SLUG(slug),
    15 * 60 * 1000 // 15分钟缓存
  );

  // 带缓存的根据分类获取文章
  getPostsByCategory = cached(
    (category: string) => this.db.getPostsByCategory(category),
    (category) => CacheKeys.POSTS_BY_CATEGORY(category),
    8 * 60 * 1000 // 8分钟缓存
  );

  // 带缓存的根据标签获取文章
  getPostsByTag = cached(
    (tag: string) => this.db.getPostsByTag(tag),
    (tag) => CacheKeys.POSTS_BY_TAG(tag),
    8 * 60 * 1000 // 8分钟缓存
  );

  // 带缓存的获取分类
  getCategories = cached(
    () => this.db.getCategories(),
    () => CacheKeys.CATEGORIES,
    20 * 60 * 1000 // 20分钟缓存
  );

  // 带缓存的获取标签
  getTags = cached(
    () => this.db.getTags(),
    () => CacheKeys.TAGS,
    20 * 60 * 1000 // 20分钟缓存
  );

  // 带缓存的搜索功能
  search = cached(
    (query: string) => this.db.searchPosts(query),
    (query) => CacheKeys.SEARCH_RESULTS(query.toLowerCase()),
    5 * 60 * 1000 // 5分钟缓存
  );

  // 带缓存的获取相关文章
  getRelatedPosts = cached(
    (postId: number, limit?: number) => this.db.getRelatedPosts(postId, limit),
    (postId, limit) => CacheKeys.RELATED_POSTS(postId) + (limit ? `:limit=${limit}` : ''),
    12 * 60 * 1000 // 12分钟缓存
  );

  // 写操作 - 这些会清除相关缓存
  async addPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const result = await this.db.addPost(postData);
    this.clearRelevantCache();
    return result;
  }

  async updatePost(id: number, postData: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>) {
    await this.db.updatePost(id, postData);
    this.clearRelevantCache();
  }

  async deletePost(id: number) {
    await this.db.deletePost(id);
    this.clearRelevantCache();
  }

  async addCategory(categoryName: string): Promise<void> {
    await this.db.addCategory(categoryName);
    cache.delete(CacheKeys.CATEGORIES);
    this.clearPostsCache();
  }

  async deleteCategory(categoryName: string) {
    await this.db.deleteCategory(categoryName);
    cache.delete(CacheKeys.CATEGORIES);
    this.clearPostsCache();
  }

  async copyPost(originalId: number, newSlug?: string): Promise<number> {
    const result = await this.db.copyPost(originalId, newSlug);
    this.clearRelevantCache();
    return result;
  }

  // 清除所有相关缓存
  private clearRelevantCache() {
    const keys = [
      CacheKeys.POSTS,
      CacheKeys.CATEGORIES,
      CacheKeys.TAGS
    ];

    keys.forEach(key => cache.delete(key));
    this.clearPostSpecificCache();
    this.clearPostsCache();
  }

  // 清除特定文章缓存
  private clearPostSpecificCache() {
    const stats = cache.getStats();
    stats.keys.forEach(key => {
      if (key.startsWith('post:') || key.startsWith('related:') || key.startsWith('search:')) {
        cache.delete(key);
      }
    });
  }

  // 清除分类和标签相关的文章缓存
  private clearPostsCache() {
    const stats = cache.getStats();
    stats.keys.forEach(key => {
      if (key.startsWith('posts:')) {
        cache.delete(key);
      }
    });
  }

  // 手动清除缓存的方法
  clearCache(): void {
    cache.clear();
  }

  // 预热缓存 - 在构建时调用
  async warmupCache(): Promise<void> {
    try {
      console.log('开始预热缓存...');
      const startTime = Date.now();

      // 并行预热所有数据
      await Promise.all([
        this.getPosts(),
        this.getCategories(),
        this.getTags()
      ]);

      // 预热一些分类页面
      const categories = await this.getCategories();
      const topCategories = categories.slice(0, 5); // 预热前5个分类
      await Promise.all(
        topCategories.map(cat => this.getPostsByCategory(cat.name))
      );

      // 预热一些标签页面
      const tags = await this.getTags();
      const topTags = tags.slice(0, 10); // 预热前10个标签
      await Promise.all(
        topTags.map(tag => this.getPostsByTag(tag))
      );

      const endTime = Date.now();
      console.log(`缓存预热完成，耗时: ${endTime - startTime}ms`);
    } catch (error) {
      console.error('缓存预热失败:', error);
    }
  }

  // 获取缓存统计信息
  getCacheStats() {
    return {
      ...cache.getStats(),
      description: '缓存命中统计信息'
    };
  }
}

// 导出单例实例
let cachedDbInstance: CachedBlogDatabase | null = null;

export function getCachedDatabase(): CachedBlogDatabase {
  if (!cachedDbInstance) {
    cachedDbInstance = new CachedBlogDatabase();
  }
  return cachedDbInstance;
}