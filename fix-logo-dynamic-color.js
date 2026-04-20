const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Make logo color dynamic - white when transparent, green when scrolled
const oldLogo = /<div style=\{styles\.logo\} onClick=\{\(\) => window\.navigateTo\(''\)\}>\s*<span style=\{styles\.logoText\}>Helperr<\/span>\s*<\/div>/;

const newLogo = `<div style={styles.logo} onClick={() => window.navigateTo('')}>
            <span style={{
              ...styles.logoText,
              color: transparent && !isScrolled ? 'white' : '#10b981'
            }}>Helperr</span>
          </div>`;

content = content.replace(oldLogo, newLogo);

// Update logoText style to not have color (since it's now inline)
content = content.replace(
  /logoText: \{\s*fontSize: 24,\s*fontWeight: 800,\s*color: '#10b981',\s*letterSpacing: '-0\.5px'\s*\}/,
  `logoText: {
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: '-0.5px'
  }`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Logo color now dynamic - white on hero, green when scrolled!');
