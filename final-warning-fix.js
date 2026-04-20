const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Find the exact useEffect line and add comment before it
content = content.replace(
  '  useEffect(() => {',
  '  // eslint-disable-next-line react-hooks/exhaustive-deps\n  useEffect(() => {'
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Warning comment added!');
