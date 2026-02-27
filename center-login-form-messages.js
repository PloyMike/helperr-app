const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Füge padding zum login-prompt hinzu
content = content.replace(
  /\.login-prompt \{\s*min-height: calc\(100vh - 70px\);\s*display: flex;\s*align-items: center;\s*justify-content: center;\s*padding: 20px;\s*\}/,
  `.login-prompt {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }`
);

// Update login-form-container für bessere Zentrierung
content = content.replace(
  /\.login-form-container \{\s*background: white;\s*padding: 40px;\s*border-radius: 20px;\s*box-shadow: 0 8px 30px rgba\(0,0,0,0\.1\);\s*max-width: 400px;\s*width: 100%;\s*\}/,
  `.login-form-container {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
        }`
);

// Mobile: Zentriert halten
content = content.replace(
  /\.login-form-container \{\s*padding: 28px !important;\s*\}/,
  `.login-form-container {
            padding: 28px !important;
            margin: 0 auto !important;
          }`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Login form centered!');
