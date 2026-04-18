const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// Remove all emojis
content = content.replace(/alert\('✅ Review submitted successfully!'\);/g, `alert('Review submitted successfully!');`);
content = content.replace(/<div style=\{\{ fontSize: 48 \}\}>📅<\/div>/g, '');
content = content.replace(/<div style=\{\{ fontSize: 64 \}\}>📭<\/div>/g, '');
content = content.replace(/\|\| '👤'/g, `|| 'U'`);
content = content.replace(/<span style=\{styles\.infoIcon\}>📅<\/span>/g, '');
content = content.replace(/<span style=\{styles\.infoIcon\}>🕐<\/span>/g, '');
content = content.replace(/<span style=\{styles\.infoIcon\}>📍<\/span>/g, '');
content = content.replace(/<span style=\{styles\.infoIcon\}>📧<\/span>/g, '');
content = content.replace(/<span style=\{styles\.infoIcon\}>💰<\/span>/g, '');

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ All emojis removed from My Bookings page!');
