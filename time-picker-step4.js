const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find where to add new styles - after calendarDayDisabled
const stylesMatch = content.match(/calendarDayDisabled: \{ opacity: 0\.3, cursor: 'not-allowed', background: '#f9fafb' \},/);

if (stylesMatch) {
  const newStyles = `calendarDayDisabled: { opacity: 0.3, cursor: 'not-allowed', background: '#f9fafb' },
  timePickerContainer: { background: '#f9fafb', padding: 24, borderRadius: 16, marginBottom: 20, border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' },
  timePickerSection: { flex: 1, minWidth: 200 },
  timePickerLabel: { fontSize: 14, fontWeight: 700, color: '#065f46', marginBottom: 12, textAlign: 'center' },
  pickerRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  timePicker: { fontSize: 32, fontWeight: 700, padding: '12px 16px', border: '2px solid #065f46', borderRadius: 12, background: 'white', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', color: '#065f46', textAlign: 'center', minWidth: 80 },
  pickerColon: { fontSize: 32, fontWeight: 700, color: '#065f46' },
  timePickerArrow: { fontSize: 24, color: '#6b7280', display: 'flex', alignItems: 'center', padding: '0 8px' },
  errorBox: { background: '#fee2e2', color: '#dc2626', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 600, marginBottom: 16, textAlign: 'center' },
  timePreview: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: 20, borderRadius: 12, marginBottom: 20, textAlign: 'center' },
  timePreviewLabel: { fontSize: 12, color: '#d1fae5', fontWeight: 600, marginBottom: 8 },
  timePreviewValue: { fontSize: 24, color: 'white', fontWeight: 800 },`;
  
  content = content.replace(stylesMatch[0], newStyles);
  console.log('✅ Added time picker styles');
} else {
  console.log('❌ Could not find calendarDayDisabled style');
}

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('Done!');
