const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// Remove viewMode state
content = content.replace(
  /const \[viewMode, setViewMode\] = useState\('customer'\);/,
  '// viewMode removed - customer only'
);

// Remove viewMode checks - replace with true/false
content = content.replace(
  /viewMode === 'customer'/g,
  'true'
);

content = content.replace(
  /viewMode !== 'customer'/g,
  'false'
);

// Remove the view toggle section from JSX
content = content.replace(
  /\{userProfile && \([\s\S]*?<\/div>\s+\)\}/,
  ''
);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ My Bookings cleaned up - customer only!');
