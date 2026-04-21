const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Make hero title responsive - smaller and lighter on mobile
content = content.replace(
  /<h1 style=\{styles\.heroTitle\}>Find Local Experts<\/h1>/,
  `<h1 style={{
            ...styles.heroTitle,
            fontSize: window.innerWidth <= 768 ? 36 : 52,
            fontWeight: window.innerWidth <= 768 ? 700 : 800
          }}>Find Local Experts</h1>`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Hero text now smaller and lighter on mobile!');
