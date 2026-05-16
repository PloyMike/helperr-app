import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import MapView from './MapView';
import Header from './Header';
import Footer from './Footer';

function Helperr() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [userLocation, setUserLocation] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 200 },
    minRating: 0,
    availableOnly: false
  });

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

  const resetFilters = () => setFilters({ priceRange: { min: 0, max: 200 }, minRating: 0, availableOnly: false });

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

  const cities = ['all', ...new Set(profiles.map(p => p.city).filter(Boolean))];
  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !searchQuery || profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) || profile.job?.toLowerCase().includes(searchQuery.toLowerCase()) || profile.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || profile.city === selectedCity;
    const priceNum = parseInt((profile.price || '0').match(/\d+/)?.[0] || '0');
    const matchesPrice = priceNum >= filters.priceRange.min && priceNum <= filters.priceRange.max;
    const matchesRating = (profile.rating || 0) >= filters.minRating;
    const matchesAvailable = !filters.availableOnly || profile.available;
    return matchesSearch && matchesCity && matchesPrice && matchesRating && matchesAvailable;
  });

  if (loading) {
    return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',fontSize:24,fontWeight:600,fontFamily:'"Outfit",sans-serif'}}>Lädt Profile...</div>;
  }

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div style={{position:'relative',overflow:'hidden',padding:'90px 20px 40px'}}>
        <button onClick={()=>document.getElementById('map-section')?.scrollIntoView({behavior:'smooth'})} style={{position:'absolute',top:90,right:20,zIndex:10,padding:'10px 20px',fontSize:14,fontWeight:600,backgroundColor:'rgba(255,255,255,0.9)',color:'#1F2937',border:'2px solid #1F2937',borderRadius:12,cursor:'pointer',transition:'all 0.3s',fontFamily:'"Outfit",sans-serif',boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}} onMouseOver={(e)=>{e.target.style.backgroundColor='#1F2937';e.target.style.color='white';}} onMouseOut={(e)=>{e.target.style.backgroundColor='rgba(255,255,255,0.9)';e.target.style.color='#1F2937';}}>Zur Karte</button>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.7,zIndex:0}}></div>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(250,250,250,0.9) 100%)',zIndex:1}}></div>
        <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2,color:'#1F2937'}}>
          <div style={{textAlign:'center',marginBottom:20}}>
            <h1 style={{fontSize:42,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}}>Helperr</h1>
            <p style={{fontSize:17,marginBottom:32,fontFamily:'"Outfit",sans-serif',fontWeight:400,maxWidth:600,margin:'0 auto 32px',lineHeight:1.5,opacity:0.95}}>Finde vertrauenswürdige Helfer in deiner Nähe – schnell, einfach, sicher</p>
          </div>
          
          
          <div style={{maxWidth:600,margin:'0 auto',position:'relative'}}>
            <input type="text" placeholder="Suche nach Service, Name oder Stadt..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} style={{width:'100%',padding:'18px 60px 18px 24px',fontSize:16,border:'none',borderRadius:16,boxShadow:'0 10px 40px rgba(0,0,0,0.15)',outline:'none',backgroundColor:'white',color:'#1F2937',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}}/>
            <div style={{position:'absolute',right:24,top:'50%',transform:'translateY(-50%)',fontSize:24}}>🔍</div>
          </div>
          {userLocation && <div style={{textAlign:'center',marginTop:20,fontSize:15,fontFamily:'"Outfit",sans-serif',fontWeight:500,opacity:0.7,color:'#4B5563'}}>📍 Dein Standort wurde erkannt</div>}
        </div>
      </div>

      

      

      

      <div style={{maxWidth:1200,margin:'20px auto',padding:'0 20px',color:'#6B7280',fontWeight:600,fontFamily:'"Outfit",sans-serif',fontSize:16}}>
        {filteredProfiles.length} Helfer gefunden
      </div>

      <div style={{maxWidth:1200,margin:'0 auto 80px',padding:'0 20px',display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:28}}>
        {filteredProfiles.map(profile=>{
          const badge=getBadge(profile);
          return(
            <div key={profile.id} onClick={()=>window.navigateTo('profile',profile)} style={{backgroundColor:'white',borderRadius:20,padding:28,boxShadow:'0 4px 20px rgba(0,0,0,0.08)',transition:'all 0.3s',cursor:'pointer',border:'1px solid #F3F4F6',position:'relative'}} onMouseOver={(e)=>{e.currentTarget.style.transform='translateY(-8px)';e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,0.12)';}} onMouseOut={(e)=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)';}}>
              <button onClick={(e)=>toggleFavorite(profile,e)} style={{position:'absolute',top:20,right:20,background:'white',border:'none',borderRadius:'50%',width:44,height:44,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,cursor:'pointer',boxShadow:'0 4px 12px rgba(0,0,0,0.1)',zIndex:10}}>{favorites.some(f=>f.id===profile.id)?'❤️':'🤍'}</button>
              {profile.image_url?<img src={profile.image_url} alt={profile.name} style={{width:90,height:90,borderRadius:'50%',objectFit:'cover',marginBottom:20,border:'4px solid #14B8A6'}}/>:<div style={{width:90,height:90,borderRadius:'50%',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,fontWeight:700,color:'white',marginBottom:20,fontFamily:'"Outfit",sans-serif'}}>{profile.name?profile.name.charAt(0).toUpperCase():'?'}</div>}
              <h3 style={{fontSize:22,fontWeight:700,marginBottom:8,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>{profile.name||'Unbekannt'}</h3>
              <p style={{fontSize:16,color:'#14B8A6',fontWeight:600,marginBottom:10,fontFamily:'"Outfit",sans-serif'}}>{profile.job||'Keine Angabe'}</p>
              <p style={{fontSize:14,color:'#6B7280',marginBottom:14,fontFamily:'"Outfit",sans-serif'}}>📍 {profile.city||'?'}, {profile.country||'?'}</p>
              <p style={{fontSize:20,fontWeight:700,color:'#F97316',marginBottom:14,fontFamily:'"Outfit",sans-serif'}}>{profile.price||'Preis auf Anfrage'}</p>
              {profile.bio&&<p style={{fontSize:14,color:'#4B5563',lineHeight:1.7,marginBottom:18,display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden',fontFamily:'"Outfit",sans-serif'}}>{profile.bio}</p>}
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:18}}>
                {profile.verified&&<span style={{padding:'6px 12px',backgroundColor:'#14B8A6',color:'white',borderRadius:8,fontSize:12,fontWeight:600,fontFamily:'"Outfit",sans-serif'}}>✓ Verifiziert</span>}
                {profile.available&&<span style={{padding:'6px 12px',backgroundColor:'#06B6D4',color:'white',borderRadius:8,fontSize:12,fontWeight:600,fontFamily:'"Outfit",sans-serif'}}>Verfügbar</span>}
                {profile.rating>0&&<span style={{padding:'6px 12px',backgroundColor:'#F59E0B',color:'white',borderRadius:8,fontSize:12,fontWeight:600,fontFamily:'"Outfit",sans-serif'}}>⭐ {profile.rating}</span>}
                {badge&&<span style={{padding:'6px 12px',backgroundColor:badge.color,color:'white',borderRadius:8,fontSize:12,fontWeight:600,fontFamily:'"Outfit",sans-serif'}}>{badge.icon} {badge.text}</span>}
              </div>
              <button style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',transition:'all 0.3s',fontFamily:'"Outfit",sans-serif',boxShadow:'0 4px 12px rgba(20,184,166,0.3)'}}>Profil ansehen</button>
            </div>
          );
        })}
      </div>

      {filteredProfiles.length===0&&<div style={{textAlign:'center',padding:100,color:'#9CA3AF'}}><div style={{fontSize:64,marginBottom:20}}>🔍</div><h3 style={{fontSize:24,marginBottom:10,fontFamily:'"Outfit",sans-serif',fontWeight:700,color:'#4B5563'}}>Keine Helfer gefunden</h3><p style={{fontFamily:'"Outfit",sans-serif',fontSize:16}}>Versuche eine andere Suche oder Stadt</p></div>}

      
      <div id="map-section" style={{backgroundColor:'#F9FAFB',padding:'40px 20px',borderTop:'1px solid #E5E7EB'}}>
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <h2 style={{fontSize:24,fontWeight:700,marginBottom:20,color:'#1F2937',fontFamily:'"Outfit",sans-serif',textAlign:'center'}}>🗺️ Helfer auf der Karte</h2>
          <MapView profiles={filteredProfiles}/>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default Helperr;
