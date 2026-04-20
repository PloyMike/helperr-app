const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Find mobile menu buttons and add relative positioning + badges
// First, add position: relative to mobile menu buttons
const mobileButtonStyle = /onClick=\{\(\) => \{ setShowMobileMenu\(false\); window\.navigateTo\('my-bookings'\); \}\}\s*style=\{\{[^}]+\}\}/;

// This is complex, let me just add the badges to the mobile menu text
// Add badge after "My Bookings" in mobile menu
const mobileFindMyBookings = /(style=\{styles\.mobileMenuItem\}>)\s*My Bookings/;
const mobileNewMyBookings = `$1
                My Bookings
                {myBookingsBadge > 0 && (
                  <span style={{
                    marginLeft: 8,
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {myBookingsBadge}
                  </span>
                )}`;

content = content.replace(mobileFindMyBookings, mobileNewMyBookings);

// Add badge after "Provider Bookings" in mobile menu
const mobileFindProviderBookings = /(style=\{styles\.mobileMenuItem\}>)\s*Provider Bookings/;
const mobileNewProviderBookings = `$1
                  Provider Bookings
                  {providerBookingsBadge > 0 && (
                    <span style={{
                      marginLeft: 8,
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {providerBookingsBadge}
                    </span>
                  )}`;

content = content.replace(mobileFindProviderBookings, mobileNewProviderBookings);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 5: Badge UI added to mobile menu!');
