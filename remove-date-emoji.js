const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Remove calendar emoji from selected date display
content = content.replace(/📅 \{formatDateFull/g, '{formatDateFull');

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Calendar emoji removed from time selection!');
