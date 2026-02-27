const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Change profile button background from green to blue
content = content.replace(
  /background:'#6B8E23'/g,
  "background:'#5B9BD5'"
);

content = content.replace(
  /border:'1px solid #556B2F'/g,
  "border:'1px solid #4A90E2'"
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Button colors updated to elegant blue!');
