const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Update container max-width and add mobile padding
content = content.replace(
  /container: \{ maxWidth: 1400, margin: '0 auto', padding: '0 20px' \}/,
  `container: { maxWidth: 1400, margin: '0 auto', padding: '0 16px' }`
);

// Make hero title responsive
content = content.replace(
  /heroTitle: \{ color: '#fff', fontSize: 64, fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0\.02em' \}/,
  `heroTitle: { color: '#fff', fontSize: 'clamp(32px, 8vw, 64px)', fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }`
);

// Make hero subtitle responsive
content = content.replace(
  /heroSubtitle: \{ color: '#d1fae5', fontSize: 20, margin: 0 \}/,
  `heroSubtitle: { color: '#d1fae5', fontSize: 'clamp(14px, 4vw, 20px)', margin: 0 }`
);

// Make search input responsive
content = content.replace(
  /searchInput: \{ flex: 1, padding: '18px 24px', border: 'none', borderRadius: 16, fontSize: 16/,
  `searchInput: { flex: 1, padding: '16px 20px', border: 'none', borderRadius: 16, fontSize: 16`
);

// Make category buttons responsive with wrap
content = content.replace(
  /categories: \{ display: 'flex', gap: 12, marginTop: 32, overflowX: 'auto', paddingBottom: 8 \}/,
  `categories: { display: 'flex', gap: 8, marginTop: 24, overflowX: 'auto', paddingBottom: 8, WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }`
);

// Make category button smaller on mobile
content = content.replace(
  /categoryBtn: \{ padding: '14px 24px', background: 'white'/,
  `categoryBtn: { padding: '12px 20px', background: 'white'`
);

// Make profile cards responsive grid
content = content.replace(
  /profilesGrid: \{ display: 'grid', gridTemplateColumns: 'repeat\(auto-fill, minmax\(300px, 1fr\)\)', gap: 24, marginTop: 24 \}/,
  `profilesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 24 }`
);

// Make profile card images responsive
content = content.replace(
  /profileImage: \{ width: '100%', height: 240, objectFit: 'cover', borderRadius: '12px 12px 0 0' \}/,
  `profileImage: { width: '100%', height: 200, objectFit: 'cover', borderRadius: '12px 12px 0 0' }`
);

// Reduce profile card padding on mobile
content = content.replace(
  /profileInfo: \{ padding: 20 \}/,
  `profileInfo: { padding: 16 }`
);

// Make filter toggle buttons wrap better
content = content.replace(
  /filterToggle: \{ display: 'flex', gap: 12, marginBottom: 24 \}/,
  `filterToggle: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }`
);

// Make distance row title smaller on mobile
content = content.replace(
  /distanceTitle: \{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 16 \}/,
  `distanceTitle: { fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 12 }`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Homepage mobile optimized!');
