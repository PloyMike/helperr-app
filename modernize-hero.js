const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Update hero style with modern gradient
content = content.replace(
  /hero: \{ background: 'linear-gradient\(135deg, #065f46 0%, #047857 100%\)', padding: '100px 20px 64px', clipPath: 'ellipse\(120% 100% at 50% 0%\)' \}/,
  `hero: { 
    background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 70%, #14b8a6 100%)', 
    padding: '100px 20px 64px', 
    position: 'relative',
    overflow: 'hidden'
  }`
);

// Add decorative elements to hero
content = content.replace(
  /<div style=\{styles\.hero\}>/,
  `<div style={styles.hero}>
        <div style={styles.heroGlow1}></div>
        <div style={styles.heroGlow2}></div>`
);

// Add glow styles
content = content.replace(
  /const styles = \{/,
  `const styles = {
  heroGlow1: {
    position: 'absolute',
    top: '-50%',
    right: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    pointerEvents: 'none'
  },
  heroGlow2: {
    position: 'absolute',
    bottom: '-30%',
    left: '-5%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(6, 95, 70, 0.4) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none'
  },`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Hero modernized with gradient glow effects!');
