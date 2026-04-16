const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Remove Messages button from desktop header completely
const removeMessages = /<button onClick=\{\(\) => window\.navigateTo\('messages'\)\}[^>]*>\s*Messages\s*<\/button>\s*/s;

content = content.replace(removeMessages, '');

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 2: Messages removed from desktop header!');
