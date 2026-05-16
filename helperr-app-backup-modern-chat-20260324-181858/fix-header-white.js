const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Ersetze Header Background von Gradient zu Weiß
content = content.replace(
  /background:'linear-gradient\(135deg,#14B8A6 0%,#0D9488 100%\)'/g,
  "background:'white'"
);

// Ersetze Logo Farbe von Weiß zu Brand-Color
content = content.replace(
  /<div style=\{\{fontSize:32,fontWeight:800,color:'white',fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'\}\}>Helperr<\/div>/,
  `<div style={{fontSize:32,fontWeight:800,color:'#14B8A6',fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}}>Helperr</div>`
);

// Ersetze Desktop Nav Button Farben
content = content.replace(
  /background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer'/g,
  "background:'none',border:'none',color:'#374151',fontSize:15,fontWeight:600,cursor:'pointer'"
);

// Ersetze Zahnrad Button Background
content = content.replace(
  /background:'white',border:'none',color:'#14B8A6'/g,
  "background:'#F3F4F6',border:'none',color:'#14B8A6'"
);

// Ersetze Mobile Menu Background
content = content.replace(
  /<div onClick=\{\(e\)=>e\.stopPropagation\(\)\} style=\{\{background:'linear-gradient\(135deg,#14B8A6 0%,#0D9488 100%\)',padding:'20px 0',boxShadow:'0 8px 30px rgba\(0,0,0,0\.3\)'\}\}>/,
  `<div onClick={(e)=>e.stopPropagation()} style={{background:'white',padding:'20px 0',boxShadow:'0 8px 30px rgba(0,0,0,0.3)'}}>`
);

// Ersetze Mobile Menu Button Farben
content = content.replace(
  /width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba\(255,255,255,0\.1\)'/g,
  "width:'100%',padding:16,background:'none',border:'none',color:'#374151',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid #F3F4F6'"
);

// Ersetze Mobile Menu Logout Button
content = content.replace(
  /width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left'/g,
  "width:'100%',padding:16,background:'none',border:'none',color:'#EF4444',fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left'"
);

// Ersetze Hamburger Icon Farbe
content = content.replace(
  /display:'none',background:'none',border:'none',color:'white',fontSize:28/g,
  "display:'none',background:'none',border:'none',color:'#374151',fontSize:28"
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Header ist jetzt weiß und professionell!');
