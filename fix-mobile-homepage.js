const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Füge responsive Styles am Ende vor </div> hinzu
content = content.replace(
  '<Footer/>',
  `<Footer/>
      
      <style>{\`
        @media (max-width: 768px) {
          /* Hero anpassen */
          .hero-title {
            font-size: 32px !important;
          }
          .hero-subtitle {
            font-size: 15px !important;
          }
          /* Suchleiste anpassen */
          .search-input {
            padding: 14px 50px 14px 16px !important;
            font-size: 14px !important;
          }
          .search-icon {
            right: 16px !important;
            font-size: 20px !important;
          }
          /* Profile Grid - 1 Spalte auf Mobile */
          .profile-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          /* Karte kleiner */
          .map-container {
            max-width: 100% !important;
            padding: 0 16px !important;
          }
        }
      \`}</style>`
);

// Füge Klassen zu Elementen hinzu
content = content.replace(
  /style=\{\{fontSize:42,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'\}\}>Helperr/,
  `style={{fontSize:42,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}} className="hero-title">Helperr`
);

content = content.replace(
  /style=\{\{fontSize:17,marginBottom:32,fontFamily:'"Outfit",sans-serif',fontWeight:400,maxWidth:600,margin:'0 auto 32px',lineHeight:1\.5,opacity:0\.95\}\}>Finde vertrauenswürdige/,
  `style={{fontSize:17,marginBottom:32,fontFamily:'"Outfit",sans-serif',fontWeight:400,maxWidth:600,margin:'0 auto 32px',lineHeight:1.5,opacity:0.95}} className="hero-subtitle">Finde vertrauenswürdige`
);

content = content.replace(
  /<input type="text" placeholder="Suche nach Service, Name oder Stadt..." value=\{searchQuery\} onChange=\{\(e\)=>setSearchQuery\(e\.target\.value\)\} style=\{\{width:'100%',padding:'18px 60px 18px 24px',fontSize:16,/,
  `<input type="text" placeholder="Suche nach Service, Name oder Stadt..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="search-input" style={{width:'100%',padding:'18px 60px 18px 24px',fontSize:16,`
);

content = content.replace(
  /<div style=\{\{position:'absolute',right:24,top:'50%',transform:'translateY\(-50%\)',fontSize:24\}\}>🔍<\/div>/,
  `<div className="search-icon" style={{position:'absolute',right:24,top:'50%',transform:'translateY(-50%)',fontSize:24}}>🔍</div>`
);

content = content.replace(
  /style=\{\{maxWidth:1200,margin:'0 auto 80px',padding:'0 20px',display:'grid',gridTemplateColumns:'repeat\(auto-fill,minmax\(320px,1fr\)\)',gap:28\}\}>/,
  `style={{maxWidth:1200,margin:'0 auto 80px',padding:'0 20px',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:28}} className="profile-grid">`
);

content = content.replace(
  /<div style=\{\{maxWidth:800,margin:'0 auto'\}\}>/,
  `<div style={{maxWidth:800,margin:'0 auto'}} className="map-container">`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Mobile styles added!');
