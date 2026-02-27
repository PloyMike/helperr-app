const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Füge margin-top zur content-grid hinzu
content = content.replace(
  /\.content-grid \{\s*display: grid;\s*grid-template-columns: 1fr;\s*gap: 24px;\s*margin-bottom: 24px;\s*\}/,
  `.content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 24px;
          margin-top: 40px;
        }`
);

// Mobile auch anpassen
content = content.replace(
  /\.content-grid \{\s*grid-template-columns: 1fr !important;\s*gap: 16px !important;\s*\}/,
  `.content-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            margin-top: 30px !important;
          }`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Price section shifted down!');
