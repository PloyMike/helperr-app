const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Füge ID zur Map Section hinzu
content = content.replace(
  `<div style={{backgroundColor:'#F9FAFB',padding:'40px 20px',borderTop:'1px solid #E5E7EB'}}>`,
  `<div id="map-section" style={{backgroundColor:'#F9FAFB',padding:'40px 20px',borderTop:'1px solid #E5E7EB'}}>`
);

// Füge Button nach dem "Starte als Anbieter" Button hinzu
const buttonCode = `</button>
          </div>
          <div style={{textAlign:'center',marginBottom:24}}>
            <button onClick={()=>document.getElementById('map-section')?.scrollIntoView({behavior:'smooth'})} style={{padding:'12px 28px',fontSize:15,fontWeight:600,backgroundColor:'transparent',color:'#1F2937',border:'2px solid #1F2937',borderRadius:16,cursor:'pointer',transition:'all 0.3s',fontFamily:'"Outfit",sans-serif'}} onMouseOver={(e)=>{e.target.style.backgroundColor='#1F2937';e.target.style.color='white';}} onMouseOut={(e)=>{e.target.style.backgroundColor='transparent';e.target.style.color='#1F2937';}}>🗺️ Zur Karte</button>`;

content = content.replace(
  `🚀 Starte als Anbieter</button>`,
  `🚀 Starte als Anbieter` + buttonCode
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Map button added!');
