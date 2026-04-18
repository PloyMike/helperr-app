const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Remove emojis from all section titles
content = content.replace(/📸 Profile Image/g, 'Profile Image');
content = content.replace(/📍 Basic Info/g, 'Basic Info');
content = content.replace(/💼 Service/g, 'Service');
content = content.replace(/⏰ Availability/g, 'Availability');

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ All emojis removed from Edit Profile page!');
