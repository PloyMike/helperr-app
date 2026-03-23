const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Update search placeholder text
content = content.replace(
  /placeholder="Search by name, skill, or keyword..."/,
  'placeholder="Search by name, location, skills, category, service..."'
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Search placeholder updated!');
