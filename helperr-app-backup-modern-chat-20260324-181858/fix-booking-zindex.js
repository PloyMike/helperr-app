const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Ändere overlay z-index von 200 zu 1100 (höher als Header mit 1000)
content = content.replace(
  /overlay: \{ position: 'fixed', inset: 0, background: 'rgba\(0,0,0,0\.6\)', zIndex: 200,/,
  "overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100,"
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Booking Calendar z-index fixed!');
