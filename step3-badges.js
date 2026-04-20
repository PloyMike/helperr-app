const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add badge inline next to "My Bookings" - desktop
content = content.replace(
  /(<button onClick=\{\(\) => window\.navigateTo\('bookings'\)\}[\s\S]*?>)\s*(My Bookings)\s*(<\/button>)/,
  `$1
                    $2
                    {myBookingsBadge > 0 && (
                      <span style={{
                        marginLeft: 6,
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        minWidth: 18,
                        height: 18,
                        padding: '0 5px',
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {myBookingsBadge}
                      </span>
                    )}
                  $3`
);

// Add badge inline next to "Provider Bookings" - desktop
content = content.replace(
  /(<button onClick=\{\(\) => window\.navigateTo\('provider-bookings'\)\}[\s\S]*?>)\s*(Provider Bookings)\s*(<\/button>)/,
  `$1
                      $2
                      {providerBookingsBadge > 0 && (
                        <span style={{
                          marginLeft: 6,
                          background: '#ef4444',
                          color: 'white',
                          borderRadius: '50%',
                          minWidth: 18,
                          height: 18,
                          padding: '0 5px',
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {providerBookingsBadge}
                        </span>
                      )}
                    $3`
);

// Mobile - My Bookings
content = content.replace(
  /(<button onClick=\{\(\) => \{ closeMobileMenu\(\); window\.navigateTo\('bookings'\); \}\}[\s\S]*?>)\s*(My Bookings)\s*(<\/button>)/,
  `$1
              $2
              {myBookingsBadge > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  minWidth: 20,
                  height: 20,
                  padding: '0 6px',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {myBookingsBadge}
                </span>
              )}
            $3`
);

// Mobile - Provider Bookings
content = content.replace(
  /(<button onClick=\{\(\) => \{ closeMobileMenu\(\); window\.navigateTo\('provider-bookings'\); \}\}[\s\S]*?>)\s*(Provider Bookings)\s*(<\/button>)/,
  `$1
                $2
                {providerBookingsBadge > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    minWidth: 20,
                    height: 20,
                    padding: '0 6px',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {providerBookingsBadge}
                  </span>
                )}
              $3`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 3 done - Badges added inline!');
