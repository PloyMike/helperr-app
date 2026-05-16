const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Mobile Menu Link - nach Favoriten Button
const mobileLink = `
          {user&&<button onClick={()=>{window.navigateTo('edit-profile');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            Mein Profil
          </button>}`;

// Nach Favoriten einfügen - nur wenn nicht schon da
if (!content.includes('Mein Profil</button>}')) {
  // Suche nach dem Mobile Favoriten Button und füge danach ein
  content = content.replace(
    /(<button onClick=\{\(\)=>\{window\.navigateTo\('favorites'\);setMobileMenuOpen\(false\);\}\}[^>]+>[\s\S]*?Favoriten[\s\S]*?<\/button>)/,
    `$1${mobileLink}`
  );
}

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Mobile profile link added!');
