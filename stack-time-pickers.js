const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Change timePickerContainer to column layout
content = content.replace(
  /timePickerContainer: \{ background: '#f9fafb', padding: 16, borderRadius: 12, marginBottom: 20, border: '2px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' \}/,
  `timePickerContainer: { background: '#f9fafb', padding: 16, borderRadius: 12, marginBottom: 20, border: '2px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 12 }`
);

// Change timePickerSection to full width
content = content.replace(
  /timePickerSection: \{ flex: 1, minWidth: 140 \}/,
  `timePickerSection: { width: '100%' }`
);

// Change arrow to vertical
content = content.replace(
  /timePickerArrow: \{ fontSize: 24, color: '#6b7280', display: 'flex', alignItems: 'center', padding: '0 8px' \}/,
  `timePickerArrow: { fontSize: 20, color: '#6b7280', textAlign: 'center', padding: '4px 0' }`
);

// Update the arrow in the JSX from → to ↓
content = content.replace(
  /<div style=\{styles\.timePickerArrow\}>→<\/div>/,
  `<div style={styles.timePickerArrow}>↓</div>`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Time pickers now stack vertically!');
