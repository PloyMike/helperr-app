const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Remove bookedSlots state
content = content.replace(/const \[bookedSlots, setBookedSlots\] = useState\(\[\]\);\s*/g, '');

// Remove loadingSlots state
content = content.replace(/const \[loadingSlots, setLoadingSlots\] = useState\(false\);\s*/g, '');

// Remove timeSlots constant
content = content.replace(/const timeSlots = \[[\s\S]*?\];\s*/g, '');

console.log('✅ Removed unused variables');

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('Done!');
