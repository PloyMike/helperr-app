const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Remove payment_status from insert
content = content.replace(
  /payment_status: 'paid',\s*/g,
  ''
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Removed payment_status from BookingCalendar!');
