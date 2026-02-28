const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// Füge textAlign: center zu hero-content hinzu
content = content.replace(
  /\.hero-content \{[^}]+\}/,
  `.hero-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          color: #1F2937;
          text-align: center;
        }`
);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ Hero title centered!');
