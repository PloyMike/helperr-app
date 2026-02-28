const fs = require('fs');
let content = fs.readFileSync('src/LoginPage.jsx', 'utf8');

// Entferne 🔐 Emoji aus h1
content = content.replace(
  /<h1 className="hero-title">🔐 Login<\/h1>/,
  '<h1 className="hero-title">Login</h1>'
);

// Entferne ⏳ Emoji aus Button
content = content.replace(
  /\{loading \? '⏳ Lädt\.\.\.' : 'Einloggen'\}/,
  "{loading ? 'Lädt...' : 'Einloggen'}"
);

fs.writeFileSync('src/LoginPage.jsx', content);
console.log('✅ Login emojis removed!');
