const fs = require('fs');
let content = fs.readFileSync('src/RegisterPage.jsx', 'utf8');

// Button Gradient ändern zu Header-Farbe (Türkis)
content = content.replace(
  /\.submit-btn \{ width: 100%; padding: 18px; background: linear-gradient\(135deg, #F97316 0%, #EA580C 100%\);/,
  `.submit-btn { width: 100%; padding: 18px; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);`
);

// Box-shadow auch türkis
content = content.replace(
  /box-shadow: 0 8px 25px rgba\(249,115,22,0\.4\);/,
  `box-shadow: 0 8px 25px rgba(20,184,166,0.4);`
);

// Hover box-shadow türkis
content = content.replace(
  /box-shadow: 0 12px 35px rgba\(249,115,22,0\.5\);/,
  `box-shadow: 0 12px 35px rgba(20,184,166,0.5);`
);

fs.writeFileSync('src/RegisterPage.jsx', content);
console.log('✅ Button color changed to header color!');
