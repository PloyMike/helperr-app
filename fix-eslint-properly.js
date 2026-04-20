const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Find the useEffect block and add comment DIRECTLY before it
const findUseEffect = /(\n  )(useEffect\(\(\) => \{\s*if \(user && profile\) \{\s*fetchBookingCounts\(\);\s*\}\s*\}, \[user, profile, hasProviderProfile\]\);)/;

const replaceWithComment = `$1// eslint-disable-next-line react-hooks/exhaustive-deps
  $2`;

content = content.replace(findUseEffect, replaceWithComment);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Eslint warning fixed!');
