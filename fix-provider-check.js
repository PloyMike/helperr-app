const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Fix the provider check - check for job field instead of just id
content = content.replace(
  /setHasProviderProfile\(!!data\.id\);/,
  `setHasProviderProfile(!!data.job);`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Provider check fixed - now checks for job field!');
