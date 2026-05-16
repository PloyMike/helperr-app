const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Finde die Hero div und füge Background-Layer hinzu
const oldHero = `<div style={{position:'relative',overflow:'hidden',color:'white',padding:'90px 20px 40px'}}>`;

const newHero = `<div style={{position:'relative',overflow:'hidden',color:'white',padding:'90px 20px 40px'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.15,zIndex:0}}></div>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(20,184,166,0.92) 0%,rgba(13,148,136,0.95) 100%)',zIndex:1}}></div>`;

content = content.replace(oldHero, newHero);

// Füge zIndex:2 zur maxWidth div hinzu
content = content.replace(
  `<div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2}}>`,
  `<div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2}}>`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Hero background added!');
