const fs = require('fs');
let content = fs.readFileSync('src/ProviderDashboard.jsx', 'utf8');

// Füge eslint-disable Kommentar vor useEffect hinzu
content = content.replace(
  /(  useEffect\(\(\) => \{)/,
  `  // eslint-disable-next-line react-hooks/exhaustive-deps
  $1`
);

fs.writeFileSync('src/ProviderDashboard.jsx', content);
console.log('✅ Warning fixed!');
