const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Entferne das ✏️ Emoji aus dem h1
content = content.replace(
  /<h1 style=\{[^}]+\}>✏️ Profil bearbeiten<\/h1>/,
  `<h1 style={{fontSize:48,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}}>Profil bearbeiten</h1>`
);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Emoji removed!');
