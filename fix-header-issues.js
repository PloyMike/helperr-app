const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add Dashboard to dropdown menu - after profile button check
const oldDropdownMenu = /{showDropdown && \(\s*<div style=\{styles\.dropdownMenu\}>\s*\{hasProviderProfile \? \(\s*<button onClick=\{\(\) => \{ setShowDropdown\(false\); window\.navigateTo\('edit-profile'\); \}\} style=\{styles\.dropdownItem\}>\s*Edit Profile\s*<\/button>/;

const newDropdownMenu = `{showDropdown && (
                      <div style={styles.dropdownMenu}>
                        {hasProviderProfile && (
                          <>
                            <button onClick={() => { setShowDropdown(false); window.navigateTo('dashboard'); }} style={styles.dropdownItem}>
                              Dashboard
                            </button>
                            <button onClick={() => { setShowDropdown(false); window.navigateTo('edit-profile'); }} style={styles.dropdownItem}>
                              Edit Profile
                            </button>
                          </>
                        )}
                        {!hasProviderProfile && (
                          <button onClick={() => { setShowDropdown(false); window.navigateTo('register'); }} style={styles.dropdownItem}>
                            Become a Provider
                          </button>
                        )}
                        <button onClick={handleLogout} style={styles.dropdownItem}>
                          Logout
                        </button>
                      </div>
                    )}`;

// This is complex - let me just find and replace the whole dropdown section
content = content.replace(
  /{showDropdown && \(\s*<div style=\{styles\.dropdownMenu\}>[\s\S]*?<\/div>\s*\)\}/,
  `{showDropdown && (
                      <div style={styles.dropdownMenu}>
                        {hasProviderProfile && (
                          <>
                            <button onClick={() => { setShowDropdown(false); window.navigateTo('dashboard'); }} style={styles.dropdownItem}>
                              Dashboard
                            </button>
                            <button onClick={() => { setShowDropdown(false); window.navigateTo('edit-profile'); }} style={styles.dropdownItem}>
                              Edit Profile
                            </button>
                          </>
                        )}
                        {!hasProviderProfile && (
                          <button onClick={() => { setShowDropdown(false); window.navigateTo('register'); }} style={styles.dropdownItem}>
                            Become a Provider
                          </button>
                        )}
                        <button onClick={handleLogout} style={styles.dropdownItem}>
                          Logout
                        </button>
                      </div>
                    )}`
);

// Fix logo style - remove WebkitBackgroundClip which causes shadow effect
content = content.replace(
  /logoText: \{[\s\S]*?letterSpacing: '-0\.5px'\s*\}/,
  `logoText: {
    fontSize: 24,
    fontWeight: 800,
    color: '#065f46',
    letterSpacing: '-0.5px'
  }`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Dashboard added & Logo fixed!');
