const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Desktop zurück auf 140px
content = content.replace(
  /\.login-prompt \{\s*padding-top: 220px;\s*text-align: center;\s*\}/,
  `.login-prompt {
          padding-top: 140px;
          text-align: center;
        }`
);

// Nur Mobile anpassen
content = content.replace(
  /\.login-prompt \{\s*padding-top: 160px !important;\s*\}/,
  `.login-prompt {
            padding-top: 180px !important;
          }`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Only mobile login button adjusted!');
