const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Ändere Gradient von Teal zu Weiß
content = content.replace(
  "background:'linear-gradient(135deg,rgba(20,184,166,0.85) 0%,rgba(13,148,136,0.88) 100%)'",
  "background:'linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(250,250,250,0.9) 100%)'"
);

// Ändere Textfarbe von weiß zu dunkel
content = content.replace(
  "color:'white'}}>",
  "color:'#1F2937'}}>"
);

// Ändere "Dein Standort" Text zu dunkel
content = content.replace(
  "opacity:0.9}}>📍",
  "opacity:0.7,color:'#4B5563'}}>📍"
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Hero changed to white!');
