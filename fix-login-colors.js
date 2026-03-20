const fs = require('fs');
let content = fs.readFileSync('src/LoginPage.jsx', 'utf8');

// Ändere Button Background von türkis zu grün
content = content.replace(
  /background: 'linear-gradient\(135deg, #14B8A6 0%, #0D9488 100%\)'/g,
  "background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)'"
);

// Ändere Button Shadow von türkis zu grün
content = content.replace(
  /boxShadow: '0 4px 12px rgba\(20,184,166,0\.3\)'/g,
  "boxShadow: '0 4px 12px rgba(6,95,70,0.3)'"
);

// Ändere Link Farbe von türkis zu grün
content = content.replace(
  /color: '#14B8A6'/g,
  "color: '#065f46'"
);

fs.writeFileSync('src/LoginPage.jsx', content);
console.log('✅ Login page colors updated to hero green!');
