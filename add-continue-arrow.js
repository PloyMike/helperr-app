const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Simple replacement - just change "Continue" to "Continue →" in the address section
content = content.replace(
  /style=\{styles\.btnPrimary\}\s*>\s*Continue\s*<\/button>/,
  `style={styles.btnPrimary}
                >
                  Continue →
                </button>`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Continue arrow added!');
