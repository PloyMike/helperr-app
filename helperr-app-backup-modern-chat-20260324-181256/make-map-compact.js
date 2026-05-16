const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Ändere map-section zu max-width Container
content = content.replace(
  /<div id="map-section" style=\{\{marginTop:40,maxHeight:500,overflow:'hidden'\}\}>/,
  `<div id="map-section" style={{marginTop:40,maxWidth:1200,margin:'40px auto',padding:'0 20px'}}>`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Map made compact with max-width!');
