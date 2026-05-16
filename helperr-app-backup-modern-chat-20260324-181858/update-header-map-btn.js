const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Füge Karte-Button nach Nachrichten hinzu (Desktop)
content = content.replace(
  `</button>

          <button onClick={()=>window.navigateTo('favorites')}`,
  `</button>

          <button onClick={()=>{const mapSection=document.getElementById('map-section');if(mapSection)mapSection.scrollIntoView({behavior:'smooth'});}} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Karte
          </button>

          <button onClick={()=>window.navigateTo('favorites')}`
);

// Füge Karte-Button ins Mobile Menu nach Nachrichten
content = content.replace(
  `</button>
          <button onClick={()=>{window.navigateTo('favorites');setMobileMenuOpen(false);}}`,
  `</button>
          <button onClick={()=>{const mapSection=document.getElementById('map-section');if(mapSection)mapSection.scrollIntoView({behavior:'smooth'});setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            🗺️ Karte
          </button>
          <button onClick={()=>{window.navigateTo('favorites');setMobileMenuOpen(false);}}`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Header updated with Map button!');
