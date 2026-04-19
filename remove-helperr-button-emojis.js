const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Remove emojis from button text
content = content.replace(/💬 Message Provider/g, 'Message Provider');
content = content.replace(/📅 Book Now/g, 'Book Now');

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Emojis removed from provider card buttons!');
