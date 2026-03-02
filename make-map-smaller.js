const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Füge max-height für Map hinzu
content = content.replace(
  /(<div id="map-section" style=\{\{marginTop:40\}\}>)/,
  `<div id="map-section" style={{marginTop:40,maxHeight:500,overflow:'hidden'}}>`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Map height limited!');
