const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Finde den Message Provider Button und füge onClick hinzu
content = content.replace(
  /(style=\{\{[\s\S]*?fontFamily: '"Outfit", sans-serif'\s*\}\})\s*>\s*💬 Message Provider/,
  `onClick={() => window.navigateTo('messages?to=' + encodeURIComponent(selected.email))} 
                  $1
                >
                  💬 Message Provider`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ onClick added to Message Provider button!');
