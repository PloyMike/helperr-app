const fs = require('fs');
let content = fs.readFileSync('src/RegisterPage.jsx', 'utf8');

// Remove id_status line
content = content.replace(/\s*id_status: 'pending',\s*\n/g, '\n');

fs.writeFileSync('src/RegisterPage.jsx', content);
console.log('✅ id_status removed from registration!');
