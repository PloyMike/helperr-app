const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Desktop: Nach "Mein Profil" einfügen
if (!content.includes("Provider Dashboard")) {
  content = content.replace(
    /(\{user&&<button onClick=\{\(\)=>window\.navigateTo\('edit-profile'\)\}[^>]+>[\s\S]*?Mein Profil[\s\S]*?<\/button>\})/,
    `$1

          {user&&<button onClick={()=>window.navigateTo('provider-dashboard')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Dashboard
          </button>}`
  );
  
  // Mobile: Nach "Mein Profil" einfügen
  content = content.replace(
    /(\{user&&<button onClick=\{\(\)=>\{window\.navigateTo\('edit-profile'\);setMobileMenuOpen\(false\);\}\}[^>]+>[\s\S]*?Mein Profil[\s\S]*?<\/button>\})/,
    `$1
          {user&&<button onClick={()=>{window.navigateTo('provider-dashboard');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            Dashboard
          </button>}`
  );
}

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Provider dashboard link added to header!');
