const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Find the profile card div and add onClick
content = content.replace(
  /style=\{\{[\s\S]*?backgroundColor: 'white',[\s\S]*?cursor: 'pointer'[\s\S]*?\}\}/,
  (match) => {
    // Add onClick before the style
    return `onClick={() => window.navigateTo('profile', profile)}
            ${match}`;
  }
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Helperr.jsx updated with onClick!');
