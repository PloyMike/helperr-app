const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Fix desktop badges - center them vertically
content = content.replace(
  /position: 'absolute',\s*top: 0,\s*right: -10,/g,
  `position: 'absolute',
                        top: '50%',
                        right: -10,
                        transform: 'translateY(-50%)',`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Badges vertically centered!');
