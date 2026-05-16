const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Reduziere margin von profile-grid (weniger Abstand nach unten)
content = content.replace(
  /margin: 0 auto 80px;/,
  'margin: 0 auto 20px;'
);

// Reduziere padding von map-section
content = content.replace(
  /\.map-section \{\s*background-color: #F9FAFB;\s*padding: 40px 20px;\s*border-top: 1px solid #E5E7EB;\s*\}/,
  `.map-section {
          background-color: #F9FAFB;
          padding: 30px 20px;
          border-top: 1px solid #E5E7EB;
        }`
);

// Kleinere Karte auf Mobile
content = content.replace(
  /\.map-section \{\s*padding: 30px 16px;\s*\}/,
  `.map-section {
            padding: 20px 16px !important;
          }
          .map-container {
            max-width: 100% !important;
          }`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Map spacing fixed!');
