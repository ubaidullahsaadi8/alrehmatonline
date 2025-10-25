// Copy new page to replace old one
const fs = require('fs')
const path = require('path')

const sourcePath = path.join(__dirname, '..', 'app', 'teacher', 'courses', '[id]', 'students', '[studentId]', 'page-new.tsx')
const targetPath = path.join(__dirname, '..', 'app', 'teacher', 'courses', '[id]', 'students', '[studentId]', 'page.tsx')

try {
  console.log('Reading new page content...')
  const content = fs.readFileSync(sourcePath, 'utf8')
  
  console.log('Writing to page.tsx...')
  fs.writeFileSync(targetPath, content, 'utf8')
  
  console.log('✅ Successfully replaced page.tsx with new content')
  console.log('File size:', content.length, 'bytes')
} catch (error) {
  console.error('❌ Error:', error.message)
}
