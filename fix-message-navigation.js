const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Ändere onClick zu localStorage + navigate
content = content.replace(
  /onClick=\{\(\) => window\.navigateTo\('messages\?to=' \+ encodeURIComponent\(selected\.email\)\)\}/,
  `onClick={() => { localStorage.setItem('helperr_message_to', selected.email); window.navigateTo('messages'); }}`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Message button fixed with localStorage!');
