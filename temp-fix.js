const fs = require('fs');
const content = fs.readFileSync('src/RegisterPage.jsx', 'utf8');
const fixed = content.replace(
  'setTimeout(() => {',
  'setTimeout(() => {\n        window.location.reload();'
).replace(
  'window.location = window.location.origin;',
  ''
);
fs.writeFileSync('src/RegisterPage.jsx', fixed);
console.log('✅ Fixed!');
