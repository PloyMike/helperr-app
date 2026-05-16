const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Remove the result count paragraph
content = content.replace(
  /<p style=\{styles\.resultCount\}>[\s\S]*?<\/p>/,
  ''
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Result count removed!');
