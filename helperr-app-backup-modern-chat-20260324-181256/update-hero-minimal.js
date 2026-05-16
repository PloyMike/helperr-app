const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Even smaller padding
content = content.replace(
  "padding:'100px 20px 50px'",
  "padding:'90px 20px 40px'"
);

// Remove the big handshake emoji div completely
content = content.replace(
  /<div style=\{\{fontSize:56,marginBottom:16\}\}>🤝<\/div>/g,
  ''
);

// Make title even smaller
content = content.replace(
  "fontSize:48,fontWeight:800,marginBottom:16",
  "fontSize:42,fontWeight:800,marginBottom:12"
);

// Make subtitle smaller
content = content.replace(
  "fontSize:18,marginBottom:40",
  "fontSize:17,marginBottom:32"
);

// Make button area more compact
content = content.replace(
  "textAlign:'center',marginBottom:30",
  "textAlign:'center',marginBottom:24"
);

// Smaller button
content = content.replace(
  "padding:'14px 32px',fontSize:16",
  "padding:'12px 28px',fontSize:15"
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Hero is now minimal & professional!');
