const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add display inline-flex to navBtn style
content = content.replace(
  /navBtn: \{\s*background: 'none',\s*border: 'none',\s*color: '#374151',\s*fontSize: 15,\s*fontWeight: 500,\s*cursor: 'pointer',\s*padding: '8px 12px',\s*borderRadius: 8,\s*transition: 'all 0\.2s',\s*fontFamily: '"Outfit", sans-serif'\s*\}/,
  `navBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '#374151',
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: 8,
    transition: 'all 0.2s',
    fontFamily: '"Outfit", sans-serif'
  }`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Button display fixed!');
