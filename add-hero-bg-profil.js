const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Find and replace hero background
const oldStyle = "background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',padding:'75px 20px 25px',color:'white',marginTop:70";

const newStyle = "position:'relative',overflow:'hidden',padding:'75px 20px 25px',color:'white',marginTop:70}}>\\n        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.12,zIndex:0}}/>\\n        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(20,184,166,0.92) 0%,rgba(13,148,136,0.95) 100%)',zIndex:1}}/>\\n        <div style={{position:'relative',zIndex:2";

content = content.replace(oldStyle, newStyle);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ ProfilDetail.jsx updated with background image!');
