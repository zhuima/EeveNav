const { getDatabase } = require('./dist/lib/database.js')

async function debugDatabase() {
  try {
    const db = getDatabase()
    
    console.log('=== Database Debug ===')
    
    // Check posts
    const posts = await db.getPosts()
    console.log(`Total posts: ${posts.length}`)
    
    // Check categories
    const categories = await db.getCategories()
    console.log(`Total categories: ${categories.length}`)
    categories.forEach(cat => {
      console.log(`- ${cat.name}: ${cat.count} posts`)
    })
    
    // Check posts by category
    if (categories.length > 0) {
      console.log('\n=== Posts by Category ===')
      for (const cat of categories) {
        const postsInCat = await db.getPostsByCategory(cat.name)
        console.log(`${cat.name}: ${postsInCat.length} posts`)
        postsInCat.slice(0, 3).forEach(post => {
          console.log(`  - ${post.title}`)
        })
      }
    }
    
  } catch (error) {
    console.error('Debug error:', error)
  }
}

// Run directly if possible
if (require.main === module) {
  debugDatabase().catch(console.error)
}