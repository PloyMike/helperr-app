const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Entferne Karte-Button aus Mobile Menu
content = content.replace(
  /<button onClick=\{\(\)=>\{const mapSection=document\.getElementById\('map-section'\);if\(mapSection\)mapSection\.scrollIntoView\(\{behavior:'smooth'\}\);setMobileMenuOpen\(false\);\}\} style=\{\{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba\(255,255,255,0\.1\)'\}\}>\s*Karte\s*<\/button>/,
  ''
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Map button removed from mobile menu!');
