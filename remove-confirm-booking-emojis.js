const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Remove emojis from button text
content = content.replace(/⏳ Sending\.\.\./g, 'Sending...');
content = content.replace(/✅ Confirm Booking/g, 'Confirm Booking');

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Emojis removed from Confirm Booking button!');
