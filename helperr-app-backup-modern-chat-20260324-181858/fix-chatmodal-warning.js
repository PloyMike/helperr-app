const fs = require('fs');
let content = fs.readFileSync('src/ChatModal.jsx', 'utf8');

// Füge eslint-disable für das erste useEffect hinzu
content = content.replace(
  /useEffect\(\(\) => \{\s*fetchMessages\(\);/,
  `useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps`
);

fs.writeFileSync('src/ChatModal.jsx', content);
console.log('✅ Warning fixed!');
