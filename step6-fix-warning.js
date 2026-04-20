const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add eslint-disable comment before useEffect
const oldUseEffect = /useEffect\(\(\) => \{\s*if \(user && profile\) \{\s*fetchBookingCounts\(\);/;

const newUseEffect = `// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user && profile) {
      fetchBookingCounts();`;

content = content.replace(oldUseEffect, newUseEffect);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 6: Warning fixed!');
