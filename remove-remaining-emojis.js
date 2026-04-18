const fs = require('fs');
let content = fs.readFileSync('src/ProviderBookingsPage.jsx', 'utf8');

// Remove remaining emojis
content = content.replace(/<span style=\{styles\.infoIcon\}>🕐<\/span>/g, '');
content = content.replace(/<span style=\{styles\.infoIcon\}>📧<\/span>/g, '');
content = content.replace(/<div style=\{\{ fontSize: 64 \}\}>📭<\/div>/g, '');

fs.writeFileSync('src/ProviderBookingsPage.jsx', content);
console.log('✅ Remaining emojis removed!');
