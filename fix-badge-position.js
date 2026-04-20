const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Fix desktop badge position - change top value
content = content.replace(
  /position: 'absolute',\s*top: -4,\s*right: -8,/g,
  `position: 'absolute',
                        top: 0,
                        right: -10,`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Badge position fixed - now aligned!');
