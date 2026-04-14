const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Make timePickerContainer more compact and centered
content = content.replace(
  /timePickerContainer: \{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' \}/,
  `timePickerContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }`
);

// Make timeArrow smaller
content = content.replace(
  /timeArrow: \{ fontSize: 20, color: '#6b7280', fontWeight: 700 \}/,
  `timeArrow: { fontSize: 18, color: '#6b7280', fontWeight: 700, padding: '0 4px' }`
);

// Make elegantPicker even more compact on mobile
content = content.replace(
  /elegantPicker: \{ background: 'white', borderRadius: 12, padding: 12, border: '2px solid #d1fae5', minWidth: 160 \}/,
  `elegantPicker: { background: 'white', borderRadius: 10, padding: 10, border: '2px solid #d1fae5', width: '100%', maxWidth: 160 }`
);

// Make pickerControls gap smaller
content = content.replace(
  /pickerControls: \{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 \}/,
  `pickerControls: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }`
);

// Make timePreview more compact
content = content.replace(
  /timePreview: \{ background: 'linear-gradient\(135deg, #065f46 0%, #047857 100%\)', padding: 14, borderRadius: 12, marginBottom: 16, textAlign: 'center' \}/,
  `timePreview: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: 12, borderRadius: 10, marginBottom: 16, textAlign: 'center' }`
);

// Make timePreviewValue smaller
content = content.replace(
  /timePreviewValue: \{ fontSize: 20, color: 'white', fontWeight: 800 \}/,
  `timePreviewValue: { fontSize: 18, color: 'white', fontWeight: 800 }`
);

// Make selectedInfo more compact
content = content.replace(
  /selectedInfo: \{ fontSize: 13, color: '#6b7280', marginBottom: 16, background: '#f9fafb', padding: 10, borderRadius: 8, textAlign: 'center' \}/,
  `selectedInfo: { fontSize: 12, color: '#6b7280', marginBottom: 12, background: '#f9fafb', padding: 8, borderRadius: 8, textAlign: 'center' }`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Mobile time picker optimized!');
