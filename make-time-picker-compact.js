const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Make scrollPickerWrapper smaller (160 -> 120)
content = content.replace(
  /scrollPickerWrapper: \{ position: 'relative', width: 70, height: 160, overflow: 'hidden' \}/,
  `scrollPickerWrapper: { position: 'relative', width: 70, height: 120, overflow: 'hidden' }`
);

// Make scrollSpacer smaller (60 -> 40)
content = content.replace(
  /scrollSpacer: \{ height: 60 \}/,
  `scrollSpacer: { height: 40 }`
);

// Make timeSection padding smaller (12 -> 8)
content = content.replace(
  /timeSection: \{ background: '#f9fafb', borderRadius: 12, padding: 12,/,
  `timeSection: { background: '#f9fafb', borderRadius: 10, padding: 8,`
);

// Make timeSectionLabel marginBottom smaller (10 -> 6)
content = content.replace(
  /timeSectionLabel: \{ fontSize: 11, fontWeight: 700, color: '#065f46', marginBottom: 10,/,
  `timeSectionLabel: { fontSize: 11, fontWeight: 700, color: '#065f46', marginBottom: 6,`
);

// Make timeSection marginBottom smaller (8 -> 6)
content = content.replace(
  /timeSection: \{ background: '#f9fafb', borderRadius: 10, padding: 8, marginBottom: 8,/,
  `timeSection: { background: '#f9fafb', borderRadius: 10, padding: 8, marginBottom: 6,`
);

// Make timeDivider padding smaller
content = content.replace(
  /timeDivider: \{ fontSize: 16, color: '#6b7280', fontWeight: 700, textAlign: 'center', padding: '4px 0' \}/,
  `timeDivider: { fontSize: 16, color: '#6b7280', fontWeight: 700, textAlign: 'center', padding: '2px 0' }`
);

// Make timePreview more compact
content = content.replace(
  /timePreview: \{ background: 'linear-gradient\(135deg, #065f46 0%, #047857 100%\)', padding: 10, borderRadius: 10, marginBottom: 12,/,
  `timePreview: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: 8, borderRadius: 10, marginBottom: 10,`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Time picker now compact - everything visible!');
