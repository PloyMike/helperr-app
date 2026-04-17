const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Remove all console.log debug statements
content = content.replace(/console\.log\('🔍[^)]+\);?\s*/g, '');

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Debug logs removed!');
