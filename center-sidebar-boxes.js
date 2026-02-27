const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Preis-Box zentrieren auf Mobile
content = content.replace(
  /\.price-box, \.detail-box \{\s*padding: 20px !important;\s*\}/,
  `.price-box, .detail-box {
            padding: 20px !important;
            text-align: center !important;
          }
          .price-label {
            text-align: center !important;
          }
          .price-amount {
            text-align: center !important;
          }
          .price-note {
            text-align: center !important;
          }
          .detail-tags {
            justify-content: center !important;
          }`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Sidebar boxes centered!');
