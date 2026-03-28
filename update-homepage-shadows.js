const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Update card shadow
content = content.replace(
  /card: \{ position: 'relative', minWidth: 380, maxWidth: 380, background: '#fff', borderRadius: 16, padding: 24, border: '1\.5px solid #e5e7eb', transition: 'all 0\.2s', boxShadow: '0 2px 8px rgba\(0,0,0,0\.04\)' \}/,
  "card: { position: 'relative', minWidth: 380, maxWidth: 380, background: '#fff', borderRadius: 16, padding: 24, border: '1.5px solid #e5e7eb', transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', cursor: 'pointer' }"
);

// Update modal shadow
content = content.replace(
  /modal: \{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', position: 'relative' \}/,
  "modal: { background: '#fff', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }"
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Homepage shadows updated!');
