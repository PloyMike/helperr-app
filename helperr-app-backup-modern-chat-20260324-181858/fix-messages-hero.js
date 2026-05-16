const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Entferne 💬 Emoji aus h1
content = content.replace(
  /<h1 className="hero-title">💬 Nachrichten<\/h1>/,
  '<h1 className="hero-title">Nachrichten</h1>'
);

// Füge text-align: center zu hero-content hinzu
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

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Messages hero fixed!');
