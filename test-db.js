import { migrateToDatabase } from '../src/lib/migration.js'

console.log('开始测试数据库功能...')

// 运行迁移
await migrateToDatabase()

console.log('测试完成！')
process.exit(0)
