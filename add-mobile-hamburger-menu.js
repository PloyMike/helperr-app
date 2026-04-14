const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Add hamburger menu state after other states
const statePattern = /const \[showBooking, setShowBooking\] = useState\(false\);/;
content = content.replace(
  statePattern,
  `const [showBooking, setShowBooking] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);`
);

// Add hamburger button and menu in the header, before the title
const headerPattern = /<div style=\{styles\.header\}>\s*<h1 style=\{styles\.title\}>Helperr<\/h1>/;
content = content.replace(
  headerPattern,
  `<div style={styles.header}>
        <button onClick={() => setShowMobileMenu(true)} style={styles.hamburgerBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <h1 style={styles.title}>Helperr</h1>`
);

// Add mobile menu overlay before the closing div of main container
const closingPattern = /<\/div>\s*<\/div>\s*\);\s*}\s*const styles/;
content = content.replace(
  closingPattern,
  `</div>

      {showMobileMenu && (
        <div style={styles.mobileMenuOverlay} onClick={() => setShowMobileMenu(false)}>
          <div style={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div style={styles.mobileMenuHeader}>
              <h2 style={styles.mobileMenuTitle}>Menu</h2>
              <button onClick={() => setShowMobileMenu(false)} style={styles.mobileMenuClose}>×</button>
            </div>
            
            <div style={styles.mobileMenuItems}>
              <a href="/messages" style={styles.mobileMenuItem}>
                💬 Messages
              </a>
              <a href="/my-bookings" style={styles.mobileMenuItem}>
                📅 My Bookings
              </a>
              <a href="/edit-profile" style={styles.mobileMenuItem}>
                ✏️ Edit Profile
              </a>
              <a href="/become-provider" style={styles.mobileMenuItem}>
                ⭐ Become a Provider
              </a>
              <a href="/dashboard" style={styles.mobileMenuItem}>
                📊 Dashboard
              </a>
              <div style={styles.menuDivider}></div>
              <button onClick={() => { supabase.auth.signOut(); window.location.href = '/login'; }} style={styles.mobileMenuLogout}>
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles`
);

// Add styles for mobile menu
const stylesEnd = /header: \{[^}]*\},/;
content = content.replace(
  stylesEnd,
  `header: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: '16px 20px', position: 'sticky', top: 0, zIndex: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 16 },
  hamburgerBtn: { background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  mobileMenuOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex' },
  mobileMenu: { background: 'white', width: '80%', maxWidth: 320, height: '100%', boxShadow: '2px 0 12px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' },
  mobileMenuHeader: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  mobileMenuTitle: { margin: 0, fontSize: 22, fontWeight: 800, color: 'white' },
  mobileMenuClose: { background: 'transparent', border: 'none', color: 'white', fontSize: 32, fontWeight: 700, cursor: 'pointer', padding: 0, width: 32, height: 32 },
  mobileMenuItems: { padding: '12px 0', flex: 1, overflowY: 'auto' },
  mobileMenuItem: { display: 'block', padding: '16px 24px', fontSize: 16, fontWeight: 600, color: '#111827', textDecoration: 'none', borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s' },
  menuDivider: { height: 8, background: '#f9fafb', margin: '8px 0' },
  mobileMenuLogout: { display: 'block', width: '100%', padding: '16px 24px', fontSize: 16, fontWeight: 600, color: '#dc2626', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' },`
);

// Update header style to include flex
content = content.replace(
  /header: \{ background: 'linear-gradient\(135deg, #065f46 0%, #047857 100%\)', padding: '20px', position: 'sticky', top: 0, zIndex: 20, boxShadow: '0 2px 8px rgba\(0,0,0,0\.1\)' \},/g,
  ''
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Mobile hamburger menu added!');
