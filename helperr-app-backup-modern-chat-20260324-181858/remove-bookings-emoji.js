const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// Entferne 📋 Emoji aus h1
content = content.replace(
  /<h1 className="hero-title">📋 Meine Buchungen<\/h1>/,
  '<h1 className="hero-title">Meine Buchungen</h1>'
);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ Bookings emoji removed!');
