const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Make timePicker smaller
content = content.replace(
  /timePicker: \{ fontSize: 32, fontWeight: 700, padding: '12px 16px',/,
  `timePicker: { fontSize: 24, fontWeight: 700, padding: '8px 12px',`
);

// Make pickerColon smaller
content = content.replace(
  /pickerColon: \{ fontSize: 32, fontWeight: 700, color: '#065f46' \}/,
  `pickerColon: { fontSize: 24, fontWeight: 700, color: '#065f46' }`
);

// Make timePickerContainer more compact
content = content.replace(
  /timePickerContainer: \{ background: '#f9fafb', padding: 24, borderRadius: 16,/,
  `timePickerContainer: { background: '#f9fafb', padding: 16, borderRadius: 12,`
);

// Make timePickerSection smaller minWidth
content = content.replace(
  /timePickerSection: \{ flex: 1, minWidth: 200 \}/,
  `timePickerSection: { flex: 1, minWidth: 140 }`
);

// Make timePicker minWidth smaller
content = content.replace(
  /minWidth: 80 \}/,
  `minWidth: 60 }`
);

// Make timePreview more compact
content = content.replace(
  /timePreview: \{ background: 'linear-gradient\(135deg, #065f46 0%, #047857 100%\)', padding: 20,/,
  `timePreview: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: 16,`
);

// Make timePreviewValue smaller
content = content.replace(
  /timePreviewValue: \{ fontSize: 24, color: 'white', fontWeight: 800 \}/,
  `timePreviewValue: { fontSize: 20, color: 'white', fontWeight: 800 }`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Time picker made more compact for mobile!');
