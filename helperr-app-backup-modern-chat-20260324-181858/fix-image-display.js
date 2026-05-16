const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Ersetze die cardAvatar Zeile
content = content.replace(
  /<div style=\{styles\.cardAvatar\}>\{p\.image_url \|\| '👤'\}<\/div>/,
  `{p.image_url && p.image_url.startsWith('http') ? (
                    <img src={p.image_url} alt={p.name} style={{...styles.cardAvatar, fontSize: 'inherit', objectFit: 'cover'}} />
                  ) : (
                    <div style={styles.cardAvatar}>{p.image_url || '👤'}</div>
                  )}`
);

// Gleiches für Modal
content = content.replace(
  /<div style=\{\{ fontSize: 64 \}\}>\{selected\.image_url \|\| '👤'\}<\/div>/,
  `{selected.image_url && selected.image_url.startsWith('http') ? (
                <img src={selected.image_url} alt={selected.name} style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover' }} />
              ) : (
                <div style={{ fontSize: 64 }}>{selected.image_url || '👤'}</div>
              )}`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Image display fixed!');
