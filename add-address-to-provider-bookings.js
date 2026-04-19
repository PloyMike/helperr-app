const fs = require('fs');
let content = fs.readFileSync('src/ProviderBookingsPage.jsx', 'utf8');

// Find the Contact infoRow and add Address infoRow before it
const oldContactRow = /(<div style=\{styles\.infoRow\}>\s*\s*<div>\s*<span style=\{styles\.infoLabel\}>Contact<\/span>)/;

const newAddressAndContact = `<div style={styles.infoRow}>
                    
                    <div>
                      <span style={styles.infoLabel}>Address</span>
                      <span style={styles.infoValue}>
                        {booking.service_address || 'No address provided'}
                        {booking.address_notes && <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Note: {booking.address_notes}</div>}
                      </span>
                    </div>
                  </div>

                  $1`;

content = content.replace(oldContactRow, newAddressAndContact);

fs.writeFileSync('src/ProviderBookingsPage.jsx', content);
console.log('✅ Step 2: Address added to Provider Bookings card!');
