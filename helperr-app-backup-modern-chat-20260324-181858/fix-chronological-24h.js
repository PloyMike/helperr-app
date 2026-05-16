const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Ersetze timeSlots mit chronologischer Reihenfolge
content = content.replace(
  /\/\/ VOLLER 24-STUNDEN-ZYKLUS[\s\S]*?const timeSlots = \[[\s\S]*?\];/,
  `// CHRONOLOGISCHER 24-STUNDEN-TAG - 00:00 BIS 23:00
  const timeSlots = [
    { value: '00:00', label: '00:00' },
    { value: '01:00', label: '01:00' },
    { value: '02:00', label: '02:00' },
    { value: '03:00', label: '03:00' },
    { value: '04:00', label: '04:00' },
    { value: '05:00', label: '05:00' },
    { value: '06:00', label: '06:00' },
    { value: '07:00', label: '07:00' },
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
    { value: '20:00', label: '20:00' },
    { value: '21:00', label: '21:00' },
    { value: '22:00', label: '22:00' },
    { value: '23:00', label: '23:00' }
  ];`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Chronologisch: 00:00 - 23:00 Uhr!');
