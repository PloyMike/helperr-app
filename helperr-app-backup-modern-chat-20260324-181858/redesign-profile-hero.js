const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Finde und ersetze den gesamten Hero-Content-Bereich
const oldContent = /<div style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center'}}>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

const newContent = `<div style={{display:'flex',gap:32,alignItems:'flex-start'}}>
            
            <div style={{backgroundColor:'white',borderRadius:20,padding:24,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',minWidth:280}}>
              {profile.image_url?<img src={profile.image_url} alt={profile.name} style={{width:240,height:240,borderRadius:16,objectFit:'cover',display:'block',border:'3px solid #14B8A6'}}/>:<div style={{width:240,height:240,borderRadius:16,background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:80,fontWeight:700,color:'white',fontFamily:'"Outfit",sans-serif'}}>{profile.name?profile.name.charAt(0).toUpperCase():'?'}</div>}
            </div>

            <div style={{flex:1,backgroundColor:'white',borderRadius:20,padding:32,boxShadow:'0 8px 30px rgba(0,0,0,0.1)'}}>
              <h1 style={{fontSize:36,fontWeight:800,marginBottom:8,fontFamily:'"Outfit",sans-serif',color:'#1F2937'}}>{profile.name}</h1>
              <p style={{fontSize:20,fontWeight:600,marginBottom:12,fontFamily:'"Outfit",sans-serif',color:'#14B8A6'}}>{profile.job}</p>
              <p style={{fontSize:16,marginBottom:20,fontFamily:'"Outfit",sans-serif',color:'#6B7280'}}>📍 {profile.city}, {profile.country}</p>
              
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                {profile.verified&&<span style={{padding:'8px 16px',backgroundColor:'#14B8A6',color:'white',borderRadius:12,fontSize:14,fontWeight:700,fontFamily:'"Outfit",sans-serif'}}>✓ Verifiziert</span>}
                {profile.available&&<span style={{padding:'8px 16px',backgroundColor:'#06B6D4',color:'white',borderRadius:12,fontSize:14,fontWeight:700,fontFamily:'"Outfit",sans-serif'}}>Verfügbar</span>}
                {profile.rating>0&&<span style={{padding:'8px 16px',backgroundColor:'#F59E0B',color:'white',borderRadius:12,fontSize:14,fontWeight:700,fontFamily:'"Outfit",sans-serif'}}>⭐ {profile.rating}</span>}
                {badge&&<span style={{padding:'8px 16px',backgroundColor:badge.color,color:'white',borderRadius:12,fontSize:14,fontWeight:700,fontFamily:'"Outfit",sans-serif'}}>{badge.icon} {badge.text}</span>}
              </div>
            </div>

          </div>
        </div>
      </div>`;

content = content.replace(oldContent, newContent);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Profile hero redesigned!');
