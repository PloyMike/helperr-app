const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Entferne die Map Section von oben
const mapSection = `<div style={{backgroundColor:'white',padding:'50px 20px',borderBottom:'1px solid #E5E7EB'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <h2 style={{fontSize:32,fontWeight:700,marginBottom:24,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>🗺️ Helfer auf der Karte</h2>
          <MapView profiles={filteredProfiles}/>
        </div>
      </div>`;

content = content.replace(mapSection, '');

// Neue kleinere Map Section für unten
const newMapSection = `
      <div style={{backgroundColor:'#F9FAFB',padding:'40px 20px',borderTop:'1px solid #E5E7EB'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <h2 style={{fontSize:24,fontWeight:700,marginBottom:20,color:'#1F2937',fontFamily:'"Outfit",sans-serif',textAlign:'center'}}>🗺️ Helfer auf der Karte</h2>
          <MapView profiles={filteredProfiles}/>
        </div>
      </div>
`;

// Füge Map vor Footer ein
content = content.replace('<Footer/>', newMapSection + '\n      <Footer/>');

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Map moved to bottom and made smaller!');
