const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Change "Continue to Confirm →" to just "Continue →"
content = content.replace(
  /Continue to Confirm →/g,
  'Continue →'
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Time page continue button simplified!');
