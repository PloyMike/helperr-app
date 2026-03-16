const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Entferne Icons aus timeSlots
content = content.replace(
  /const timeSlots = \[[\s\S]*?\];/,
  `const timeSlots = [
    { value: '08:00', label: '08:00' },
    { value: '09:00', label: '09:00' },
    { value: '10:00', label: '10:00' },
    { value: '11:00', label: '11:00' },
    { value: '12:00', label: '12:00' },
    { value: '13:00', label: '13:00' },
    { value: '14:00', label: '14:00' },
    { value: '15:00', label: '15:00' },
    { value: '16:00', label: '16:00' },
    { value: '17:00', label: '17:00' },
    { value: '18:00', label: '18:00' },
    { value: '19:00', label: '19:00' },
    { value: '20:00', label: '20:00' }
  ];`
);

// Entferne das Icon-div Element
content = content.replace(
  /<div style=\{\{ fontSize: 32 \}\}>[\s\S]*?\{slot\.icon\}[\s\S]*?<\/div>/,
  ''
);

// Reduziere gap von 8 auf 0 (weil kein Icon mehr)
content = content.replace(
  /gap: 8,[\s\S]*?fontFamily: '"Outfit", sans-serif'/,
  `fontFamily: '"Outfit", sans-serif'`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Emojis entfernt - cleaner Look!');
