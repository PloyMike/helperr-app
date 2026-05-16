const fs = require('fs');
let content = fs.readFileSync('src/MessagesPage.jsx', 'utf8');

// Padding reduzieren - Box höher
content = content.replace(
  /padding:'120px 20px 60px'/,
  `padding:'90px 20px 40px'`
);

fs.writeFileSync('src/MessagesPage.jsx', content);
console.log('✅ Login box moved higher!');
