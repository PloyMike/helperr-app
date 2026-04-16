const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add user ID to console log
const newLog = `console.log('🔍 User email:', user?.email);
      console.log('🔍 User ID:', user?.id);
      console.log('🔍 Searching for profile with user_id:', user?.id);`;

content = content.replace(
  /console\.log\('🔍 User:', user\?\.email\);/,
  newLog
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Added detailed user ID logging!');
