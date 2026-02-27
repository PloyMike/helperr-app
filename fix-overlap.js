const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Change margin from -100px to -60px (less overlap)
content = content.replace(
  "margin:'-100px auto 60px'",
  "margin:'-60px auto 60px'"
);

// Add more bottom padding to hero section
content = content.replace(
  "padding:'120px 20px 60px'",
  "padding:'120px 20px 100px'"
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Fixed overlap - more space!');
