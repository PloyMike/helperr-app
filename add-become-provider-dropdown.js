const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add "Become a Provider" button in dropdown (only if no provider profile)
content = content.replace(
  /<button \s+onClick=\{\(\) => \{ setShowDropdown\(false\); window\.navigateTo\('edit-profile'\); \}\}\s+style=\{styles\.dropdownItem\}\s+>\s+Edit Profile\s+<\/button>/,
  `<button 
                      onClick={() => { setShowDropdown(false); window.navigateTo('edit-profile'); }}
                      style={styles.dropdownItem}
                    >
                      Edit Profile
                    </button>
                    {!hasProviderProfile && (
                      <button 
                        onClick={() => { setShowDropdown(false); window.navigateTo('register'); }}
                        style={styles.dropdownItem}
                      >
                        Become a Provider
                      </button>
                    )}`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Become a Provider added to dropdown!');
