const fs = require('fs');
let content = fs.readFileSync('src/RegisterPage.jsx', 'utf8');

// Ändere Button Background von türkis zu grün
content = content.replace(
  /background: 'linear-gradient\(135deg, #14B8A6 0%, #0D9488 100%\)'/g,
  "background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)'"
);

// Ändere Button Shadow von türkis zu grün
content = content.replace(
  /boxShadow: '0 4px 12px rgba\(20,184,166,0\.3\)'/g,
  "boxShadow: '0 4px 12px rgba(6,95,70,0.3)'"
);

// Ändere Link Farbe von türkis zu grün
content = content.replace(
  /color: '#14B8A6'/g,
  "color: '#065f46'"
);

// Füge Back Button hinzu - suche nach dem Login Link und füge Back Button davor ein
content = content.replace(
  /<p style=\{styles\.footer\}>/,
  `<button onClick={() => window.navigateTo('home')} style={styles.backBtn}>
            ← Back to Home
          </button>

          <p style={styles.footer}>`
);

// Füge backBtn Style hinzu
content = content.replace(
  /const styles = \{/,
  `const styles = {
  backBtn: { width: '100%', padding: '12px', background: 'white', color: '#065f46', border: '2px solid #065f46', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', marginBottom: 16 },`
);

fs.writeFileSync('src/RegisterPage.jsx', content);
console.log('✅ Register page updated: Hero green colors + Back button!');
