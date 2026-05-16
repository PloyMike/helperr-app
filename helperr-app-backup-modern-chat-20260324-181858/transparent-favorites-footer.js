const fs = require('fs');
let content = fs.readFileSync('src/Favorites.jsx', 'utf8');

// Update favorites-footer CSS - transparent background
content = content.replace(
  /\.favorites-footer \{\s*display: flex;\s*justify-content: space-between;\s*align-items: center;\s*background-color: white;\s*padding: 24px;\s*border-radius: 20px;\s*box-shadow: 0 4px 20px rgba\(0,0,0,0\.08\);\s*\}/,
  `.favorites-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          padding: 24px 0;
        }`
);

fs.writeFileSync('src/Favorites.jsx', content);
console.log('✅ Favorites footer transparent!');
