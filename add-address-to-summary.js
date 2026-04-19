const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find the Time row and add Address row after it
const oldTimeRow = /(<div style=\{styles\.summaryRow\}>\s*<span style=\{styles\.summaryLabel\}>Time:<\/span>\s*<span style=\{styles\.summaryValue\}>\{selectedTimeSlot\}<\/span>\s*<\/div>)/;

const newTimeAndAddress = `$1
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Address:</span>
                  <span style={styles.summaryValue}>{address.street} {address.houseNumber}, {address.postalCode} {address.city}</span>
                </div>`;

content = content.replace(oldTimeRow, newTimeAndAddress);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Address added to booking summary!');
