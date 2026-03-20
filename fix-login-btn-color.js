const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Ändere Login Button Background Farbe von #14B8A6 zu #065f46
content = content.replace(
  /background: isTransparent \? 'rgba\(255,255,255,0\.2\)' : '#14B8A6'/g,
  "background: isTransparent ? 'rgba(255,255,255,0.2)' : '#065f46'"
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Login button color updated to hero green!');
