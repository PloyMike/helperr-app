const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Mobile: VIEL mehr padding-top - wirklich in die Mitte!
content = content.replace(
  /\.login-prompt \{\s*padding-top: 180px !important;\s*\}/,
  `.login-prompt {
            padding-top: 300px !important;
          }`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Login prompt moved to center on mobile!');
