const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Buchungen Button - mit {user&& ... } umschließen
content = content.replace(
  /(<button onClick=\{\(\)=>\{window\.navigateTo\('bookings'\);setMobileMenuOpen\(false\);\}\}[^>]+>[\s\S]*?Buchungen[\s\S]*?<\/button>)/,
  '{user&&$1}'
);

// Nachrichten Button - mit {user&& ... } umschließen
content = content.replace(
  /(<button onClick=\{\(\)=>\{window\.navigateTo\('messages'\);setMobileMenuOpen\(false\);\}\}[^>]+>[\s\S]*?Nachrichten[\s\S]*?<\/button>)/,
  '{user&&$1}'
);

// Favoriten Button - mit {user&& ... } umschließen
content = content.replace(
  /(<button onClick=\{\(\)=>\{window\.navigateTo\('favorites'\);setMobileMenuOpen\(false\);\}\}[^>]+>[\s\S]*?Favoriten[\s\S]*?<\/button>)/,
  '{user&&$1}'
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Menu items hidden for logged out users!');
