const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Entferne den ganzen Button-Div
content = content.replace(
  /<div style=\{\{textAlign:'center',marginBottom:24\}\}>\s*<button onClick=\{\(\)=>window\.navigateTo\('register'\)\}[\s\S]*?Starte als Anbieter<\/button>\s*<\/div>/,
  ''
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Anbieter button removed from hero!');
