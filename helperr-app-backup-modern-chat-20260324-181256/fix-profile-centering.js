const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Avatar Box kürzer (weniger padding auf Mobile)
content = content.replace(
  /\.avatar-box \{\s*width: 100% !important;\s*min-width: auto !important;\s*padding: 16px !important;\s*text-align: center !important;\s*\}/,
  `.avatar-box {
            width: 100% !important;
            min-width: auto !important;
            padding: 12px !important;
            text-align: center !important;
          }`
);

// About Box zentrieren
content = content.replace(
  /\.about-box \{\s*padding: 20px !important;\s*\}/,
  `.about-box {
            padding: 20px !important;
            text-align: center !important;
          }
          .about-text {
            text-align: center !important;
          }
          .stats {
            text-align: center !important;
          }`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Centering applied!');
