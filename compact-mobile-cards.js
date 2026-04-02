const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Make cards narrower and more compact
content = content.replace(
  /card: \{ minWidth: 380, maxWidth: 380, background: '#fff', borderRadius: 16, padding: 24,/,
  `card: { minWidth: 300, maxWidth: 300, background: '#fff', borderRadius: 16, padding: 16,`
);

// Find cardTop and make it more compact
content = content.replace(
  /cardTop: \{ display: 'flex', gap: 12, alignItems: 'flex-start' \}/,
  `cardTop: { display: 'flex', gap: 10, alignItems: 'flex-start' }`
);

// Make avatar smaller
content = content.replace(
  /cardAvatar: \{ width: 56, height: 56,/,
  `cardAvatar: { width: 48, height: 48,`
);

// Make card name smaller
content = content.replace(
  /cardName: \{ fontSize: 18, fontWeight: 700,/,
  `cardName: { fontSize: 16, fontWeight: 700,`
);

// Make price smaller
content = content.replace(
  /price: \{ fontSize: 18, fontWeight: 800,/,
  `price: { fontSize: 16, fontWeight: 800,`
);

// Make card bottom more compact
content = content.replace(
  /cardBottom: \{ marginTop: 16, paddingTop: 16,/,
  `cardBottom: { marginTop: 12, paddingTop: 12,`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Cards now compact for mobile!');
