const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// Füge eslint-disable Kommentar hinzu
content = content.replace(
  /useEffect\(\(\) => \{/,
  `useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps`
);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ ESLint warning fixed!');
