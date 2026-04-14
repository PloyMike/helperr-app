const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Make the green highlight box transparent
content = content.replace(
  /scrollPickerHighlight: \{[\s\S]*?background: '#ecfdf5',/,
  `scrollPickerHighlight: { 
    position: 'absolute', 
    top: '50%', 
    left: 0, 
    right: 0, 
    height: 40, 
    transform: 'translateY(-50%)', 
    background: 'rgba(236, 253, 245, 0.5)',`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Green highlight now transparent!');
