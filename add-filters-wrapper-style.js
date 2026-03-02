const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Füge filters-wrapper Style hinzu
const wrapperStyle = `
        .filters-wrapper {
          max-width: 1200px;
          margin: 30px auto;
          padding: 0 20px;
        }`;

content = content.replace(
  /(\.advanced-filters \{)/,
  `${wrapperStyle}\n        $1`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Wrapper style added!');
