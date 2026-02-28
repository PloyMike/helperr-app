const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Entferne ALLE "Mein Profil" Buttons
content = content.replace(/\{user&&<button onClick=\{\(\)=>window\.navigateTo\('edit-profile'\)\}[^}]+>[\s\S]*?Mein Profil[\s\S]*?<\/button>\}/g, '');

// Füge NUR EINEN richtig ein - nach Favoriten
content = content.replace(
  /(<button onClick=\{\(\)=>window\.navigateTo\('favorites'\)\}[^>]+>[\s\S]*?Favoriten[\s\S]*?<\/button>)/,
  `$1

          {user&&<button onClick={()=>window.navigateTo('edit-profile')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Mein Profil
          </button>}`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Fixed double button!');
