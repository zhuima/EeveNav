import { createClient } from '@libsql/client';

async function testCategory() {
  console.log('=== Testing Category Data ===');
  
  try {
    const client = createClient({ url: 'file:./blog.db' });
    
    const category = '工具资源';
    console.log('Testing category:', category);
    
    const result = await client.execute({
      sql: 'SELECT id, title, category, slug FROM posts WHERE category = ?',
      args: [category]
    });
    
    console.log('Posts found:', result.rows.length);
    result.rows.forEach(row => {
      console.log('-', row.title, '(', row.category, ')');
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testCategory();