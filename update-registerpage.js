const fs = require('fs');
let content = fs.readFileSync('src/RegisterPage.jsx', 'utf8');

// Add Outfit font
if (!content.includes('Outfit')) {
  content = content.replace(
    '<div',
    '<><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" /><div'
  );
  content = content.replace(/}\s*export default/, `  </>
  );
}
export default`);
}

// Colors
content = content.replace(/background: 'linear-gradient\(135deg, #667eea 0%, #764ba2 100%\)'/g, "background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)'");
content = content.replace(/#667eea/g, '#14B8A6');
content = content.replace(/#764ba2/g, '#0D9488');

// Submit button orange
content = content.replace(
  /backgroundColor: '#14B8A6'([\s\S]*?)(Profil erstellen|Registrieren)/g,
  "backgroundColor: '#F97316'$1$2"
);

// Fonts
content = content.replace(/fontFamily: '.*?'/g, "fontFamily: '\"Outfit\", sans-serif'");

// Rounded
content = content.replace(/borderRadius: 12/g, 'borderRadius: 16');
content = content.replace(/borderRadius: 8/g, 'borderRadius: 12');

fs.writeFileSync('src/RegisterPage.jsx', content);
console.log('✅ RegisterPage updated!');
