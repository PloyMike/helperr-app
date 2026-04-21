const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Change marginLeft to textAlign right
content = content.replace(
  /<div style=\{\{ marginTop: 4, marginLeft: 20 \}\}>\{address\.postalCode\} \{address\.city\}<\/div>/,
  `<div style={{ marginTop: 4, textAlign: 'right' }}>{address.postalCode} {address.city}</div>`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Second line now right-aligned!');
