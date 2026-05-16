const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Desktop: Mehr padding-top für login-prompt
content = content.replace(
  /\.login-prompt \{\s*padding-top: 140px;\s*text-align: center;\s*\}/,
  `.login-prompt {
          padding-top: 220px;
          text-align: center;
        }`
);

// Mobile: Mehr padding-top
content = content.replace(
  /\.login-prompt \{\s*padding-top: 100px !important;\s*\}/,
  `.login-prompt {
            padding-top: 160px !important;
          }`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Login button moved down!');
