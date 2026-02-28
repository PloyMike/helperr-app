import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Header from './Header';
import Footer from './Footer';

function Favorites() {
  const { user, signIn } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem('helperr_favorites');
      if (saved) setFavorites(JSON.parse(saved));

      const handleStorageChange = () => {
        const updated = localStorage.getItem('helperr_favorites');
        if (updated) setFavorites(JSON.parse(updated));
      };

      window.addEventListener('storage', handleStorageChange);
      const interval = setInterval(handleStorageChange, 1000);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
        clearInterval(interval);
      };
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    if (error) {
      alert('Login fehlgeschlagen: ' + error.message);
    }
    setLoginLoading(false);
  };

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

  if (!user) {
    return (
      <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Header/>
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'90px 20px 40px'}}>
          <div style={{background:'white',padding:40,borderRadius:20,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',maxWidth:400,width:'100%',fontFamily:'"Outfit",sans-serif'}}>
            <h2 style={{fontSize:28,fontWeight:700,marginBottom:30,color:'#1F2937',textAlign:'center'}}>Login für Favoriten</h2>
            <form onSubmit={handleLogin}>
              <div style={{marginBottom:20}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:14,color:'#1F2937'}}>Email</label>
                <input type="email" required value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} placeholder="deine@email.com" style={{width:'100%',padding:'12px 16px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div style={{marginBottom:24}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:14,color:'#1F2937'}}>Passwort</label>
                <input type="password" required value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} placeholder="Passwort" style={{width:'100%',padding:'12px 16px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <button type="submit" disabled={loginLoading} style={{width:'100%',padding:16,background:loginLoading?'#CBD5E0':'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:loginLoading?'not-allowed':'pointer'}}>
                {loginLoading ? 'Lädt...' : 'Einloggen'}
              </button>
              <p style={{textAlign:'center',marginTop:20,fontSize:14,color:'#6B7280'}}>Noch kein Account? <span onClick={()=>window.navigateTo('signup')} style={{color:'#14B8A6',fontWeight:600,cursor:'pointer',textDecoration:'underline'}}>Registrieren</span></p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div className="favorites-wrapper">
        <div className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-gradient"></div>
          <div className="hero-content">
            <h1 className="hero-title">Meine Favoriten</h1>
            <p className="hero-subtitle">Deine gespeicherten Helfer an einem Ort</p>
          </div>
        </div>

        <div className="favorites-content">

          {favorites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🤍</div>
              <h2>Noch keine Favoriten</h2>
              <p>Speichere Profile, die dir gefallen!</p>
              <button onClick={()=>window.navigateTo('home')} className="browse-button">Profile durchsuchen</button>
            </div>
          ) : (
            <>
              <div className="favorites-grid">
                {favorites.map(profile => (
                  <div key={profile.id} className="favorite-card">
                    
                    <button onClick={(e)=>{e.stopPropagation();removeFavorite(profile.id);}} className="remove-btn">
                      ❤️
                    </button>

                    {profile.image_url?
                      <img src={profile.image_url} alt={profile.name} className="profile-avatar"/>
                      :
                      <div className="profile-avatar-placeholder">{profile.name?profile.name.charAt(0).toUpperCase():'?'}</div>
                    }
                    
                    <h3 className="profile-name">{profile.name}</h3>
                    <p className="profile-job">{profile.job}</p>
                    <p className="profile-location">📍 {profile.city}, {profile.country}</p>
                    <p className="profile-price">{profile.price}</p>

                    <button onClick={()=>window.navigateTo('profile',profile)} className="view-profile-btn">
                      Profil ansehen
                    </button>
                  </div>
                ))}
              </div>

              <div className="favorites-footer">
                <div className="favorites-count">
                  {favorites.length} {favorites.length===1?'Favorit':'Favoriten'}
                </div>
                <button onClick={clearAll} className="clear-all-btn">
                  Alle löschen
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer/>

      <style>{`
        .favorites-container {
          min-height: 100vh;
          background-color: #F9FAFB;
        }
        .favorites-wrapper {
          padding-top: 70px;
        }
        .hero-section {
          position: relative;
          overflow: hidden;
          padding: 60px 20px;
        }
        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80);
          background-size: cover;
          background-position: center;
          opacity: 0.7;
          z-index: 0;
        }
        .hero-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(250,250,250,0.9) 100%);
          z-index: 1;
        }
        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          color: #1F2937;
          text-align: center;
        }
        .hero-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 12px;
          font-family: "Outfit", sans-serif;
          letter-spacing: -1px;
        }
        .hero-subtitle {
          font-size: 18px;
          opacity: 0.95;
          font-family: "Outfit", sans-serif;
          font-weight: 400;
        }
        .favorites-content {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }
        .empty-state {
          text-align: center;
          padding: 100px;
          background-color: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .empty-icon {
          font-size: 72px;
          margin-bottom: 24px;
        }
        .empty-state h2 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .empty-state p {
          font-size: 16px;
          color: #6B7280;
          margin-bottom: 40px;
          font-family: "Outfit", sans-serif;
        }
        .browse-button {
          padding: 16px 32px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          box-shadow: 0 4px 15px rgba(20,184,166,0.3);
          transition: all 0.3s;
        }
        .browse-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(20,184,166,0.4);
        }
        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 28px;
          margin-bottom: 32px;
        }
        .favorites-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: transparent;
          padding: 24px 0;
        }
        .favorites-count {
          font-size: 16px;
          font-weight: 600;
          color: #6B7280;
          font-family: "Outfit", sans-serif;
        }
        .clear-all-btn {
          padding: 12px 24px;
          background-color: #EF4444;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
        }
        .clear-all-btn:hover {
          background-color: #DC2626;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239,68,68,0.3);
        }
        .favorite-card {
          background-color: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s;
          position: relative;
          text-align: center;
        }
        .favorite-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
        }
        .remove-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: white;
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 10;
          transition: all 0.2s;
        }
        .remove-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }
        .profile-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 20px;
          border: 4px solid #14B8A6;
        }
        .profile-avatar-placeholder {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          font-weight: 700;
          color: white;
          margin: 0 auto 20px;
          font-family: "Outfit", sans-serif;
        }
        .profile-name {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .profile-job {
          font-size: 16px;
          color: #14B8A6;
          font-weight: 600;
          margin-bottom: 10px;
          font-family: "Outfit", sans-serif;
        }
        .profile-location {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 14px;
          font-family: "Outfit", sans-serif;
        }
        .profile-price {
          font-size: 20px;
          font-weight: 700;
          color: #F97316;
          margin-bottom: 20px;
          font-family: "Outfit", sans-serif;
        }
        .view-profile-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          box-shadow: 0 4px 12px rgba(20,184,166,0.3);
          transition: all 0.3s;
        }
        .view-profile-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(20,184,166,0.4);
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 16px !important;
          }
          .hero-title {
            font-size: 28px !important;
            margin-bottom: 8px !important;
          }
          .hero-subtitle {
            font-size: 15px !important;
          }
          .favorites-content {
            margin: 24px auto !important;
            padding: 0 16px !important;
          }
          .empty-state {
            padding: 60px 20px !important;
          }
          .empty-icon {
            font-size: 56px !important;
          }
          .empty-state h2 {
            font-size: 22px !important;
          }
          .empty-state p {
            font-size: 14px !important;
            margin-bottom: 28px !important;
          }
          .browse-button {
            padding: 14px 24px !important;
            font-size: 14px !important;
          }
          .favorites-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            margin-bottom: 24px !important;
          }
          .favorites-footer {
            flex-direction: column !important;
            gap: 12px !important;
            padding: 16px 0 !important;
          }
          .favorites-count {
            font-size: 14px !important;
            text-align: center !important;
          }
          .clear-all-btn {
            width: 100% !important;
            padding: 10px !important;
            font-size: 13px !important;
          }
          .favorite-card {
            padding: 24px !important;
          }
          .remove-btn {
            top: 16px !important;
            right: 16px !important;
            width: 38px !important;
            height: 38px !important;
            font-size: 18px !important;
          }
          .profile-avatar, .profile-avatar-placeholder {
            width: 70px !important;
            height: 70px !important;
            font-size: 32px !important;
            border-width: 3px !important;
            margin-bottom: 16px !important;
          }
          .profile-name {
            font-size: 20px !important;
          }
          .profile-job {
            font-size: 15px !important;
          }
          .profile-location {
            font-size: 13px !important;
            margin-bottom: 12px !important;
          }
          .profile-price {
            font-size: 18px !important;
            margin-bottom: 16px !important;
          }
          .view-profile-btn {
            padding: 12px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Favorites;
