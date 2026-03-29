const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Update function signature
content = content.replace(
  /function Header\(\{ transparent \}\) \{/,
  'function Header({ transparent, isScrolled }) {'
);

// Update headerTransparent style to check isScrolled
content = content.replace(
  /\.\.\(transparent \? styles\.headerTransparent : \{\}\)/,
  `...(transparent ? (isScrolled ? styles.headerTransparentScrolled : styles.headerTransparentTop) : {})`
);

// Split transparent styles
content = content.replace(
  /headerTransparent: \{[\s\S]*?boxShadow: 'none'\s*\},/,
  `headerTransparentTop: {
    background: 'transparent',
    borderBottom: 'none',
    boxShadow: 'none'
  },
  headerTransparentScrolled: {
    background: 'linear-gradient(135deg, rgba(6, 95, 70, 0.3) 0%, rgba(4, 120, 87, 0.3) 100%)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderBottom: 'none',
    boxShadow: 'none'
  },`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Header scroll styles added!');
