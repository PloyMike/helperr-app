const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Update customer_name to use auth metadata
content = content.replace(
  /customer_name: userProfile\?\.name \|\| 'Customer',/,
  `customer_name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'Customer',`
);

// Update the summary display to show auth name
content = content.replace(
  /<span style=\{styles\.summaryValue\}>\{userProfile\?\.name \|\| 'Not set'\}<\/span>/,
  `<span style={styles.summaryValue}>{user?.user_metadata?.name || user?.email?.split('@')[0] || 'Not set'}</span>`
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Customer name now uses auth data!');
