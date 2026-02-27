const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Entferne die ganze Stadt-Filter-Section
content = content.replace(
  /<div style=\{\{backgroundColor:'white',borderBottom:'1px solid #E5E7EB',padding:'24px 20px'\}\}>[\s\S]*?<\/div>\s*<\/div>/,
  ''
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ City filter removed!');
