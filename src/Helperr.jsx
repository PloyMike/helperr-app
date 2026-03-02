import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import MapView from './MapView';
import Header from './Header';
import Footer from './Footer';

function Helperr() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200);
  const [selectedCity, setSelectedCity] = useState('');
  const [minRating, setMinRating] = useState(0);
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

  const uniqueCities = [...new Set(profiles.map(p => p.city).filter(Boolean))].sort();

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !searchQuery || 
      profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      profile.job?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      profile.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const priceMatch = profile.price?.match(/\d+/);
    const profilePrice = priceMatch ? parseInt(priceMatch[0]) : 0;
    const matchesPrice = profilePrice >= priceMin && profilePrice <= priceMax;
    
    const matchesCity = !selectedCity || profile.city === selectedCity;
    const matchesRating = (profile.rating || 0) >= minRating;
    
    return matchesSearch && matchesPrice && matchesCity && matchesRating;
  });

  const resetFilters = () => {
    setPriceMin(0);
    setPriceMax(200);
    setSelectedCity('');
    setMinRating(0);
    setSearchQuery('');
  };

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
              <div className="card-footer">
                <div className="location-row"><span className="icon">📍</span><span className="text">{profile.city}, {profile.country}</span></div>
                <div className="price-row"><span className="icon">💰</span><span className="text price">{profile.price||'Auf Anfrage'}</span></div>
                <div className="rating-row"><span className="icon">⭐</span><span className="text">{profile.rating?profile.rating.toFixed(1):'Neu'}</span>{profile.review_count>0&&<span className="review-count">({profile.review_count})</span>}</div>
              </div>
              {badge&&<div className="badge" style={{backgroundColor:badge.color}}><span className="badge-icon">{badge.icon}</span><span className="badge-text">{badge.text}</span></div>}
            </div>
          );
        })}
      </div>

      <div className="filters-wrapper">
        <div className="advanced-filters">
          <div className="filter-section">
            <label className="filter-label">Preis pro Stunde</label>
            <div className="price-inputs">
              <input type="number" value={priceMin} onChange={(e)=>setPriceMin(Number(e.target.value))} min="0" max="200" className="price-input" placeholder="Min €"/>
              <span className="price-separator">-</span>
              <input type="number" value={priceMax} onChange={(e)=>setPriceMax(Number(e.target.value))} min="0" max="200" className="price-input" placeholder="Max €"/>
            </div>
          </div>
          
          <div className="filter-section">
            <label className="filter-label">Stadt</label>
            <select value={selectedCity} onChange={(e)=>setSelectedCity(e.target.value)} className="city-select">
              <option value="">Alle Städte</option>
              {uniqueCities.map(city=><option key={city} value={city}>{city}</option>)}
            </select>
          </div>
          
          <div className="filter-section">
            <label className="filter-label">Mindestbewertung</label>
            <div className="rating-buttons">
              {[0,3,4,4.5].map(rating=>(
                <button key={rating} onClick={()=>setMinRating(rating)} className={`rating-btn ${minRating===rating?'active':''}`}>
                  {rating===0?'Alle':rating+'⭐'}
                </button>
              ))}
            </div>
          </div>
          
          <button onClick={resetFilters} className="reset-filters-btn">
            Filter zurücksetzen
          </button>
        </div>
      </div>

      <div id="map-section" style={{marginTop:40,maxWidth:1200,margin:'40px auto',padding:'0 20px'}}><MapView profiles={profiles} userLocation={userLocation}/></div>
      <Footer/>

      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          padding: 100px 20px 80px;
        }
        .hero-bg-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&q=80');
          background-size: cover;
          background-position: center;
          opacity: 0.6;
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
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .hero-title {
          font-size: 56px;
          font-weight: 800;
          color: #1F2937;
          margin-bottom: 16px;
          font-family: "Outfit", sans-serif;
          letter-spacing: -2px;
        }
        .hero-subtitle {
          font-size: 20px;
          color: #4B5563;
          margin-bottom: 40px;
          font-family: "Outfit", sans-serif;
          font-weight: 400;
          line-height: 1.6;
        }
        .search-container {
          position: relative;
          max-width: 600px;
          margin: 0 auto;
        }
        .search-input {
          width: 100%;
          padding: 18px 60px 18px 24px;
          border: 2px solid #E5E7EB;
          border-radius: 16px;
          font-size: 16px;
          outline: none;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          box-sizing: border-box;
        }
        .search-input:focus {
          border-color: #14B8A6;
          box-shadow: 0 8px 20px rgba(20,184,166,0.2);
        }
        .search-icon {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 24px;
        }
        .location-text {
          text-align: center;
          margin-top: 16px;
          font-size: 14px;
          color: #14B8A6;
          font-weight: 600;
          font-family: "Outfit", sans-serif;
        }
        
        .profile-grid {
          max-width: 1200px;
          margin: 0 auto 60px;
          padding: 0 20px;
          display: flex;
          overflow-x: auto;
          gap: 24px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .profile-grid::-webkit-scrollbar {
          display: none;
        }
        
        .profile-card {
          min-width: 320px;
          flex-shrink: 0;
          scroll-snap-align: start;
          background: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
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
          transition: all 0.2s;
        }
        .fav-button:hover {
          transform: scale(1.1);
        }
        .profile-image {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 16px;
          margin-bottom: 20px;
        }
        .profile-avatar {
          width: 100%;
          height: 220px;
          border-radius: 16px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
          font-weight: 700;
          color: white;
          margin-bottom: 20px;
          font-family: "Outfit", sans-serif;
        }
        .profile-name {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .profile-job {
          font-size: 16px;
          color: #14B8A6;
          font-weight: 600;
          margin-bottom: 20px;
          font-family: "Outfit", sans-serif;
        }
        .card-footer {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .location-row, .price-row, .rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .icon {
          font-size: 16px;
        }
        .text {
          font-size: 15px;
          color: #6B7280;
          font-family: "Outfit", sans-serif;
        }
        .text.price {
          font-weight: 700;
          color: #F97316;
          font-size: 16px;
        }
        .review-count {
          font-size: 13px;
          color: #9CA3AF;
          margin-left: 4px;
        }
        .badge {
          position: absolute;
          top: 20px;
          left: 20px;
          padding: 8px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .badge-icon {
          font-size: 16px;
        }
        .badge-text {
          font-size: 13px;
          font-weight: 700;
          color: white;
          font-family: "Outfit", sans-serif;
        }

        .filters-wrapper {
          max-width: 1200px;
          margin: 0 auto 40px;
          padding: 0 20px;
        }
        .advanced-filters {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          align-items: end;
        }
        .filter-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .filter-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          font-family: "Outfit", sans-serif;
        }
        .price-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .price-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 14px;
          font-family: "Outfit", sans-serif;
          outline: none;
          transition: all 0.2s;
        }
        .price-input:focus {
          border-color: #14B8A6;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
        }
        .price-separator {
          color: #9CA3AF;
          font-weight: 600;
        }
        .city-select {
          padding: 10px 14px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 14px;
          font-family: "Outfit", sans-serif;
          outline: none;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .city-select:focus {
          border-color: #14B8A6;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
        }
        .rating-buttons {
          display: flex;
          gap: 8px;
        }
        .rating-btn {
          flex: 1;
          padding: 10px;
          border: 1px solid #E5E7EB;
          background: white;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: "Outfit", sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .rating-btn:hover {
          border-color: #14B8A6;
          background: #F0FDFA;
        }
        .rating-btn.active {
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border-color: #14B8A6;
        }
        .reset-filters-btn {
          padding: 10px 20px;
          background: #F3F4F6;
          color: #374151;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          font-family: "Outfit", sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .reset-filters-btn:hover {
          background: #E5E7EB;
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 80px 16px 60px;
          }
          .hero-title {
            font-size: 36px;
            margin-bottom: 12px;
          }
          .hero-subtitle {
            font-size: 16px;
            margin-bottom: 30px;
          }
          .search-input {
            padding: 16px 50px 16px 20px;
            font-size: 15px;
          }
          .search-icon {
            right: 16px;
            font-size: 20px;
          }
          .profile-grid {
            padding: 0 16px;
            margin-bottom: 40px;
          }
          .profile-card {
            min-width: 280px;
            padding: 24px;
          }
          .profile-image, .profile-avatar {
            height: 180px;
          }
          .profile-avatar {
            font-size: 60px;
          }
          .profile-name {
            font-size: 22px;
          }
          .profile-job {
            font-size: 15px;
          }
          .fav-button {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }
          .filters-wrapper {
            margin: 0 auto 30px;
            padding: 0 16px;
          }
          .advanced-filters {
            grid-template-columns: 1fr;
            padding: 16px;
            gap: 16px;
          }
          .rating-buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default Helperr;
