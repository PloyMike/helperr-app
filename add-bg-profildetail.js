const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Finde den Hero div und füge Background hinzu
content = content.replace(
  `<div style={{position:'relative',overflow:'hidden',padding:'75px 20px 25px',color:'white',marginTop:70}}>`,
  `<div style={{position:'relative',overflow:'hidden',padding:'75px 20px 25px',marginTop:70}}>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.7,zIndex:0}}></div>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(250,250,250,0.9) 100%)',zIndex:1}}></div>`
);

// Füge zIndex und color zur maxWidth div hinzu
content = content.replace(
  `<div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2}}>`,
  `<div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2,color:'#1F2937'}}>`
);

// Ändere Button Farbe zu dunkel
content = content.replace(
  `backgroundColor:'rgba(255,255,255,0.2)',color:'white'`,
  `backgroundColor:'rgba(31,41,55,0.1)',color:'#1F2937'`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ ProfilDetail background added!');
