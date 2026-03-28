const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Find and replace the hero gradient to match exactly
content = content.replace(
  /hero: \{ background: 'linear-gradient\([^']+\)'/,
  "hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)'"
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Hero gradient synchronized!');
