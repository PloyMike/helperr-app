const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add 'job' to select query
content = content.replace(
  /\.select\('name, image_url, id'\)/,
  `.select('name, image_url, id, job')`
);

// Fix hasProviderProfile logic
content = content.replace(
  /setHasProviderProfile\(!!data\.id\);/,
  `setHasProviderProfile(!!data.job);`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Provider logic fixed!');
