const fs = require('fs');

let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Replace formatDateFull(new Date(selectedDate)) with formatDateFull(selectedDate)
content = content.replace(
  /formatDateFull\(new Date\(selectedDate\)\)/g,
  'formatDateFull(selectedDate)'
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Removed new Date() wrapper - passing string directly');
