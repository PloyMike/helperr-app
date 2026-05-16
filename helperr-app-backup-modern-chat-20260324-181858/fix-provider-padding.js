const fs = require('fs');
let content = fs.readFileSync('src/ProviderRegistration.jsx', 'utf8');

// Desktop: Mehr Padding in modal-content
content = content.replace(
  /\.modal-content \{\s*background-color: #fff;\s*border-radius: 16px;\s*padding: 40px;/,
  `.modal-content {
          background-color: #fff;
          border-radius: 16px;
          padding: 50px 45px;`
);

// Mobile: Mehr Padding
content = content.replace(
  /\.modal-content \{\s*max-width: 100% !important;\s*width: 100% !important;\s*max-height: 100vh !important;\s*height: 100vh !important;\s*border-radius: 0 !important;\s*padding: 24px 20px !important;\s*padding-top: 60px !important;\s*\}/,
  `.modal-content {
            max-width: 100% !important;
            width: 100% !important;
            max-height: 100vh !important;
            height: 100vh !important;
            border-radius: 0 !important;
            padding: 70px 24px 24px 24px !important;
          }`
);

// Mehr Abstand zwischen Label und Input
content = content.replace(
  /\.form-label \{\s*display: block;\s*margin-bottom: 8px;/,
  `.form-label {
          display: block;
          margin-bottom: 10px;`
);

// Mobile label margin auch
content = content.replace(
  /\.form-label \{\s*font-size: 14px !important;\s*margin-bottom: 6px !important;\s*\}/,
  `.form-label {
            font-size: 14px !important;
            margin-bottom: 8px !important;
          }`
);

// Mehr margin-bottom für form-group
content = content.replace(
  /\.form-group \{\s*margin-bottom: 20px;\s*text-align: left;\s*\}/,
  `.form-group {
          margin-bottom: 24px;
          text-align: left;
        }`
);

// Mobile form-group margin
content = content.replace(
  /\.form-group \{\s*margin-bottom: 16px !important;\s*\}/,
  `.form-group {
            margin-bottom: 20px !important;
          }`
);

fs.writeFileSync('src/ProviderRegistration.jsx', content);
console.log('✅ Padding and spacing improved!');
