const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Ändere 'confirmed' auf 'pending' in Zeile 80
content = content.replace(
  /status: 'confirmed'/g,
  "status: 'pending'"
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Booking status changed to pending!');
