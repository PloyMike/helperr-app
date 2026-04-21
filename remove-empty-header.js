const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Remove empty sidebarHeader div
content = content.replace(
  /<div style=\{styles\.sidebarHeader\}>\s*\n\s*<\/div>/,
  ''
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Empty sidebar header removed!');
