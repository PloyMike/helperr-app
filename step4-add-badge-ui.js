const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add badge to "My Bookings" in desktop menu
const oldMyBookings = /My Bookings\s*<\/button>/g;
const newMyBookings = `My Bookings
                    {myBookingsBadge > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: -4,
                        right: -8,
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: 18,
                        height: 18,
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {myBookingsBadge}
                      </span>
                    )}
                  </button>`;

content = content.replace(oldMyBookings, newMyBookings);

// Add badge to "Provider Bookings" in desktop menu
const oldProviderBookings = /Provider Bookings\s*<\/button>/g;
const newProviderBookings = `Provider Bookings
                      {providerBookingsBadge > 0 && (
                        <span style={{
                          position: 'absolute',
                          top: -4,
                          right: -8,
                          background: '#ef4444',
                          color: 'white',
                          borderRadius: '50%',
                          width: 18,
                          height: 18,
                          fontSize: 11,
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {providerBookingsBadge}
                        </span>
                      )}
                    </button>`;

content = content.replace(oldProviderBookings, newProviderBookings);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 4: Badge UI added to desktop menu!');
