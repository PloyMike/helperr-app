const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Ändere Message Provider Button - übergebe Provider Email als Parameter
content = content.replace(
  /onClick=\{\(\) => window\.navigateTo\('messages'\)\}/,
  `onClick={() => window.navigateTo('messages?to=' + encodeURIComponent(selected.email))}`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Message button updated to pass provider email!');
