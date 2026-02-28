const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Desktop Link nach Favoriten
const desktopLink = `
          {user&&<button onClick={()=>window.navigateTo('edit-profile')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Mein Profil
          </button>}`;

// Nach Anbieter werden Button einfügen
content = content.replace(
  /<button onClick=\{\(\)=>window\.navigateTo\('register'\)\}/,
  desktopLink + '\n\n          <button onClick={()=>window.navigateTo(\'register\')}'
);

// Mobile Link nach Favoriten
const mobileLink = `
          {user&&<button onClick={()=>{window.navigateTo('edit-profile');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            Mein Profil
          </button>}`;

// Im Mobile Menu einfügen - vor Login/Logout
content = content.replace(
  /{user \? \(/,
  mobileLink + '\n          \n          {user ? ('
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Profile link added!');
