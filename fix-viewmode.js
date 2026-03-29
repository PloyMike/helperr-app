const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// Remove viewMode from useCallback dependencies
content = content.replace(
  /}, \[user, viewMode, userProfile, checkExistingReviews\]\);/,
  '}, [user, userProfile, checkExistingReviews]);'
);

// Remove any remaining viewMode checks in JSX
content = content.replace(
  /\{viewMode === 'customer' &&/g,
  '{true &&'
);

content = content.replace(
  /viewMode === 'customer'/g,
  'true'
);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ All viewMode references removed!');
