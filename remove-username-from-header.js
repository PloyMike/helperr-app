const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Entferne den User-Name vor Logout (Desktop)
content = content.replace(
  /<span style=\{\{fontSize:14,fontWeight:600,color:'white',fontFamily:'"Outfit",sans-serif'\}\}>\{user\.user_metadata\?\.name \|\| user\.email\}<\/span>[\s\S]*?<button onClick=\{handleLogout\}/,
  '<button onClick={handleLogout}'
);

// Falls es noch einen Wrapper-div gibt, vereinfachen
content = content.replace(
  /<div style=\{\{display:'flex',alignItems:'center',gap:12\}\}>[\s\S]*?<button onClick=\{handleLogout\}/,
  '<button onClick={handleLogout}'
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Username removed from header!');
