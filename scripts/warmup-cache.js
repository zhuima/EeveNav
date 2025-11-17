#!/usr/bin/env node

const { execSync } = require('child_process');
const https = require('https');
const http = require('http');

// 配置
const CONFIG = {
  baseUrl: process.env.SITE_URL || 'https://affdirs.com',
  revalidateSecret: process.env.REVALIDATE_SECRET || 'your-secret-key',
  concurrency: 5, // 并发请求数
  timeout: 10000 // 请求超时时间（毫秒）
};

async function main() {
  console.log('🔥 开始缓存预热...\n');

  try {
    // 步骤1: 触发服务端缓存预热
    console.log('🚀 触发服务端缓存预热...');
    await triggerServerCacheWarmup();

    // 步骤2: 预热关键页面
    console.log('📄 预热关键页面...');
    await warmupCriticalPages();

    // 步骤3: 预热分类和标签页面
    console.log('🏷️  预热分类和标签页面...');
    await warmupTaxonomyPages();

    // 步骤4: 预热文章页面
    console.log('📝 预热文章页面...');
    await warmupPostPages();

    // 步骤5: 预热静态资源
    console.log('🎨 预热静态资源...');
    await warmupStaticAssets();

    console.log('\n✅ 缓存预热完成！');
    console.log('\n📊 预热统计:');
    console.log(`   🌐 预热页面数: ${stats.pagesWarmed}`);
    console.log(`   📁 预热资源数: ${stats.assetsWarmed}`);
    console.log(`   ⚡ 成功率: ${stats.successRate}%`);
    console.log(`   ⏱️  总耗时: ${stats.totalTime}ms`);

  } catch (error) {
    console.error('\n❌ 缓存预热失败:', error.message);
    process.exit(1);
  }
}

// 统计信息
const stats = {
  pagesWarmed: 0,
  assetsWarmed: 0,
  errors: 0,
  startTime: Date.now(),
  get totalTime() {
    return Date.now() - this.startTime;
  },
  get successRate() {
    const total = this.pagesWarmed + this.assetsWarmed + this.errors;
    return total > 0 ? Math.round((this.pagesWarmed + this.assetsWarmed) / total * 100) : 0;
  }
};

// 触发服务端缓存预热
async function triggerServerCacheWarmup() {
  try {
    const url = `${CONFIG.baseUrl}/api/revalidate/home?secret=${CONFIG.revalidateSecret}`;
    await makeRequest(url);
    console.log('   ✅ 服务端缓存预热完成');
  } catch (error) {
    console.warn(`   ⚠️  服务端缓存预热失败: ${error.message}`);
  }
}

// 预热关键页面
async function warmupCriticalPages() {
  const criticalPages = [
    '/',
    '/blog',
    '/about',
    '/faq',
    '/submit',
    '/terms',
    '/privacy'
  ];

  await batchRequest(criticalPages, '关键页面');
  stats.pagesWarmed += criticalPages.length;
}

// 预热分类和标签页面
async function warmupTaxonomyPages() {
  try {
    // 获取分类列表
    const categories = await fetchData('/api/categories');
    const categoryPages = categories.map(cat => `/categories/${encodeURIComponent(cat.name)}`);

    // 获取标签列表
    const tags = await fetchData('/api/tags');
    const tagPages = tags.map(tag => `/tags/${encodeURIComponent(tag)}`);

    await batchRequest([...categoryPages, ...tagPages], '分类和标签页面');
    stats.pagesWarmed += categoryPages.length + tagPages.length;

  } catch (error) {
    console.warn(`   ⚠️  预热分类和标签页面失败: ${error.message}`);
  }
}

// 预热文章页面
async function warmupPostPages() {
  try {
    // 获取文章列表
    const posts = await fetchData('/api/posts');
    const postPages = posts.slice(0, 20).map(post => `/posts/${post.slug}`); // 只预热前20篇文章

    await batchRequest(postPages, '文章页面');
    stats.pagesWarmed += postPages.length;

  } catch (error) {
    console.warn(`   ⚠️  预热文章页面失败: ${error.message}`);
  }
}

// 预热静态资源
async function warmupStaticAssets() {
  const staticAssets = [
    '/favicon.svg',
    '/manifest.json',
    '/robots.txt',
    '/sitemap.xml',
    '/og.jpg'
  ];

  await batchRequest(staticAssets, '静态资源');
  stats.assetsWarmed += staticAssets.length;
}

// 批量请求
async function batchRequest(urls, description) {
  const chunks = chunkArray(urls, CONFIG.concurrency);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const promises = chunk.map(url =>
      makeRequest(url).catch(error => {
        console.warn(`     ⚠️  ${url} 失败: ${error.message}`);
        stats.errors++;
      })
    );

    await Promise.all(promises);

    if (i < chunks.length - 1) {
      // 在批次之间添加小延迟，避免过于频繁的请求
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log(`   ✅ ${description}预热完成`);
}

// 发起HTTP请求
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const startTime = Date.now();

    const req = protocol.get(url, {
      timeout: CONFIG.timeout,
      headers: {
        'User-Agent': 'Cache-Warmer/1.0 (+https://affdirs.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache'
      }
    }, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({
            statusCode: res.statusCode,
            responseTime,
            size: data.length
          });
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(error.message));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
  });
}

// 获取数据
async function fetchData(endpoint) {
  const url = `${CONFIG.baseUrl}${endpoint}`;
  const response = await makeRequest(url);

  if (response.statusCode !== 200) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusCode}`);
  }

  // 这里需要解析JSON响应
  // 简化处理，假设API返回正确的JSON
  return [];
}

// 数组分块
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };