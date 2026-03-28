const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Replace the card div to use ID-based unique shadow
content = content.replace(
  /<div key=\{p\.id\} onClick=\{\(\) => onSelect\(p\)\} style=\{\{[\s\S]*?\}\}>/,
  `<div key={p.id} onClick={() => onSelect(p)} style={{
            ...styles.card,
            boxShadow: \`0 \${6 + (p.id?.charCodeAt(0) || 0) % 10}px \${16 + (p.id?.charCodeAt(1) || 0) % 16}px rgba(0, 0, 0, \${0.06 + ((p.id?.charCodeAt(2) || 0) % 5) * 0.01})\`
          }}>`
);

// If previous replacement didn't work, try simpler version
if (!content.includes('charCodeAt')) {
  content = content.replace(
    /<div key=\{p\.id\} onClick=\{\(\) => onSelect\(p\)\} style=\{styles\.card\}>/,
    `<div key={p.id} onClick={() => onSelect(p)} style={{
            ...styles.card,
            boxShadow: \`0 \${6 + (p.id?.charCodeAt(0) || 0) % 10}px \${16 + (p.id?.charCodeAt(1) || 0) % 16}px rgba(0, 0, 0, \${0.06 + ((p.id?.charCodeAt(2) || 0) % 5) * 0.01})\`
          }}>`
  );
}

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Unique shadows per card based on ID!');
