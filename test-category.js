const { createClient } = require('@libsql/client');

async function testCategoryPages() {
  console.log('=== Testing Category Pages ===');
  
  const client = createClient({ url: 'file:./blog.db' });
  
  try {
    // Test the exact query used in the category page
    const category = '工具资源';
    console.log('Testing category:', category);
    
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
    `;
    
    const result = await client.execute({
      sql: query,
      args: [category]
    });
    
    console.log('Database query result:', result.rows.length, 'posts');
    
    if (result.rows.length > 0) {
      console.log('First post from database:');
      console.log('- Title:', result.rows[0].title);
      console.log('- Category:', result.rows[0].category);
      console.log('- Slug:', result.rows[0].slug);
      console.log('- Date:', result.rows[0].date);
    }
    
    // Check if we can access the database via the getDatabase function
    console.log('\n=== Testing getDatabase function ===');
    try {
      const { getDatabase } = require('./dist/lib/database.js');
      const db = getDatabase();
      const posts = await db.getPostsByCategory(category);
      console.log('getDatabase result:', posts.length, 'posts');
      
      if (posts.length > 0) {
        console.log('First post from getDatabase:');
        console.log('- Title:', posts[0].title);
        console.log('- Category:', posts[0].category);
        console.log('- Slug:', posts[0].slug);
      }
    } catch (dbError) {
      console.error('getDatabase error:', dbError);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testCategoryPages().catch(console.error);