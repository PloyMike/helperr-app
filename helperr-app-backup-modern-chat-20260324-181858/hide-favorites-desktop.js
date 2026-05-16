const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Favoriten Button (mit dem Badge) nur für eingeloggte
// Suche nach dem kompletten Favoriten-Button mit Badge
content = content.replace(
  /(<button onClick=\{\(\)=>window\.navigateTo\('favorites'\)\} style=\{\{position:'relative',background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0\.2s'\}\}[^>]*>[\s\S]*?Favoriten[\s\S]*?<\/button>)/,
  '{user&&$1}'
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Favorites hidden for logged out users!');
