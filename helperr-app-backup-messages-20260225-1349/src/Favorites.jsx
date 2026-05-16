import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('helperr_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const removeFavorite = (profileId) => {
    const updated = favorites.filter(f => f.id !== profileId);
    localStorage.setItem('helperr_favorites', JSON.stringify(updated));
    setFavorites(updated);
  };

  const clearAll = () => {
    if (window.confirm('Alle Favoriten löschen?')) {
      localStorage.removeItem('helperr_favorites');
      setFavorites([]);
    }
  };

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div style={{paddingTop:70}}>
        <div style={{position:'relative',overflow:'hidden',padding:'60px 20px'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.7,zIndex:0}}/>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(250,250,250,0.9) 100%)',zIndex:1}}/>
          <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2,color:'#1F2937'}}>
            <h1 style={{fontSize:48,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}}>🤍 Meine Favoriten</h1>
            <p style={{fontSize:18,opacity:0.95,fontFamily:'"Outfit",sans-serif',fontWeight:400}}>Deine gespeicherten Helfer an einem Ort</p>
          </div>
        </div>

        <div style={{maxWidth:1200,margin:'40px auto',padding:'0 20px'}}>
          
          {favorites.length > 0 && (
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:32,backgroundColor:'white',padding:24,borderRadius:20,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
              <div style={{fontSize:16,fontWeight:600,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>
                {favorites.length} {favorites.length===1?'Favorit':'Favoriten'}
              </div>
              <button onClick={clearAll} style={{padding:'12px 24px',backgroundColor:'#EF4444',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}}>
                Alle löschen
              </button>
            </div>
          )}

          {favorites.length === 0 ? (
            <div style={{textAlign:'center',padding:100,backgroundColor:'white',borderRadius:20,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
              <div style={{fontSize:72,marginBottom:24}}>🤍</div>
              <h2 style={{fontSize:28,fontWeight:700,marginBottom:16,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Noch keine Favoriten</h2>
              <p style={{fontSize:16,color:'#6B7280',marginBottom:40,fontFamily:'"Outfit",sans-serif'}}>Speichere Profile, die dir gefallen!</p>
              <button onClick={()=>window.navigateTo('home')} style={{padding:'16px 32px',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:16,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif',boxShadow:'0 4px 15px rgba(20,184,166,0.3)'}}>
                Profile durchsuchen
              </button>
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:28}}>
              {favorites.map(profile => (
                <div key={profile.id} style={{backgroundColor:'white',borderRadius:20,padding:28,boxShadow:'0 4px 20px rgba(0,0,0,0.08)',transition:'all 0.3s',position:'relative'}} onMouseOver={(e)=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.12)';}} onMouseOut={(e)=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)';}}>
                  
                  <button onClick={(e)=>{e.stopPropagation();removeFavorite(profile.id);}} style={{position:'absolute',top:20,right:20,background:'white',border:'none',borderRadius:'50%',width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.1)',zIndex:10,transition:'all 0.2s'}}>
                    ❤️
                  </button>

                  {profile.image_url?<img src={profile.image_url} alt={profile.name} style={{width:90,height:90,borderRadius:'50%',objectFit:'cover',marginBottom:20,border:'4px solid #14B8A6'}}/>:<div style={{width:90,height:90,borderRadius:'50%',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,fontWeight:700,color:'white',marginBottom:20,fontFamily:'"Outfit",sans-serif'}}>{profile.name?profile.name.charAt(0).toUpperCase():'?'}</div>}
                  
                  <h3 style={{fontSize:22,fontWeight:700,marginBottom:8,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>{profile.name}</h3>
                  <p style={{fontSize:16,color:'#14B8A6',fontWeight:600,marginBottom:10,fontFamily:'"Outfit",sans-serif'}}>{profile.job}</p>
                  <p style={{fontSize:14,color:'#6B7280',marginBottom:14,fontFamily:'"Outfit",sans-serif'}}>📍 {profile.city}, {profile.country}</p>
                  <p style={{fontSize:20,fontWeight:700,color:'#F97316',marginBottom:20,fontFamily:'"Outfit",sans-serif'}}>{profile.price}</p>

                  <button onClick={()=>window.navigateTo('profile',profile)} style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif',boxShadow:'0 4px 12px rgba(20,184,166,0.3)',transition:'all 0.3s'}}>
                    Profil ansehen
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default Favorites;
