const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Find the DistanceRow function and update the card rendering
content = content.replace(
  /\{profiles\.map\(p => \(/,
  '{profiles.map((p, index) => ('
);

// Update the card style to include dynamic shadow based on index
content = content.replace(
  /<div key=\{p\.id\} onClick=\{\(\) => onSelect\(p\)\} style=\{styles\.card\}>/,
  `<div key={p.id} onClick={() => onSelect(p)} style={{
            ...styles.card,
            boxShadow: \`0 \${8 + (index % 3) * 4}px \${20 + (index % 3) * 8}px rgba(0, 0, 0, \${0.08 + (index % 3) * 0.02})\`
          }}>`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Individual card shadows added!');
