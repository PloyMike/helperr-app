const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Desktop Nav - nach Favoriten
if (!content.includes("navigateTo('edit-profile')")) {
  content = content.replace(
    /<button onClick=\{\(\)=>window\.navigateTo\('favorites'\)\} style=\{\{position:'relative',background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0\.2s'\}\}/,
    `<button onClick={()=>window.navigateTo('favorites')} style={{position:'relative',background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}}>\n            Favoriten\n            {favorites.length>0&&<span style={{position:'absolute',top:-8,right:-12,backgroundColor:'#F97316',color:'white',borderRadius:'50%',width:20,height:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700}}>{favorites.length}</span>}\n          </button>\n\n          {user&&<button onClick={()=>window.navigateTo('edit-profile')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>\n            Mein Profil\n          </button>}`
  );
  
  // Mobile Menu - nach Favoriten
  content = content.replace(
    /<button onClick=\{\(\)=>\{window\.navigateTo\('favorites'\);setMobileMenuOpen\(false\);\}\} style=\{\{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba\(255,255,255,0\.1\)'\}\}>\s*Favoriten \{favorites\.length>0&&<span style=\{\{marginLeft:8,padding:'2px 8px',backgroundColor:'#F97316',borderRadius:12,fontSize:12\}\}>\(\{favorites\.length\}\)<\/span>\}\s*<\/button>/,
    `<button onClick={()=>{window.navigateTo('favorites');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            Favoriten {favorites.length>0&&<span style={{marginLeft:8,padding:'2px 8px',backgroundColor:'#F97316',borderRadius:12,fontSize:12}}>({favorites.length})</span>}
          </button>
          {user&&<button onClick={()=>{window.navigateTo('edit-profile');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            Mein Profil
          </button>}`
  );
}

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Profile link added to header!');
