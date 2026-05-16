const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Entferne Karte-Button aus Desktop Navigation
content = content.replace(
  /<button onClick=\{\(\)=>\{const mapSection=document\.getElementById\('map-section'\);if\(mapSection\)mapSection\.scrollIntoView\(\{behavior:'smooth'\}\);\}\} style=\{\{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0\.2s'\}\}[^>]*>[\s\S]*?Karte[\s\S]*?<\/button>/,
  ''
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Map button removed from desktop header!');
