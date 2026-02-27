const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Info Box schmaler + box-sizing
content = content.replace(
  /\.info-box \{\s*padding: 16px !important;\s*text-align: center !important;\s*display: block !important;\s*margin: 0 auto !important;\s*width: 100% !important;\s*\}/,
  `.info-box {
            padding: 16px 12px !important;
            text-align: center !important;
            display: block !important;
            margin: 0 auto !important;
            width: calc(100% - 32px) !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Info box width fixed!');
