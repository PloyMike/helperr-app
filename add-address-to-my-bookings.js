const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// Replace the provider city location with service address
const oldLocation = /\{true && booking\.provider\?\.city && \(\s*<div style=\{styles\.infoRow\}>\s*\s*<div>\s*<span style=\{styles\.infoLabel\}>Location<\/span>\s*<span style=\{styles\.infoValue\}>\{booking\.provider\.city\}<\/span>\s*<\/div>\s*<\/div>\s*\)\}/;

const newAddress = `{booking.service_address && (
                    <div style={styles.infoRow}>
                      
                      <div>
                        <span style={styles.infoLabel}>Service Address</span>
                        <span style={styles.infoValue}>
                          {booking.service_address}
                          {booking.address_notes && <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Note: {booking.address_notes}</div>}
                        </span>
                      </div>
                    </div>
                  )}`;

content = content.replace(oldLocation, newAddress);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ Service address added to My Bookings!');
