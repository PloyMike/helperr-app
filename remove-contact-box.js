const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// Remove the entire Contact section
const contactSection = /<div style=\{styles\.section\}>\s*<h3 style=\{styles\.sectionTitle\}>📱 Contact<\/h3>\s*<div style=\{styles\.grid\}>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

content = content.replace(contactSection, '');

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Contact box removed!');
console.log('   - LINE ID field deleted');
console.log('   - Languages field deleted');
