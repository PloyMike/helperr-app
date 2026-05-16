const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Finde hero style und erhöhe padding-top
content = content.replace(
  /hero: \{ background: 'linear-gradient\(135deg, #065f46 0%, #047857 40%, #0f766e 100%\)', padding: '48px 20px 64px'/,
  "hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 100%)', padding: '100px 20px 64px'"
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Hero spacing fixed!');
