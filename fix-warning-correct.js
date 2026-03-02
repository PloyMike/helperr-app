const fs = require('fs');
let content = fs.readFileSync('src/ProviderDashboard.jsx', 'utf8');

// Entferne alte eslint Kommentare
content = content.replace(/\/\/ eslint-disable-next-line react-hooks\/exhaustive-deps\n?/g, '');

// Füge korrekt vor useEffect ein
content = content.replace(
  /(  useEffect\(\(\) => \{\s*\n\s*if \(user\))/,
  `  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (user)`
);

fs.writeFileSync('src/ProviderDashboard.jsx', content);
console.log('✅ Warning fixed correctly!');
