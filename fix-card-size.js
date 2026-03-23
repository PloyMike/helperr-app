const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Größere Karten (320 -> 360, mehr Höhe)
content = content.replace(
  /card: \{ minWidth: 320, maxWidth: 320,/,
  'card: { minWidth: 360, maxWidth: 360,'
);

// Größeres Foto (52x52 -> 80x80)
content = content.replace(
  /cardAvatar: \{ width: 52, height: 52,/,
  'cardAvatar: { width: 80, height: 80,'
);

// Größere Emoji-Schrift im Placeholder
content = content.replace(
  /fontSize: 26, objectFit: 'cover'/,
  'fontSize: 40, objectFit: \'cover\''
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Cards and photos enlarged!');
