const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Modal even smaller
content = content.replace(
  /modal: \{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', margin: '0 8px' \}/,
  `modal: { background: 'white', borderRadius: 16, width: '100%', maxWidth: 700, maxHeight: '88vh', overflowY: 'auto', margin: '0 8px' }`
);

// Header ultra compact
content = content.replace(
  /header: \{ background: 'linear-gradient\(135deg, #065f46 0%, #047857 100%\)', padding: '20px 16px',/,
  `header: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: '12px 12px',`
);

// Progress ultra compact
content = content.replace(
  /progress: \{ display: 'flex', alignItems: 'center', padding: '16px',/,
  `progress: { display: 'flex', alignItems: 'center', padding: '10px 12px',`
);

// Body ultra compact
content = content.replace(
  /body: \{ padding: '16px 12px' \}/,
  `body: { padding: '12px 10px' }`
);

// StepTitle smaller
content = content.replace(
  /stepTitle: \{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 12 \}/,
  `stepTitle: { fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }`
);

// Calendar header compact
content = content.replace(
  /calendarHeader: \{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '12px 16px',/,
  `calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '8px 12px',`
);

// Month grid gaps smaller
content = content.replace(
  /monthGrid: \{ display: 'grid', gridTemplateColumns: 'repeat\(7, 1fr\)', gap: 6, marginBottom: 20 \}/,
  `monthGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 12 }`
);

// Calendar day smaller
content = content.replace(
  /calendarDay: \{ padding: '10px 8px', border: '2px solid #e5e7eb',/,
  `calendarDay: { padding: '8px 6px', border: '1.5px solid #e5e7eb',`
);

// Time picker container ultra compact
content = content.replace(
  /timePickerContainer: \{ background: '#f9fafb', padding: 12, borderRadius: 12, marginBottom: 20,/,
  `timePickerContainer: { background: '#f9fafb', padding: 10, borderRadius: 10, marginBottom: 12,`
);

// Time picker ultra small
content = content.replace(
  /timePicker: \{ fontSize: 20, fontWeight: 700, padding: '6px 10px',/,
  `timePicker: { fontSize: 18, fontWeight: 700, padding: '5px 8px',`
);

// Picker colon smaller
content = content.replace(
  /pickerColon: \{ fontSize: 20, fontWeight: 700, color: '#065f46' \}/,
  `pickerColon: { fontSize: 18, fontWeight: 700, color: '#065f46' }`
);

// Error box compact
content = content.replace(
  /errorBox: \{ background: '#fee2e2', color: '#dc2626', padding: 10, borderRadius: 10, fontSize: 14, fontWeight: 600, marginBottom: 16,/,
  `errorBox: { background: '#fee2e2', color: '#dc2626', padding: 8, borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 10,`
);

// Time preview ultra compact
content = content.replace(
  /timePreview: \{ background: 'linear-gradient\(135deg, #065f46 0%, #047857 100%\)', padding: 12, borderRadius: 12, marginBottom: 16,/,
  `timePreview: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: 10, borderRadius: 10, marginBottom: 12,`
);

// Time preview value smaller
content = content.replace(
  /timePreviewValue: \{ fontSize: 18, color: 'white', fontWeight: 800 \}/,
  `timePreviewValue: { fontSize: 16, color: 'white', fontWeight: 800 }`
);

// Summary compact
content = content.replace(
  /summary: \{ background: '#f9fafb', padding: 20, borderRadius: 16, marginBottom: 20,/,
  `summary: { background: '#f9fafb', padding: 12, borderRadius: 12, marginBottom: 12,`
);

// Summary row compact
content = content.replace(
  /summaryRow: \{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 \}/,
  `summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }`
);

// Form group compact
content = content.replace(
  /formGroup: \{ marginBottom: 16 \}/,
  `formGroup: { marginBottom: 12 }`
);

// Input compact
content = content.replace(
  /input: \{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb',/,
  `input: { width: '100%', padding: '10px 12px', border: '2px solid #e5e7eb',`
);

// Textarea compact
content = content.replace(
  /textarea: \{ width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb',/,
  `textarea: { width: '100%', padding: '10px 12px', border: '2px solid #e5e7eb',`
);

// Buttons ultra compact
content = content.replace(
  /btnNext: \{ flex: 1, padding: '12px 16px',/,
  `btnNext: { flex: 1, padding: '10px 14px',`
);

content = content.replace(
  /btnBack: \{ padding: '12px 16px',/,
  `btnBack: { padding: '10px 14px',`
);

content = content.replace(
  /btnSubmit: \{ flex: 1, padding: '12px 16px',/,
  `btnSubmit: { flex: 1, padding: '10px 14px',`
);

// Selected info compact
content = content.replace(
  /selectedInfo: \{ fontSize: 14, color: '#6b7280', marginBottom: 16, background: '#f9fafb', padding: 12,/,
  `selectedInfo: { fontSize: 13, color: '#6b7280', marginBottom: 10, background: '#f9fafb', padding: 8,`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ ULTRA COMPACT MODE ACTIVATED!');
