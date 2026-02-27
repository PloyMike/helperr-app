const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// MINIMAL padding oben und unten
content = content.replace(
  "padding:'80px 20px 50px'",
  "padding:'75px 20px 25px'"
);

// Zurück-Button noch höher, weniger margin
content = content.replace(
  "marginBottom:12",
  "marginBottom:8"
);

// Avatar kleiner
content = content.replace(
  "width:120,height:120",
  "width:90,height:90"
);

// Weniger Abstand unter Avatar
content = content.replace(
  "marginBottom:20}}>",
  "marginBottom:12}}>"
);

// Placeholder Avatar kleiner
content = content.replace(
  "fontSize:52,fontWeight:700",
  "fontSize:40,fontWeight:700"
);

// Name kleiner
content = content.replace(
  "fontSize:36,fontWeight:800,marginBottom:10",
  "fontSize:28,fontWeight:800,marginBottom:6"
);

// Job kleiner
content = content.replace(
  "fontSize:20,fontWeight:600,marginBottom:12",
  "fontSize:17,fontWeight:600,marginBottom:6"
);

// Location kleiner
content = content.replace(
  "fontSize:16,marginBottom:20}}>",
  "fontSize:14,marginBottom:10}}>"
);

// Badges kleiner
content = content.replace(
  /padding:'8px 16px'/g,
  "padding:'6px 12px'"
);

content = content.replace(
  /fontSize:14,fontWeight:700/g,
  "fontSize:13,fontWeight:700"
);

// Weniger Abstand unter Badges
content = content.replace(
  "marginBottom:16}}>",
  "marginBottom:8}}>"
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Hero is now ultra-tiny!');
