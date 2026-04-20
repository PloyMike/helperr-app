const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add position relative to My Bookings button and add badge
content = content.replace(
  /<button onClick=\{\(\) => window\.navigateTo\('bookings'\)\} style=\{\{\s*\.\.\.styles\.navBtn,\s*\.\.\.\(transparent \? styles\.navBtnTransparent : \{\}\)\s*\}\}>\s*My Bookings\s*<\/button>/,
  `<button onClick={() => window.navigateTo('bookings')} style={{
                    ...styles.navBtn,
                    ...(transparent ? styles.navBtnTransparent : {}),
                    position: 'relative'
                  }}>
                    My Bookings
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
                  </button>`
);

// Add position relative to Provider Bookings button and add badge
content = content.replace(
  /<button onClick=\{\(\) => window\.navigateTo\('provider-bookings'\)\} style=\{\{\s*\.\.\.styles\.navBtn,\s*\.\.\.\(transparent \? styles\.navBtnTransparent : \{\}\)\s*\}\}>\s*Provider Bookings\s*<\/button>/,
  `<button onClick={() => window.navigateTo('provider-bookings')} style={{
                      ...styles.navBtn,
                      ...(transparent ? styles.navBtnTransparent : {}),
                      position: 'relative'
                    }}>
                      Provider Bookings
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
                    </button>`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 3: Desktop badges added');
