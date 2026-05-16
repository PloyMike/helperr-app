const fs = require('fs');
let content = fs.readFileSync('src/EditProfilePage.jsx', 'utf8');

// useCallback für fetchProfile hinzufügen
content = content.replace(
  /const fetchProfile = async \(\) => \{/,
  `const fetchProfile = React.useCallback(async () => {`
);

// Schließende Klammer anpassen
content = content.replace(
  /(finally \{\s*setLoading\(false\);\s*\}\s*\};)/,
  `$1, [user]);`
);

// useEffect dependency array anpassen
content = content.replace(
  /\}, \[user\]\);/,
  `}, [user, fetchProfile]);`
);

fs.writeFileSync('src/EditProfilePage.jsx', content);
console.log('✅ Warning fixed!');
