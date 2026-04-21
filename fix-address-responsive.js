const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Replace the address display with responsive version
const oldAddress = /<div style=\{styles\.summaryRow\}>\s*<span style=\{styles\.summaryLabel\}>Address:<\/span>\s*<span style=\{styles\.summaryValue\}>\s*<div>\{address\.street\} \{address\.houseNumber\}<\/div>\s*<div style=\{\{ marginTop: 4 \}\}>\{address\.postalCode\} \{address\.city\}<\/div>\s*<\/span>\s*<\/div>/;

const newAddress = `<div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Address:</span>
                  <span style={styles.summaryValue}>
                    {isMobile ? (
                      <>
                        <div>{address.street} {address.houseNumber}</div>
                        <div style={{ marginTop: 4, marginLeft: 20 }}>{address.postalCode} {address.city}</div>
                      </>
                    ) : (
                      <>{address.street} {address.houseNumber}, {address.postalCode} {address.city}</>
                    )}
                  </span>
                </div>`;

content = content.replace(oldAddress, newAddress);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Address now responsive - 1 line desktop, 2 lines mobile with indent!');
