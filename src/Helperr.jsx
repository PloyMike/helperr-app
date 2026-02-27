import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import MapView from './MapView';
import Header from './Header';
import Footer from './Footer';

function Helperr() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('helperr_favorites');
    if (saved) setFavorites(JSON.parse(saved));
    fetchProfiles();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => console.log('Geolocation error:', error)
      );
    }
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (profile, e) => {
    e.stopPropagation();
    const isFav = favorites.some(f => f.id === profile.id);
    const updated = isFav ? favorites.filter(f => f.id !== profile.id) : [...favorites, profile];
    localStorage.setItem('helperr_favorites', JSON.stringify(updated));
    setFavorites(updated);
  };

  const getBadge = (profile) => {
    const days = profile.created_at ? Math.floor((new Date() - new Date(profile.created_at)) / (1000*60*60*24)) : 0;
    const rating = profile.rating || 0;
    const views = profile.view_count || 0;
    if (rating >= 4.5 && (profile.review_count || 0) >= 5) return { text: 'Top-Rated', color: '#F97316', icon: '🏆' };
    if (views > 100) return { text: 'Popular', color: '#14B8A6', icon: '🔥' };
    if (days < 7) return { text: 'New', color: '#06B6D4', icon: '✨' };
    if (days < 30) return { text: 'Active', color: '#0D9488', icon: '⚡' };
    return null;
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !searchQuery || profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) || profile.job?.toLowerCase().includes(searchQuery.toLowerCase()) || profile.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',fontSize:24,fontWeight:600,fontFamily:'"Outfit",sans-serif'}}>Lädt Profile...</div>;
  }

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div className="hero-section">
        <div className="hero-bg-image"></div>
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <div style={{textAlign:'center',marginBottom:20}}>
            <h1 className="hero-title">Helperr</h1>
            <p className="hero-subtitle">Finde vertrauenswürdige Helfer in deiner Nähe – schnell, einfach, sicher</p>
          </div>
          <div className="search-container">
            <input type="text" placeholder="Suche nach Service, Name oder Stadt..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="search-input"/>
            <div className="search-icon">🔍</div>
          </div>
          {userLocation && <div className="location-text">📍 Dein Standort wurde erkannt</div>}
          
        </div>
      </div>

      <div style={{maxWidth:1200,margin:'20px auto',padding:'0 20px',color:'#6B7280',fontWeight:600,fontFamily:'"Outfit",sans-serif',fontSize:16}}>
        {filteredProfiles.length} Helfer gefunden
      </div>

      <div className="profile-grid">
        {filteredProfiles.map(profile=>{
          const badge=getBadge(profile);
          return(
            <div key={profile.id} onClick={()=>window.navigateTo('profile',profile)} className="profile-card">
              <button onClick={(e)=>toggleFavorite(profile,e)} className="fav-button">{favorites.some(f=>f.id===profile.id)?'❤️':'🤍'}</button>
              {profile.image_url?<img src={profile.image_url} alt={profile.name} className="profile-image"/>:<div className="profile-avatar">{profile.name?profile.name.charAt(0).toUpperCase():'?'}</div>}
              <h3 className="profile-name">{profile.name||'Unbekannt'}</h3>
              <p className="profile-job">{profile.job||'Keine Angabe'}</p>
              <p className="profile-location">📍 {profile.city||'?'}, {profile.country||'?'}</p>
              <p className="profile-price">{profile.price||'Preis auf Anfrage'}</p>
              {profile.bio&&<p className="profile-bio">{profile.bio}</p>}
              <div className="profile-badges">
                {profile.verified&&<span className="badge badge-verified">✓ Verifiziert</span>}
                {profile.available&&<span className="badge badge-available">Verfügbar</span>}
                {profile.rating>0&&<span className="badge badge-rating">⭐ {profile.rating}</span>}
                {badge&&<span className="badge" style={{backgroundColor:badge.color}}>{badge.icon} {badge.text}</span>}
              </div>
              <button className="profile-view-button">Profil ansehen</button>
            </div>
          );
        })}
      </div>

      {filteredProfiles.length===0&&<div style={{textAlign:'center',padding:100,color:'#9CA3AF'}}><div style={{fontSize:64,marginBottom:20}}>🔍</div><h3 style={{fontSize:24,marginBottom:10,fontFamily:'"Outfit",sans-serif',fontWeight:700,color:'#4B5563'}}>Keine Helfer gefunden</h3><p style={{fontFamily:'"Outfit",sans-serif',fontSize:16}}>Versuche eine andere Suche oder Stadt</p></div>}

      <div id="map-section" className="map-section">
        <div className="map-container">
          <h2 className="map-title">Helfer auf der Karte</h2>
          <MapView profiles={filteredProfiles}/>
        </div>
      </div>

      <Footer/>

      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          padding: 90px 20px 40px;
        }
        .hero-bg-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80);
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
        }
        .hero-title {
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 12px;
          font-family: "Outfit", sans-serif;
          letter-spacing: -1px;
        }
        .hero-subtitle {
          font-size: 17px;
          margin-bottom: 32px;
          font-family: "Outfit", sans-serif;
          font-weight: 400;
          max-width: 600px;
          margin: 0 auto 32px;
          line-height: 1.5;
          opacity: 0.95;
        }
        .search-container {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
        }
        .search-input {
          width: 100%;
          padding: 18px 60px 18px 24px;
          font-size: 16px;
          border: none;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          outline: none;
          background-color: white;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
          box-sizing: border-box;
        }
        .search-icon {
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 24px;
        }
        .location-text {
          text-align: center;
          margin-top: 20px;
          font-size: 15px;
          font-family: "Outfit", sans-serif;
          font-weight: 500;
          opacity: 0.7;
          color: #4B5563;
        }
        
        .map-button:hover {
          background-color: #1F2937;
          color: white;
        }
        .profile-grid {
          max-width: 1200px;
          margin: 0 auto 20px;
          padding: 0 20px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 28px;
        }
        .profile-card {
          background-color: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s;
          cursor: pointer;
          border: 1px solid #F3F4F6;
          position: relative;
        }
        .profile-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
        }
        .fav-button {
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
        }
        .profile-image {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 20px;
          border: 4px solid #14B8A6;
        }
        .profile-avatar {
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
          margin-bottom: 20px;
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
          margin-bottom: 14px;
          font-family: "Outfit", sans-serif;
        }
        .profile-bio {
          font-size: 14px;
          color: #4B5563;
          line-height: 1.7;
          margin-bottom: 18px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-family: "Outfit", sans-serif;
        }
        .profile-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }
        .badge {
          padding: 6px 12px;
          color: white;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          font-family: "Outfit", sans-serif;
        }
        .badge-verified { background-color: #14B8A6; }
        .badge-available { background-color: #06B6D4; }
        .badge-rating { background-color: #F59E0B; }
        .profile-view-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          font-family: "Outfit", sans-serif;
          box-shadow: 0 4px 12px rgba(20,184,166,0.3);
        }
        .map-section {
          background-color: #F9FAFB;
          padding: 30px 20px;
          border-top: 1px solid #E5E7EB;
        }
        .map-container {
          max-width: 600px;
          margin: 0 auto;
        }
        .map-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
          text-align: center;
        }

        /* MOBILE RESPONSIVE */
        @media (max-width: 768px) {
          .hero-section {
            padding: 80px 16px 30px;
          }
          .hero-title {
            font-size: 28px !important;
          }
          .hero-subtitle {
            font-size: 15px !important;
            padding: 0 10px;
          }
          .search-container {
            padding: 0 10px;
          }
          .search-input {
            padding: 14px 50px 14px 16px !important;
            font-size: 14px !important;
          }
          .search-icon {
            right: 26px !important;
            font-size: 20px !important;
          }
          /* HORIZONTAL SCROLL für Profile Cards */
          .profile-grid {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            gap: 16px !important;
            padding: 0 16px 20px 16px !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            scroll-padding: 0 16px !important;
          }
          .profile-grid::-webkit-scrollbar {
            display: none;
          }
          .profile-card {
            flex: 0 0 85% !important;
            max-width: 350px !important;
            scroll-snap-align: start !important;
            padding: 12px !important;
          }
          .fav-button {
            width: 36px !important;
            height: 36px !important;
            top: 12px !important;
            right: 12px !important;
            font-size: 18px !important;
          }
          .profile-image, .profile-avatar {
            width: 50px !important;
            height: 50px !important;
            margin-bottom: 10px !important;
            font-size: 24px !important;
            border-width: 2px !important;
          }
          .profile-name {
            font-size: 16px !important;
            margin-bottom: 4px !important;
          }
          .profile-job {
            font-size: 13px !important;
            margin-bottom: 6px !important;
          }
          .profile-location {
            font-size: 12px !important;
            margin-bottom: 8px !important;
          }
          .profile-price {
            font-size: 16px !important;
            margin-bottom: 8px !important;
          }
          .profile-bio {
            font-size: 12px !important;
            margin-bottom: 10px !important;
            line-height: 1.5 !important;
            -webkit-line-clamp: 2 !important;
          }
          .profile-badges {
            gap: 4px !important;
            margin-bottom: 10px !important;
          }
          .badge {
            padding: 4px 8px !important;
            font-size: 10px !important;
          }
          .profile-view-button {
            padding: 10px !important;
            font-size: 13px !important;
          }
          .map-section {
            padding: 20px 16px !important;
          }
          .map-container {
            max-width: 95% !important;
            padding: 0 !important;
          }
          .map-title {
            font-size: 18px !important;
            margin-bottom: 16px !important;
          }
          .map-title {
            font-size: 20px;
          }
        }
          .hero-title {
            font-size: 28px !important;
          }
          .hero-subtitle {
            font-size: 15px !important;
            padding: 0 10px;
          }
          .search-container {
            padding: 0 10px;
          }
          .search-input {
            padding: 14px 50px 14px 16px !important;
            font-size: 14px !important;
          }
          .search-icon {
            right: 26px !important;
            font-size: 20px !important;
          }
          .map-button {
            top: 80px;
            right: 16px;
            padding: 8px 16px;
            font-size: 13px;
          }
          .profile-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 0 16px;
          }
          .profile-card {
            padding: 12px !important;
          }
          .fav-button {
            width: 36px !important;
            height: 36px !important;
            top: 12px !important;
            right: 12px !important;
            font-size: 18px !important;
          }
          .profile-image, .profile-avatar {
            width: 50px !important;
            height: 50px !important;
            margin-bottom: 10px !important;
            font-size: 24px !important;
            border-width: 2px !important;
          }
          .profile-name {
            font-size: 16px !important;
            margin-bottom: 4px !important;
          }
          .profile-job {
            font-size: 13px !important;
            margin-bottom: 6px !important;
          }
          .profile-location {
            font-size: 12px !important;
            margin-bottom: 8px !important;
          }
          .profile-price {
            font-size: 16px !important;
            margin-bottom: 8px !important;
          }
          .profile-bio {
            font-size: 12px !important;
            margin-bottom: 10px !important;
            line-height: 1.5 !important;
            -webkit-line-clamp: 2 !important;
          }
          .profile-badges {
            gap: 4px !important;
            margin-bottom: 10px !important;
          }
          .badge {
            padding: 4px 8px !important;
            font-size: 10px !important;
          }
          .profile-view-button {
            padding: 10px !important;
            font-size: 13px !important;
          }
          .map-section {
            padding: 30px 16px;
          }
          .map-title {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default Helperr;
