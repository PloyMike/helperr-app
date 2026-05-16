const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Smaller padding in hero
content = content.replace(
  "padding:'120px 20px 100px'",
  "padding:'90px 20px 60px'"
);

// Smaller profile image
content = content.replace(
  "width:140,height:140",
  "width:110,height:110"
);

content = content.replace(
  "border:'5px solid white'",
  "border:'4px solid white'"
);

// Smaller title
content = content.replace(
  "fontSize:40,fontWeight:800,marginBottom:12",
  "fontSize:32,fontWeight:800,marginBottom:10"
);

// Smaller job title
content = content.replace(
  "fontSize:22,fontWeight:600,marginBottom:16",
  "fontSize:18,fontWeight:600,marginBottom:12"
);

// Smaller location
content = content.replace(
  "fontSize:16,marginBottom:24",
  "fontSize:15,marginBottom:20"
);

// Smaller badges
content = content.replace(
  /padding:'8px 16px'/g,
  "padding:'6px 14px'"
);

content = content.replace(
  /fontSize:14,fontWeight:700/g,
  "fontSize:13,fontWeight:700"
);

// Less negative margin for cards
content = content.replace(
  "margin:'-60px auto 60px'",
  "margin:'-50px auto 60px'"
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ ProfilDetail is now compact & professional!');
