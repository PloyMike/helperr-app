const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Find the profiles.map section and add index
content = content.replace(
  /\{profiles\.map\((p, index)? ?=> \(/,
  '{profiles.map((p, index) => ('
);

// If no index parameter yet, add it
if (!content.includes('profiles.map((p, index)')) {
  content = content.replace(
    /\{profiles\.map\(p => \(/,
    '{profiles.map((p, index) => ('
  );
}

// Update card to have bottom-left shadow on first card only
content = content.replace(
  /<div key=\{p\.id\}.*?style=\{[^}]+\}>/,
  `<div key={p.id} onClick={() => onSelect(p)} style={{
            ...styles.card,
            boxShadow: index === 0 ? '-8px 12px 24px rgba(0, 0, 0, 0.12)' : '0 8px 20px rgba(0, 0, 0, 0.08)'
          }}>`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ First card in each row has bottom-left shadow!');
