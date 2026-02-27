const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Much smaller padding
content = content.replace(
  "padding:'90px 20px 60px'",
  "padding:'80px 20px 40px'"
);

// Much smaller profile image
content = content.replace(
  "width:110,height:110",
  "width:80,height:80"
);

content = content.replace(
  "marginBottom:24",
  "marginBottom:16"
);

content = content.replace(
  "border:'4px solid white'",
  "border:'3px solid white'"
);

// Much smaller font in placeholder div
content = content.replace(
  "fontSize:64,fontWeight:700",
  "fontSize:36,fontWeight:700"
);

// Smaller title
content = content.replace(
  "fontSize:32,fontWeight:800,marginBottom:10",
  "fontSize:26,fontWeight:800,marginBottom:8"
);

// Smaller job title
content = content.replace(
  "fontSize:18,fontWeight:600,marginBottom:12",
  "fontSize:16,fontWeight:600,marginBottom:8"
);

// Smaller location
content = content.replace(
  "fontSize:15,marginBottom:20",
  "fontSize:14,marginBottom:16"
);

// Smaller badges
content = content.replace(
  /padding:'6px 14px'/g,
  "padding:'5px 12px'"
);

content = content.replace(
  /fontSize:13,fontWeight:700/g,
  "fontSize:12,fontWeight:700"
);

// Less space before badges
content = content.replace(
  "marginBottom:20",
  "marginBottom:12"
);

// Even less negative margin
content = content.replace(
  "margin:'-50px auto 60px'",
  "margin:'-40px auto 60px'"
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ ProfilDetail is now ultra-compact!');
