const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// 1. VIEL weniger Padding oben im Hero
content = content.replace(
  "padding:'90px 20px 30px'",
  "padding:'80px 20px 50px'"
);

// 2. Zurück-Button weniger Abstand nach unten
content = content.replace(
  "marginBottom:20",
  "marginBottom:12"
);

// 3. Kästen weniger nach oben (mehr nach unten) - KEIN Overlap
content = content.replace(
  "margin:'-30px auto 60px'",
  "margin:'0 auto 60px'"
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Fixed spacing - no more overlap!');
