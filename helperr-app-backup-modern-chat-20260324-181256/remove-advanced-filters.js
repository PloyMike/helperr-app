const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Entferne AdvancedFilters Component
content = content.replace(
  /<div style=\{\{maxWidth:1200,margin:'30px auto',padding:'0 20px'\}\}>\s*<AdvancedFilters[\s\S]*?<\/div>/,
  ''
);

// Entferne auch den Import (optional, aber sauber)
content = content.replace(
  /import AdvancedFilters from '\.\/AdvancedFilters';\n/,
  ''
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Advanced filters removed!');
