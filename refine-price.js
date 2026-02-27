const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Update price-amount - kleiner & leichter
content = content.replace(
  /\.price-amount \{\s*font-size: 48px;\s*font-weight: 900;[\s\S]*?filter: drop-shadow\(0 2px 4px rgba\(20, 184, 166, 0\.2\)\);\s*\}/,
  `.price-amount {
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 50%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: "Outfit", sans-serif;
          letter-spacing: -1px;
          margin-bottom: 24px;
        }`
);

// Mobile version
content = content.replace(
  /\.price-amount \{\s*font-size: 36px !important;\s*text-align: center !important;\s*letter-spacing: -1\.5px !important;\s*\}/,
  `.price-amount {
            font-size: 28px !important;
            text-align: center !important;
            letter-spacing: -0.5px !important;
          }`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Price refined!');
