const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Remove emoji from Save Changes button
content = content.replace(/💾 Save Changes/g, 'Save Changes');

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Emoji removed from Save Changes button!');
