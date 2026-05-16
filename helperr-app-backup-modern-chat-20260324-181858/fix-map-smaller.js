const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Entferne Emoji aus Titel
content = content.replace(
  /<h2 className="map-title">🗺️ Helfer auf der Karte<\/h2>/,
  '<h2 className="map-title">Helfer auf der Karte</h2>'
);

// Mache Karte schmaler
content = content.replace(
  /\.map-container \{\s*max-width: 800px;\s*margin: 0 auto;\s*\}/,
  `.map-container {
          max-width: 600px;
          margin: 0 auto;
        }`
);

// Mobile noch kleiner
content = content.replace(
  /\.map-container \{\s*max-width: 100% !important;\s*\}/,
  `.map-container {
            max-width: 95% !important;
            padding: 0 !important;
          }
          .map-title {
            font-size: 18px !important;
            margin-bottom: 16px !important;
          }`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Map smaller & emoji removed!');
