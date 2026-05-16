const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Avatar Box auf Mobile komplett ausblenden
content = content.replace(
  /\.avatar-box \{\s*width: 100% !important;\s*min-width: auto !important;\s*padding: 8px !important;\s*text-align: center !important;\s*\}/,
  `.avatar-box {
            background: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: auto !important;
            min-width: auto !important;
            text-align: center !important;
            margin: 0 auto 16px auto !important;
          }`
);

// Info Box - display block + margin auto für Zentrierung
content = content.replace(
  /\.info-box \{\s*padding: 16px !important;\s*text-align: center !important;\s*\}/,
  `.info-box {
            padding: 16px !important;
            text-align: center !important;
            display: block !important;
            margin: 0 auto !important;
            width: 100% !important;
          }`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Avatar box removed, info centered!');
