const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Fix the useEffect dependencies
content = content.replace(
  /}, \[step\]\);/,
  `}, [step, startHour, startMinute, endHour, endMinute]);`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Fixed useEffect dependencies!');
