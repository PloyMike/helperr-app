const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Desktop: Entferne den <span> mit user.user_metadata
content = content.replace(
  /<span style=\{\{fontSize:14,fontWeight:600,color:'white',fontFamily:'"Outfit",sans-serif'\}\}>\{user\.user_metadata\?\.name \|\| user\.email\}<\/span>/g,
  ''
);

// Mobile: Entferne {user.user_metadata?.name || user.email}
content = content.replace(
  /\{user\.user_metadata\?\.name \|\| user\.email\}/g,
  ''
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Username removed from both desktop and mobile!');
