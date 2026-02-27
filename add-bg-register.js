const fs = require('fs');
let content = fs.readFileSync('src/RegisterPage.jsx', 'utf8');

// Finde den Hero div
const oldHero = `<div style={{position:'relative',overflow:'hidden',padding:'60px 20px',color:'white'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.12,zIndex:0}}/>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(20,184,166,0.92) 0%,rgba(13,148,136,0.95) 100%)',zIndex:1}}/>
          <div style={{maxWidth:800,margin:'0 auto',textAlign:'center',position:'relative',zIndex:2}}>`;

const newHero = `<div style={{position:'relative',overflow:'hidden',padding:'60px 20px'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.7,zIndex:0}}/>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(250,250,250,0.9) 100%)',zIndex:1}}/>
          <div style={{maxWidth:800,margin:'0 auto',textAlign:'center',position:'relative',zIndex:2,color:'#1F2937'}}>`;

content = content.replace(oldHero, newHero);

fs.writeFileSync('src/RegisterPage.jsx', content);
console.log('✅ RegisterPage hero updated!');
