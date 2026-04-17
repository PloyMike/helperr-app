const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Find the mobileMenuItems section and wrap it with user check
const oldMobileItems = /<div style=\{styles\.mobileMenuItems\}>\s*<button onClick=\{\(\) => \{ closeMobileMenu\(\); window\.navigateTo\('home'\); \}\}/;

const newMobileItems = `<div style={styles.mobileMenuItems}>
              {user ? (
                <>
                  <button onClick={() => { closeMobileMenu(); window.navigateTo('home'); }}`;

content = content.replace(oldMobileItems, newMobileItems);

// Find the logout button and close the user check
const oldLogoutBtn = /<button onClick=\{handleLogout\} style=\{styles\.mobileMenuLogout\}>\s*🚪 Logout\s*<\/button>\s*<\/div>/;

const newLogoutBtn = `<button onClick={handleLogout} style={styles.mobileMenuLogout}>
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

content = content.replace(oldLogoutBtn, newLogoutBtn);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Mobile menu now checks user state!');
