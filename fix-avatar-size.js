const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Avatar wieder größer
content = content.replace(
  "width:70,height:70",
  "width:120,height:120"
);

content = content.replace(
  "marginBottom:12}}>",
  "marginBottom:20}}>"
);

// Placeholder Avatar größer
content = content.replace(
  "fontSize:36,fontWeight:700",
  "fontSize:52,fontWeight:700"
);

// Name wieder größer
content = content.replace(
  "fontSize:24,fontWeight:800,marginBottom:6",
  "fontSize:36,fontWeight:800,marginBottom:10"
);

// Job wieder größer
content = content.replace(
  "fontSize:15,fontWeight:600,marginBottom:6",
  "fontSize:20,fontWeight:600,marginBottom:12"
);

// Location wieder größer
content = content.replace(
  "fontSize:14,marginBottom:12}}>",
  "fontSize:16,marginBottom:20}}>"
);

// Badges wieder größer
content = content.replace(
  /padding:'5px 12px'/g,
  "padding:'8px 16px'"
);

content = content.replace(
  /fontSize:12,fontWeight:700/g,
  "fontSize:14,fontWeight:700"
);

content = content.replace(
  "marginBottom:8}}>",
  "marginBottom:16}}>"
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Avatar & content are back to normal size!');
