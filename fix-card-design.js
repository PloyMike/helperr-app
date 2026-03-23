const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Ändere Row-Titel zu nur km-Angabe
content = content.replace(
  /title="📍 Nearby"\s*subtitle="Within 10 km"/,
  'title="0-10 km" subtitle=""'
);

content = content.replace(
  /title="🚗 Close"\s*subtitle="10-20 km away"/,
  'title="10-20 km" subtitle=""'
);

content = content.replace(
  /title="🛣️ Medium Distance"\s*subtitle="20-50 km away"/,
  'title="20-50 km" subtitle=""'
);

content = content.replace(
  /title="✈️ Far"\s*subtitle="50\+ km away"/,
  'title="50+ km" subtitle=""'
);

// Ändere Card-Styles zu kompaktem Design (Foto links)
content = content.replace(
  /sliderCard: \{ minWidth: 280, maxWidth: 280, background: 'white', borderRadius: 16, cursor: 'pointer', border: '1\.5px solid #e5e7eb', transition: 'all 0\.2s', boxShadow: '0 2px 8px rgba\(0,0,0,0\.04\)', overflow: 'hidden' \},/,
  `sliderCard: { minWidth: 320, maxWidth: 320, background: 'white', borderRadius: 16, cursor: 'pointer', border: '1.5px solid #e5e7eb', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 20 },`
);

content = content.replace(
  /cardImageWrap: \{ position: 'relative', width: '100%', height: 180, overflow: 'hidden' \},/,
  `cardImageWrap: { position: 'relative', width: 52, height: 52, overflow: 'hidden', borderRadius: 14, flexShrink: 0 },`
);

content = content.replace(
  /cardImage: \{ width: '100%', height: '100%', objectFit: 'cover' \},/,
  `cardImage: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 14 },`
);

content = content.replace(
  /cardImagePlaceholder: \{ width: '100%', height: '100%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 \},/,
  `cardImagePlaceholder: { width: '100%', height: '100%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, borderRadius: 14 },`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Fixed card design and titles!');
