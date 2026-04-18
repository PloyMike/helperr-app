const fs = require('fs');
let content = fs.readFileSync('src/ProviderBookingsPage.jsx', 'utf8');

// Remove emojis from various places
content = content.replace(/<div style=\{\{ fontSize: 48 \}\}>📅<\/div>/g, '');
content = content.replace(/\|\| '👤'/g, `|| 'U'`);
content = content.replace(/<span style=\{styles\.infoIcon\}>📅<\/span>/g, '');
content = content.replace(/<span style=\{styles\.infoIcon\}>💰<\/span>/g, '');
content = content.replace(/<span style=\{styles\.infoIcon\}>📍<\/span>/g, '');

fs.writeFileSync('src/ProviderBookingsPage.jsx', content);
console.log('✅ All emojis removed from Provider Bookings page!');
