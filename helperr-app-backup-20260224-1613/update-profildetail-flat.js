const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// VIEL weniger Padding oben und unten
content = content.replace(
  "padding:'80px 20px 40px'",
  "padding:'90px 20px 30px'"
);

// Zurück-Button weniger Abstand unten
content = content.replace(
  "marginBottom:30",
  "marginBottom:20"
);

// Noch kleineres Profilbild
content = content.replace(
  "width:80,height:80",
  "width:70,height:70"
);

content = content.replace(
  "marginBottom:16",
  "marginBottom:12"
);

// Noch kleinere Schriften
content = content.replace(
  "fontSize:26,fontWeight:800,marginBottom:8",
  "fontSize:24,fontWeight:800,marginBottom:6"
);

content = content.replace(
  "fontSize:16,fontWeight:600,marginBottom:8",
  "fontSize:15,fontWeight:600,marginBottom:6"
);

content = content.replace(
  "fontSize:14,marginBottom:16",
  "fontSize:14,marginBottom:12"
);

// Badges weniger Abstand
content = content.replace(
  "marginBottom:12",
  "marginBottom:8"
);

// Noch weniger negative margin für die Kästen
content = content.replace(
  "margin:'-40px auto 60px'",
  "margin:'-30px auto 60px'"
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Hero is now ultra-flat!');
