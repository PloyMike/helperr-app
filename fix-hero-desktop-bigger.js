const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Make desktop even bigger - 60px instead of 52px
content = content.replace(
  /fontSize: window\.innerWidth <= 768 \? 36 : 52,/,
  `fontSize: window.innerWidth <= 768 ? 36 : 60,`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Desktop hero text now bigger (60px)!');
