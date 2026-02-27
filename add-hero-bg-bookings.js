const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

const oldStyle = "background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',padding:'60px 20px',color:'white'";

const newStyle = "position:'relative',overflow:'hidden',padding:'60px 20px',color:'white'}}>\\n          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.12,zIndex:0}}/>\\n          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(20,184,166,0.92) 0%,rgba(13,148,136,0.95) 100%)',zIndex:1}}/>\\n          <div style={{position:'relative',zIndex:2";

content = content.replace(oldStyle, newStyle);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ MyBookings.jsx updated!');
