const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Make hero section more compact
content = content.replace(
  "padding:'140px 20px 80px'",
  "padding:'100px 20px 50px'"
);

// Make emoji smaller
content = content.replace(
  "fontSize:72,marginBottom:20",
  "fontSize:56,marginBottom:16"
);

// Make title smaller
content = content.replace(
  "fontSize:64,fontWeight:800,marginBottom:20",
  "fontSize:48,fontWeight:800,marginBottom:16"
);

// Make subtitle smaller
content = content.replace(
  "fontSize:24,marginBottom:60",
  "fontSize:18,marginBottom:40"
);

// Make button smaller and inline with search
content = content.replace(
  "textAlign:'center',marginBottom:50",
  "textAlign:'center',marginBottom:30"
);

content = content.replace(
  "padding:'18px 45px',fontSize:18",
  "padding:'14px 32px',fontSize:16"
);

// Make search bar smaller max-width
content = content.replace(
  "maxWidth:700,margin:'0 auto'",
  "maxWidth:600,margin:'0 auto'"
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Hero section is now more compact!');
