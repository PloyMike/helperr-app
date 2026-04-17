const fs = require('fs');
let content = fs.readFileSync('src/App.js', 'utf8');

// Change false to true
content = content.replace(
  'const MAINTENANCE_MODE = false;',
  'const MAINTENANCE_MODE = true;'
);

fs.writeFileSync('src/App.js', content);
console.log('🔒 MAINTENANCE MODE ON - Seite ist jetzt OFFLINE!');
