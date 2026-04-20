const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Remove duplicate eslint comment
content = content.replace(
  '  // eslint-disable-next-line react-hooks/exhaustive-deps\n  // eslint-disable-next-line react-hooks/exhaustive-deps\n  useEffect',
  '  // eslint-disable-next-line react-hooks/exhaustive-deps\n  useEffect'
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Duplicate comment removed!');
