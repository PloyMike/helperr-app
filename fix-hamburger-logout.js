const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Change hamburger condition to always show on mobile
content = content.replace(
  /\{isMobile && user && \(/,
  `{isMobile && (`
);

// Update mobile menu to show login/signup when logged out
const mobileMenuItems = /<div style=\{styles\.mobileMenuItems\}>[\s\S]*?<\/div>/;

const newMobileMenuItems = `<div style={styles.mobileMenuItems}>
              {user ? (
                <>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('home'); }} style={styles.mobileMenuItem}>
                    🏠 Home
                  </button>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('messages'); }} style={styles.mobileMenuItem}>
                    💬 Messages
                  </button>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('bookings'); }} style={styles.mobileMenuItem}>
                    📅 My Bookings
                  </button>
                  {hasProviderProfile && (
                    <button onClick={() => { closeMobileMenu(); window.navigateTo('provider-bookings'); }} style={styles.mobileMenuItem}>
                      📊 Provider Bookings
                    </button>
                  )}
                  <div style={styles.menuDivider}></div>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('edit-profile'); }} style={styles.mobileMenuItem}>
                    ✏️ Edit Profile
                  </button>
                  {!hasProviderProfile && (
                    <button onClick={() => { closeMobileMenu(); window.navigateTo('register'); }} style={styles.mobileMenuItem}>
                      ⭐ Become a Provider
                    </button>
                  )}
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('dashboard'); }} style={styles.mobileMenuItem}>
                    📊 Dashboard
                  </button>
                  <div style={styles.menuDivider}></div>
                  <button onClick={handleLogout} style={styles.mobileMenuLogout}>
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('login'); }} style={styles.mobileMenuItem}>
                    🔑 Login
                  </button>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('signup'); }} style={styles.mobileMenuItem}>
                    ✨ Sign Up
                  </button>
                </>
              )}
            </div>`;

content = content.replace(mobileMenuItems, newMobileMenuItems);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Hamburger now shows even when logged out!');
