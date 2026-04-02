const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Fix grid to show full cards on mobile
content = content.replace(
  /profilesGrid: \{ display: 'grid', gridTemplateColumns: 'repeat\(auto-fill, minmax\(280px, 1fr\)\)', gap: 16, marginTop: 24 \}/,
  `profilesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 16, marginTop: 24 }`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Mobile cards now full width!');
