const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Entferne den Button aus der Mitte
content = content.replace(
  /<div style=\{\{textAlign:'center',marginBottom:24\}\}>\s*<button onClick=\{\(\)=>document\.getElementById\('map-section'\)\?\.scrollIntoView[\s\S]*?Zur Karte<\/button>\s*<\/div>/,
  ''
);

// Füge Button rechts oben im Hero ein (nach dem ersten div)
content = content.replace(
  `<div style={{position:'relative',overflow:'hidden',padding:'90px 20px 40px'}}>`,
  `<div style={{position:'relative',overflow:'hidden',padding:'90px 20px 40px'}}>
        <button onClick={()=>document.getElementById('map-section')?.scrollIntoView({behavior:'smooth'})} style={{position:'absolute',top:90,right:20,zIndex:10,padding:'10px 20px',fontSize:14,fontWeight:600,backgroundColor:'rgba(255,255,255,0.9)',color:'#1F2937',border:'2px solid #1F2937',borderRadius:12,cursor:'pointer',transition:'all 0.3s',fontFamily:'"Outfit",sans-serif',boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} onMouseOver={(e)=>{e.target.style.backgroundColor='#1F2937';e.target.style.color='white';}} onMouseOut={(e)=>{e.target.style.backgroundColor='rgba(255,255,255,0.9)';e.target.style.color='#1F2937';}}>🗺️ Zur Karte</button>`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Button moved to top right!');
