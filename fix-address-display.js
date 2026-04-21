const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find and replace the address display to show on 2 lines
const oldAddress = /<div style=\{styles\.summaryRow\}>\s*<span style=\{styles\.summaryLabel\}>Address:<\/span>\s*<span style=\{styles\.summaryValue\}>\{address\.street\} \{address\.houseNumber\}, \{address\.postalCode\} \{address\.city\}<\/span>\s*<\/div>/;

const newAddress = `<div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Address:</span>
                  <span style={styles.summaryValue}>
                    <div>{address.street} {address.houseNumber}</div>
                    <div style={{ marginTop: 4 }}>{address.postalCode} {address.city}</div>
                  </span>
                </div>`;

content = content.replace(oldAddress, newAddress);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Address now displays on 2 lines!');
