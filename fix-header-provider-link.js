const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add provider state
content = content.replace(
  /const \[showDropdown, setShowDropdown\] = useState\(false\);/,
  `const [showDropdown, setShowDropdown] = useState(false);
  const [hasProviderProfile, setHasProviderProfile] = useState(false);`
);

// Check for provider profile
content = content.replace(
  /if \(data\) setProfile\(data\);/,
  `if (data) {
        setProfile(data);
        setHasProviderProfile(!!data.id);
      }`
);

// Add Provider Bookings button after My Bookings
content = content.replace(
  /<button onClick=\{\(\) => window\.navigateTo\('bookings'\)\} style=\{styles\.navBtn\}>\s+My Bookings\s+<\/button>/,
  `<button onClick={() => window.navigateTo('bookings')} style={styles.navBtn}>
                My Bookings
              </button>
              {hasProviderProfile && (
                <button onClick={() => window.navigateTo('provider-bookings')} style={styles.navBtn}>
                  Provider Bookings
                </button>
              )}`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Provider Bookings link added to Header!');
