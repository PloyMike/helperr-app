const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Make mobile picker even smaller - 120 -> 100
content = content.replace(
  /scrollPickerWrapperMobile: \{ position: 'relative', width: 70, height: 120, overflow: 'hidden' \}/,
  `scrollPickerWrapperMobile: { position: 'relative', width: 70, height: 100, overflow: 'hidden' }`
);

// Make mobile spacer smaller - 40 -> 30
content = content.replace(
  /scrollSpacerMobile: \{ height: 40 \}/,
  `scrollSpacerMobile: { height: 30 }`
);

// Make mobile section padding smaller - 8 -> 6
content = content.replace(
  /timeSectionMobile: \{ background: '#f9fafb', borderRadius: 10, padding: 8, border: '2px solid #e5e7eb' \}/,
  `timeSectionMobile: { background: '#f9fafb', borderRadius: 8, padding: 6, border: '2px solid #e5e7eb' }`
);

// Make mobile label margin smaller - 6 -> 4
content = content.replace(
  /timeSectionLabelMobile: \{ fontSize: 11, fontWeight: 700, color: '#065f46', marginBottom: 6,/,
  `timeSectionLabelMobile: { fontSize: 10, fontWeight: 700, color: '#065f46', marginBottom: 4,`
);

// Make mobile container gap smaller - 6 -> 4
content = content.replace(
  /mobileTimeContainer: \{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 \}/,
  `mobileTimeContainer: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6 }`
);

// Make mobile preview smaller - 8 -> 6
content = content.replace(
  /timePreviewMobile: \{ background: 'linear-gradient\(135deg, #065f46 0%, #047857 100%\)', padding: 8, borderRadius: 10, marginBottom: 10,/,
  `timePreviewMobile: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: 6, borderRadius: 8, marginBottom: 8,`
);

// Make selectedInfo smaller on mobile
content = content.replace(
  /selectedInfo: \{ fontSize: 13, color: '#6b7280', marginBottom: 10, background: '#f9fafb', padding: 8,/,
  `selectedInfo: { fontSize: 12, color: '#6b7280', marginBottom: 8, background: '#f9fafb', padding: 6,`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Mobile ultra compact - no scrolling needed!');
