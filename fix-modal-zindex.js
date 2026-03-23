const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Ändere modalBackdrop z-index von 100 zu 1100
content = content.replace(
  /modalBackdrop: \{ position: 'fixed', inset: 0, background: 'rgba\(0,0,0,0\.5\)', zIndex: 100,/,
  "modalBackdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100,"
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Profile Modal z-index fixed!');
