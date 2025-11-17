// 简单的内存缓存实现
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // 每5分钟清理一次过期缓存
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // 获取缓存统计信息
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// 全局缓存实例
export const cache = new MemoryCache();

// 缓存装饰器
export function cached<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  getKey: (...args: Parameters<T>) => string,
  ttl: number = 5 * 60 * 1000
): T {
  return (async (...args: Parameters<T>) => {
    const key = getKey(...args);

    // 尝试从缓存获取
    const cached = cache.get(key);
    if (cached !== null) {
      console.log(`Cache hit for key: ${key}`);
      return cached;
    }

    // 缓存未命中，执行原函数
    console.log(`Cache miss for key: ${key}`);
    const result = await fn(...args);

    // 存入缓存
    cache.set(key, result, ttl);

    return result;
  }) as T;
}

// 缓存键生成器
export const CacheKeys = {
  POSTS: 'posts',
  POST_BY_SLUG: (slug: string) => `post:${slug}`,
  POSTS_BY_CATEGORY: (category: string) => `posts:category:${category}`,
  POSTS_BY_TAG: (tag: string) => `posts:tag:${tag}`,
  CATEGORIES: 'categories',
  TAGS: 'tags',
  SEARCH_RESULTS: (query: string) => `search:${query}`,
  RELATED_POSTS: (postId: number) => `related:${postId}`
};