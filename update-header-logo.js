const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Replace the leaf emoji with handshake
content = content.replace(
  '<span style={{ fontSize: 32 }}>🌿</span>',
  '<span style={{ fontSize: 32 }}>🤝</span>'
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Header logo updated to handshake!');
