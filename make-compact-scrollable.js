const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Make modal more compact with scroll
content = content.replace(
  /modal: \{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '95vh', overflowY: 'auto', margin: '0 12px' \}/,
  `modal: { background: 'white', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', margin: '0 8px' }`
);

// Make body padding smaller
content = content.replace(
  /body: \{ padding: '20px 16px' \}/,
  `body: { padding: '16px 12px' }`
);

// Make stepTitle smaller
content = content.replace(
  /stepTitle: \{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 16 \}/,
  `stepTitle: { fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 12 }`
);

// Make timePickerContainer even more compact
content = content.replace(
  /timePickerContainer: \{ background: '#f9fafb', padding: 16, borderRadius: 12,/,
  `timePickerContainer: { background: '#f9fafb', padding: 12, borderRadius: 12,`
);

// Make timePickerLabel smaller
content = content.replace(
  /timePickerLabel: \{ fontSize: 14, fontWeight: 700, color: '#065f46', marginBottom: 12, textAlign: 'center' \}/,
  `timePickerLabel: { fontSize: 13, fontWeight: 700, color: '#065f46', marginBottom: 8, textAlign: 'center' }`
);

// Make timePicker even smaller
content = content.replace(
  /timePicker: \{ fontSize: 24, fontWeight: 700, padding: '8px 12px',/,
  `timePicker: { fontSize: 20, fontWeight: 700, padding: '6px 10px',`
);

// Make pickerColon smaller
content = content.replace(
  /pickerColon: \{ fontSize: 24, fontWeight: 700, color: '#065f46' \}/,
  `pickerColon: { fontSize: 20, fontWeight: 700, color: '#065f46' }`
);

// Make pickerRow gap smaller
content = content.replace(
  /pickerRow: \{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 \}/,
  `pickerRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }`
);

// Make errorBox more compact
content = content.replace(
  /errorBox: \{ background: '#fee2e2', color: '#dc2626', padding: 12, borderRadius: 10,/,
  `errorBox: { background: '#fee2e2', color: '#dc2626', padding: 10, borderRadius: 10,`
);

// Make timePreview more compact
content = content.replace(
  /timePreview: \{ background: 'linear-gradient\(135deg, #065f46 0%, #047857 100%\)', padding: 16, borderRadius: 12, marginBottom: 20, textAlign: 'center' \}/,
  `timePreview: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: 12, borderRadius: 12, marginBottom: 16, textAlign: 'center' }`
);

// Make timePreviewValue even smaller
content = content.replace(
  /timePreviewValue: \{ fontSize: 20, color: 'white', fontWeight: 800 \}/,
  `timePreviewValue: { fontSize: 18, color: 'white', fontWeight: 800 }`
);

// Make buttons more compact
content = content.replace(
  /btnNext: \{ flex: 1, padding: '14px 20px',/,
  `btnNext: { flex: 1, padding: '12px 16px',`
);

content = content.replace(
  /btnBack: \{ padding: '14px 20px',/,
  `btnBack: { padding: '12px 16px',`
);

content = content.replace(
  /btnSubmit: \{ flex: 1, padding: '14px 20px',/,
  `btnSubmit: { flex: 1, padding: '12px 16px',`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Modal is now compact with scroll!');
