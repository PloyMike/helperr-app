const fs = require('fs');
let content = fs.readFileSync('src/Favorites.jsx', 'utf8');

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

// Falls es ein Emoji gibt (🤍), entferne es auch
content = content.replace(
  /<h1 className="hero-title">🤍 Meine Favoriten<\/h1>/,
  '<h1 className="hero-title">Meine Favoriten</h1>'
);

fs.writeFileSync('src/Favorites.jsx', content);
console.log('✅ Favorites hero centered!');
