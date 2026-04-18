const fs = require('fs');
let content = fs.readFileSync('src/App.js', 'utf8');

// Change true to false
content = content.replace(
  'const MAINTENANCE_MODE = true;',
  'const MAINTENANCE_MODE = false;'
);

fs.writeFileSync('src/App.js', content);
console.log('✅ MAINTENANCE MODE OFF - Seite ist jetzt ONLINE!');
