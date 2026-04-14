const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Change gradient background to white
content = content.replace(
  /elegantPicker: \{ background: 'linear-gradient\(135deg, #ecfdf5 0%, #f0fdf4 100%\)',/,
  `elegantPicker: { background: 'white',`
);

// Make timeDisplay smaller
content = content.replace(
  /timeDisplay: \{ fontSize: 32, fontWeight: 800,/,
  `timeDisplay: { fontSize: 24, fontWeight: 800,`
);

// Make timeSeparator smaller
content = content.replace(
  /timeSeparator: \{ fontSize: 28, fontWeight: 700,/,
  `timeSeparator: { fontSize: 20, fontWeight: 700,`
);

// Make elegantPicker padding smaller
content = content.replace(
  /elegantPicker: \{ background: 'white', borderRadius: 12, padding: 16,/,
  `elegantPicker: { background: 'white', borderRadius: 12, padding: 12,`
);

// Make timeUnit gap smaller
content = content.replace(
  /timeUnit: \{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 \}/,
  `timeUnit: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }`
);

// Make arrowBtn smaller
content = content.replace(
  /arrowBtn: \{ background: 'white', border: '1\.5px solid #d1fae5', borderRadius: 6, width: 32, height: 32,/,
  `arrowBtn: { background: 'white', border: '1.5px solid #d1fae5', borderRadius: 6, width: 28, height: 28,`
);

// Make pickerLabel smaller
content = content.replace(
  /pickerLabel: \{ fontSize: 12, fontWeight: 700, color: '#065f46', marginBottom: 12,/,
  `pickerLabel: { fontSize: 11, fontWeight: 700, color: '#065f46', marginBottom: 8,`
);

// Make timeDisplay minWidth smaller
content = content.replace(
  /timeDisplay: \{ fontSize: 24, fontWeight: 800, color: '#065f46', minWidth: 50,/,
  `timeDisplay: { fontSize: 24, fontWeight: 800, color: '#065f46', minWidth: 45,`
);

// Make elegantPicker minWidth smaller
content = content.replace(
  /elegantPicker: \{ background: 'white', borderRadius: 12, padding: 12, border: '2px solid #d1fae5', minWidth: 200 \}/,
  `elegantPicker: { background: 'white', borderRadius: 12, padding: 12, border: '2px solid #d1fae5', minWidth: 160 }`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Made picker white and compact!');
