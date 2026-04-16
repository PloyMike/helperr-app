const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Find and replace the desktop navigation section
// Remove "My Bookings" and add "Become a Provider" (when NOT provider)

const oldDesktopNav = /(<button onClick=\{\(\) => window\.navigateTo\('messages'\)\}[^>]*>\s*Messages\s*<\/button>\s*)<button onClick=\{\(\) => window\.navigateTo\('bookings'\)\}[^>]*>\s*My Bookings\s*<\/button>/s;

const newDesktopNav = `$1{!hasProviderProfile && (
                    <button onClick={() => window.navigateTo('register')} style={{
                      ...styles.navBtn,
                     ...(transparent ? styles.navBtnTransparent : {})
                    }}>
                      Become a Provider
                    </button>
                  )}`;

content = content.replace(oldDesktopNav, newDesktopNav);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 1: Desktop header updated - My Bookings removed, Become a Provider added!');
