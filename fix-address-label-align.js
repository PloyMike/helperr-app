const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find the address summaryRow and add alignItems: flex-start
content = content.replace(
  /<div style=\{styles\.summaryRow\}>\s*<span style=\{styles\.summaryLabel\}>Address:<\/span>/,
  `<div style={{...styles.summaryRow, alignItems: 'flex-start'}}>
                  <span style={styles.summaryLabel}>Address:</span>`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Address label now aligned to top!');
