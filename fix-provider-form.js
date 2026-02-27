const fs = require('fs');
let content = fs.readFileSync('src/ProviderRegistration.jsx', 'utf8');

// Entferne Emoji aus Success-Message
content = content.replace(
  /<div className="success-icon">✅<\/div>/,
  ''
);

// Update modal-subtitle margin (mehr Abstand)
content = content.replace(
  /\.modal-subtitle \{\s*margin-bottom: 30px;/,
  `.modal-subtitle {
          margin-bottom: 40px;`
);

// Mobile auch updaten
content = content.replace(
  /\.modal-subtitle \{\s*font-size: 14px !important;\s*margin-bottom: 24px !important;\s*\}/,
  `.modal-subtitle {
            font-size: 14px !important;
            margin-bottom: 32px !important;
          }`
);

// Füge text-align: left für form-group hinzu
content = content.replace(
  /\.form-group \{\s*margin-bottom: 20px;\s*\}/,
  `.form-group {
          margin-bottom: 20px;
          text-align: left;
        }`
);

// Success-icon CSS entfernen
content = content.replace(
  /\.success-icon \{\s*font-size: 64px;\s*margin-bottom: 20px;\s*\}/,
  ''
);

// Mobile success-icon auch entfernen
content = content.replace(
  /\.success-icon \{\s*font-size: 48px !important;\s*\}/,
  ''
);

fs.writeFileSync('src/ProviderRegistration.jsx', content);
console.log('✅ Provider form updated!');
