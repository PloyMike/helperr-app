const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Remove emojis from confirm button again
content = content.replace(/⏳ Sending\.\.\./g, 'Sending...');
content = content.replace(/✅ Confirm Booking/g, 'Confirm Booking');

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Confirm Booking emojis removed again!');
