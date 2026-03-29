const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add provider bookings link after My Bookings
content = content.replace(
  /<button onClick=\{\(\) => window\.navigateTo\('bookings'\)\} style=\{styles\.navBtn\}>\s+My Bookings\s+<\/button>/,
  `<button onClick={() => window.navigateTo('bookings')} style={styles.navBtn}>
                My Bookings
              </button>
              {profile && (
                <button onClick={() => window.navigateTo('provider-bookings')} style={styles.navBtn}>
                  Provider Bookings
                </button>
              )}`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Header updated with Provider Bookings link!');
