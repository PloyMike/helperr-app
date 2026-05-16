const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Entferne das ✏️ Emoji - diesmal sicher
content = content.replace(
  />✏️ Profil bearbeiten</,
  '>Profil bearbeiten<'
);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Emoji removed!');
