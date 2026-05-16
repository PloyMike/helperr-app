const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Find the hero div and add background image layers
const oldHeroStyle = "background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',padding:'90px 20px 40px',position:'relative',overflow:'hidden'";

const newHeroStyle = "position:'relative',overflow:'hidden',color:'white',padding:'90px 20px 40px'}}>\\n        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.15,zIndex:0}}/>\\n        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(20,184,166,0.92) 0%,rgba(13,148,136,0.95) 100%)',zIndex:1}}/>\\n        <div style={{position:'relative',zIndex:2";

content = content.replace(oldHeroStyle, newHeroStyle);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Helperr.jsx updated with background image!');
