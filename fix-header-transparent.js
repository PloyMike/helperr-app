const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Make sure Header has transparent={true}
content = content.replace(
  /<Header \/>/,
  '<Header transparent={true} />'
);

// If it already has transparent but no value
content = content.replace(
  /<Header transparent \/>/,
  '<Header transparent={true} />'
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Header transparency fixed!');
