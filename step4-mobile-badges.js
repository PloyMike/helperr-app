const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Find My Bookings in mobile menu and add badge
content = content.replace(
  /<button onClick=\{\(\) => \{ closeMobileMenu\(\); window\.navigateTo\('bookings'\); \}\} style=\{styles\.mobileMenuItem\}>\s*My Bookings\s*<\/button>/,
  `<button onClick={() => { closeMobileMenu(); window.navigateTo('bookings'); }} style={styles.mobileMenuItem}>
              My Bookings
              {myBookingsBadge > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {myBookingsBadge}
                </span>
              )}
            </button>`
);

// Find Provider Bookings in mobile menu and add badge
content = content.replace(
  /<button onClick=\{\(\) => \{ closeMobileMenu\(\); window\.navigateTo\('provider-bookings'\); \}\} style=\{styles\.mobileMenuItem\}>\s*Provider Bookings\s*<\/button>/,
  `<button onClick={() => { closeMobileMenu(); window.navigateTo('provider-bookings'); }} style={styles.mobileMenuItem}>
                Provider Bookings
                {providerBookingsBadge > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {providerBookingsBadge}
                  </span>
                )}
              </button>`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 4: Mobile badges added - COMPLETE!');
