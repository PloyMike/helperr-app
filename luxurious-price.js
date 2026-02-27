const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Update price-amount mit luxuriösem Gradient-Style
content = content.replace(
  /\.price-amount \{\s*font-size: 42px;\s*font-weight: 800;\s*color: #1F2937;\s*font-family: "Outfit", sans-serif;\s*letter-spacing: -1px;\s*margin-bottom: 24px;\s*\}/,
  `.price-amount {
          font-size: 48px;
          font-weight: 900;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 50%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: "Outfit", sans-serif;
          letter-spacing: -2px;
          margin-bottom: 24px;
          text-shadow: 0 2px 10px rgba(20, 184, 166, 0.1);
          filter: drop-shadow(0 2px 4px rgba(20, 184, 166, 0.2));
        }`
);

// Mobile version auch updaten
content = content.replace(
  /\.price-amount \{\s*font-size: 32px !important;\s*text-align: center !important;\s*\}/,
  `.price-amount {
            font-size: 36px !important;
            text-align: center !important;
            letter-spacing: -1.5px !important;
          }`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Luxurious price styling applied!');
