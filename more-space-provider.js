const fs = require('fs');
let content = fs.readFileSync('src/ProviderRegistration.jsx', 'utf8');

// Noch mehr Abstand nach subtitle
content = content.replace(
  /\.modal-subtitle \{\s*margin-bottom: 40px;/,
  `.modal-subtitle {
          margin-bottom: 50px;`
);

// Mobile auch mehr
content = content.replace(
  /\.modal-subtitle \{\s*font-size: 14px !important;\s*margin-bottom: 32px !important;\s*\}/,
  `.modal-subtitle {
            font-size: 14px !important;
            margin-bottom: 40px !important;
          }`
);

fs.writeFileSync('src/ProviderRegistration.jsx', content);
console.log('✅ More space added!');
