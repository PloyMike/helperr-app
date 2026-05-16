const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// DESKTOP: Nach dem "Anbieter werden" Button
const desktopButton = `

          {user&&<button onClick={()=>window.navigateTo('edit-profile')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Mein Profil
          </button>}`;

// Füge Button nach "Anbieter werden" ein - nur wenn nicht schon da
if (!content.includes("Mein Profil")) {
  content = content.replace(
    /(<button onClick=\{\(\)=>window\.navigateTo\('register'\)\}[^>]+>\s*\+ Anbieter werden\s*<\/button>)/,
    `$1${desktopButton}`
  );
  
  // MOBILE: Füge auch im Mobile Menu ein - vor dem user check
  const mobileButton = `
          {user&&<button onClick={()=>{window.navigateTo('edit-profile');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            Mein Profil
          </button>}
          `;
  
  content = content.replace(
    /(\{user \? \()/,
    `${mobileButton}$1`
  );
}

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Profile button added!');
