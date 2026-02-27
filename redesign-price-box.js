const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Finde und ersetze die Preis-Box
const oldPriceBox = /<div style={{backgroundColor:'white',borderRadius:20,padding:32,marginBottom:24,boxShadow:'0 8px 30px rgba\(0,0,0,0\.1\)'}}>[\s\S]*?<\/div>/;

const newPriceBox = `<div style={{backgroundColor:'white',borderRadius:20,padding:40,marginBottom:24,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',border:'1px solid #E5E7EB'}}>
              <div style={{borderBottom:'1px solid #F3F4F6',paddingBottom:24,marginBottom:24}}>
                <div style={{fontSize:14,fontWeight:600,color:'#9CA3AF',marginBottom:8,fontFamily:'"Outfit",sans-serif',textTransform:'uppercase',letterSpacing:'1px'}}>Preis</div>
                <div style={{fontSize:42,fontWeight:800,color:'#1F2937',fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}}>{profile.price||'Auf Anfrage'}</div>
              </div>
              <button onClick={()=>setShowBooking(true)} style={{width:'100%',padding:'16px',background:'#1F2937',color:'white',border:'none',borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s',letterSpacing:'0.5px'}} onMouseOver={(e)=>{e.target.style.background='#14B8A6';e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 8px 25px rgba(20,184,166,0.3)';}} onMouseOut={(e)=>{e.target.style.background='#1F2937';e.target.style.transform='translateY(0)';e.target.style.boxShadow='none';}}>Jetzt buchen</button>
              <p style={{fontSize:13,color:'#9CA3AF',marginTop:16,textAlign:'center',fontFamily:'"Outfit",sans-serif'}}>💬 Sichere Zahlung über die Plattform</p>
            </div>`;

content = content.replace(oldPriceBox, newPriceBox);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Price box redesigned!');
