const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Entferne Admin-Button aus Desktop-Navigation
content = content.replace(
  /<button onClick=\{\(\)=>window\.navigateTo\('admin'\)\} style=\{\{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0\.2s'\}\} onMouseOver=\{\(e\)=>e\.target\.style\.opacity='0\.8'\} onMouseOut=\{\(e\)=>e\.target\.style\.opacity='1'\}>\s*👑 Admin\s*<\/button>\s*/,
  ''
);

// Entferne Admin-Button aus Mobile-Menu
content = content.replace(
  /<button onClick=\{\(\)=>\{window\.navigateTo\('admin'\);setMobileMenuOpen\(false\);\}\} style=\{\{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba\(255,255,255,0\.1\)'\}>\s*Admin\s*<\/button>\s*/,
  ''
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Admin button removed from header!');
