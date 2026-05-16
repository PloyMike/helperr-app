const fs = require('fs');
let content = fs.readFileSync('src/LoginPage.jsx', 'utf8');

// Update form-container margin - mehr Abstand nach oben
content = content.replace(
  /\.form-container \{\s*max-width: 500px;\s*margin: -40px auto 80px;\s*padding: 0 20px;\s*\}/,
  `.form-container {
          max-width: 500px;
          margin: -10px auto 80px;
          padding: 0 20px;
        }`
);

// Mobile auch anpassen
content = content.replace(
  /\.form-container \{\s*margin: -30px auto 60px !important;\s*padding: 0 16px !important;\s*\}/,
  `.form-container {
            margin: 0 auto 60px !important;
            padding: 0 16px !important;
          }`
);

fs.writeFileSync('src/LoginPage.jsx', content);
console.log('✅ Login form moved down!');
