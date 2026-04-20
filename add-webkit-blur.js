const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add webkit prefix for Safari
content = content.replace(
  /backdropFilter: 'blur\(10px\)',/g,
  `backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',`
);

content = content.replace(
  /backdropFilter: 'none',/g,
  `backdropFilter: 'none',
    WebkitBackdropFilter: 'none',`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Webkit blur prefix added for Safari!');
