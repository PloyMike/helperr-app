const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add 'job' to the select query
content = content.replace(
  /\.select\('name, image_url, id'\)/,
  `.select('name, image_url, id, job')`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Job field added to query!');
