const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Add clipPath back
content = content.replace(
  /hero: \{ \s*background: 'linear-gradient\(135deg, #065f46 0%, #047857 40%, #0f766e 70%, #14b8a6 100%\)', \s*padding: '100px 20px 64px', \s*position: 'relative',\s*overflow: 'hidden'\s*\}/,
  `hero: { 
    background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 70%, #14b8a6 100%)', 
    padding: '100px 20px 64px', 
    position: 'relative',
    overflow: 'hidden',
    clipPath: 'ellipse(120% 100% at 50% 0%)'
  }`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Hero curved bottom restored!');
