import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import Header from './Header';
import ReviewsSection from './ReviewsSection';
import BookingCalendar from './BookingCalendar';

function Helperr() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const [userCountry, setUserCountry] = useState(null);
  const [locationError, setLocationError] = useState(false);

  const CATEGORIES = ['All', 'Massage & Wellness', 'Tours & Adventures', 'Yoga & Fitness', 'Cooking Classes', 'Diving & Water Sports', 'Photography'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (selected) {
      // Lock body scroll when modal opens
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selected]);

  useEffect(() => {
    fetchProfiles();
    fetchUserCity();
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setUserLocation({ lat, lng });
          
          // Get city from GPS coordinates for ALL users
          getCityFromCoordinates(lat, lng);
        },
        (error) => {
          console.log('Location error:', error);
          setLocationError(true);
        }
      );
    }
  }, []);

  
  const getCityFromCoordinates = async (lat, lng) => {
    try {
      // Using BigDataCloud free API (no key required)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      
      if (data.city || data.locality) {
        const city = data.city || data.locality;
        const country = data.countryName;
        
        console.log('Detected location:', city, country);
        setUserCity(city);
        setUserCountry(country);
      }
    } catch (error) {
      console.log('Reverse geocoding error:', error);
    }
  };

  const fetchUserCity = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('city, country')
          .eq('email', user.email)
          .single();
        
        if (data?.city) {
          setUserCity(data.city);
        }
        if (data?.country) {
          setUserCountry(data.country);
        }
      }
    } catch (error) {
      console.log('Could not fetch user city:', error);
    }
  };

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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 999;
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const profilesWithDistance = profiles.map(profile => {
    let distance = 999;
    
    // Same city = 0 km (top priority)
    if (userCity && profile.city && profile.city.toLowerCase() === userCity.toLowerCase()) {
      distance = 0;
    } 
    // Different city but has GPS = calculate real distance
    else if (userLocation && profile.latitude && profile.longitude) {
      distance = calculateDistance(userLocation.lat, userLocation.lng, profile.latitude, profile.longitude);
    }
    // No GPS data = far away
    else {
      distance = 999;
    }
    
    return {
      ...profile,
      distance,
      sameCity: userCity && profile.city && profile.city.toLowerCase() === userCity.toLowerCase()
    };
  });

  const filteredProfiles = profilesWithDistance.filter(profile => {
    const matchesSearch = !search || 
      profile.name?.toLowerCase().includes(search.toLowerCase()) || 
      profile.job?.toLowerCase().includes(search.toLowerCase()) || 
      profile.city?.toLowerCase().includes(search.toLowerCase()) ||
      profile.category?.toLowerCase().includes(search.toLowerCase()) ||
      profile.subcategory?.toLowerCase().includes(search.toLowerCase()) ||
      profile.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
      profile.bio?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCat = category === 'All' || profile.category === category;
    const matchesAvail = !onlyAvailable || profile.available;
    
    return matchesSearch && matchesCat && matchesAvail;
  });

  // Group by country, then by city
  const countriesMap = {};
  filteredProfiles.forEach(p => {
    const country = p.country || 'Unknown';
    const city = p.city || 'Unknown';
    
    if (!countriesMap[country]) {
      countriesMap[country] = {};
    }
    if (!countriesMap[country][city]) {
      countriesMap[country][city] = [];
    }
    countriesMap[country][city].push(p);
  });

  // Sort countries: user's country first, then by total provider count
  const sortedCountries = Object.keys(countriesMap).sort((a, b) => {
    if (userCountry && a === userCountry) return -1;
    if (userCountry && b === userCountry) return 1;
    
    const aTotal = Object.values(countriesMap[a]).flat().length;
    const bTotal = Object.values(countriesMap[b]).flat().length;
    return bTotal - aTotal;
  });

  // Create sorted cities array grouped by country
  const sortedCities = [];
  sortedCountries.forEach(country => {
    const cities = Object.keys(countriesMap[country]).sort((a, b) => {
      // User's city first within their country
      if (userCity && a.toLowerCase() === userCity.toLowerCase()) return -1;
      if (userCity && b.toLowerCase() === userCity.toLowerCase()) return 1;
      // Then by provider count
      return countriesMap[country][b].length - countriesMap[country][a].length;
    });
    
    cities.forEach(city => {
      sortedCities.push({
        country,
        city,
        providers: countriesMap[country][city],
        isUserCountry: userCountry && country === userCountry,
        isUserCity: userCity && city.toLowerCase() === userCity.toLowerCase()
      });
    });
  });

  const trackProfileView = async (profileId) => {
    try {
      // Get or create session ID
      let sessionId = localStorage.getItem('helperr_session_id');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('helperr_session_id', sessionId);
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('profile_views').insert({
        profile_id: profileId,
        viewer_email: user?.email || null,
        session_id: sessionId
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const handleMessageProvider = (email) => {
    localStorage.setItem('helperr_message_to', email);
    window.navigateTo('messages');
  };

  if (loading) {
    return <div style={styles.loading}><div style={{ fontSize: 48 }}>🔍</div><h2>Loading experts...</h2></div>;
  }

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header transparent={true} isScrolled={isScrolled} />

      <div style={styles.hero}>
        <div style={styles.heroGlow1}></div>
        <div style={styles.heroGlow2}></div>
        <div style={styles.heroInner}>
          <h1 style={{
            ...styles.heroTitle,
            fontSize: window.innerWidth <= 768 ? 36 : 60,
            fontWeight: window.innerWidth <= 768 ? 700 : 800
          }}>Find Local Experts</h1>
          <p style={styles.heroSub}>Book verified local guides, instructors & service providers</p>
          {userLocation && !locationError && (
            <p style={{ color: '#d1fae5', fontSize: 14, margin: '8px 0 0' }}>
              📍 Showing results near you
            </p>
          )}

          <div style={styles.searchWrap}>
            <span style={{ fontSize: 18 }}>🔍</span>
            <input
              style={styles.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, location, skills, category, service..."
            />
            {search && (
              <button onClick={() => setSearch('')} style={styles.clearBtn}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div style={styles.filtersWrap}>
        <div style={styles.filters}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                ...styles.filterBtn,
                ...(category === cat ? styles.filterBtnActive : {})
              }}
            >
              {cat}
            </button>
          ))}
          <label style={styles.availToggle}>
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={e => setOnlyAvailable(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            Available only
          </label>
        </div>
      </div>

      <div style={styles.results}>
        

        {filteredProfiles.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>🔎</div>
            <h3>No results found</h3>
            <p>Try a different search or category</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setOnlyAvailable(false); }}
              style={styles.btnPrimary}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {sortedCities.map((cityData, index) => {
              const { country, city, providers, isUserCity, isUserCountry } = cityData;
              
              // Show country header for first city in each country
              const isFirstInCountry = index === 0 || sortedCities[index - 1].country !== country;
              
              return (
                <div key={`${country}-${city}`}>
                  {isFirstInCountry && (
                    <div style={{
                      padding: '20px 0 12px 0',
                      fontSize: 18,
                      fontWeight: 700,
                      color: isUserCountry ? '#059669' : '#374151',
                      borderTop: index > 0 ? '2px solid #e5e7eb' : 'none',
                      marginTop: index > 0 ? 24 : 0
                    }}>
                      {country}
                    </div>
                  )}
                  
                  {providers.length > 0 && (
                    <DistanceRow
                      title={isUserCity ? 'Near Me - ' + city : city}
                      profiles={providers}
                      onSelect={(profile) => { setSelected(profile); trackProfileView(profile.id); }}
                    />
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={styles.modalBackdrop}>
          <div onClick={e => e.stopPropagation()} style={styles.modal}>
            <button onClick={() => setSelected(null)} style={styles.closeBtn}>✕</button>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                {selected.image_url && selected.image_url.startsWith('http') ? (
                  <img src={selected.image_url} alt={selected.name} style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: 64 }}>{selected.image_url || '👤'}</div>
                )}
                <div>
                  <h2 style={{ margin: 0, fontSize: 24 }}>{selected.name}</h2>
                  <p style={{ color: '#6b7280', margin: '4px 0' }}>{selected.subcategory}</p>
                  {selected.distance < 999 && (
                    <p style={{ color: '#065f46', fontSize: 13, fontWeight: 600, margin: '4px 0' }}>
                      📍 {selected.distance.toFixed(1)} km away
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                    {selected.languages?.map(lang => (
                      <span key={lang} style={styles.tag}>{lang}</span>
                    ))}
                  </div>
                </div>
              </div>
              <p style={{ lineHeight: 1.7 }}>{selected.bio}</p>
              <div style={{ marginTop: 20 }}>
                <h4>Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selected.tags?.map(tag => (
                    <span key={tag} style={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button 
                  onClick={() => handleMessageProvider(selected.email)} 
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'white',
                    color: '#065f46',
                    border: '2px solid #065f46',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: '"Outfit", sans-serif'
                  }}
                >
                  Message Provider
                </button>
                <button 
                  onClick={() => setShowBooking(true)} 
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: '"Outfit", sans-serif',
                    boxShadow: '0 4px 12px rgba(6,95,70,0.3)'
                  }}
                >
                  Book Now
                </button>
              </div>

              <ReviewsSection profileId={selected.id} onReviewAdded={() => fetchProfiles()} />
            </div>
          </div>
        </div>
      )}

      {showBooking && selected && (
        <BookingCalendar 
          profile={selected} 
          onClose={() => setShowBooking(false)} 
        />
      )}
    </div>
  );
}

function DistanceRow({ title, profiles, onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div style={styles.distanceRow}>
      <div style={styles.rowHeader}>
        <div style={styles.rowTitleBadge}>{title}</div>
        <div style={styles.rowNav}>
          <button onClick={() => scroll('left')} style={styles.navBtn}>←</button>
          <button onClick={() => scroll('right')} style={styles.navBtn}>→</button>
        </div>
      </div>
      <div ref={scrollRef} style={styles.slider}>
        {profiles.map((p, index) => (
          <div key={p.id} onClick={() => onSelect(p)} style={{
            ...styles.card,
            boxShadow: `0 ${6 + (p.id?.charCodeAt(0) || 0) % 10}px ${16 + (p.id?.charCodeAt(1) || 0) % 16}px rgba(0, 0, 0, ${0.06 + ((p.id?.charCodeAt(2) || 0) % 5) * 0.01})`
          }}>
            <div style={styles.cardTop}>
              {p.image_url && p.image_url.startsWith('http') ? (
                <img src={p.image_url} alt={p.name} style={styles.cardAvatar} />
              ) : (
                <div style={styles.cardAvatar}>{p.image_url || '👤'}</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <h3 style={styles.cardName}>{p.name}</h3>
                  {p.verified && <span style={styles.verified}>✓</span>}
                </div>
                <p style={styles.cardSub}>{p.subcategory || p.category}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <span style={{ color: '#f59e0b' }}>⭐</span>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    {p.rating} · {p.review_count} reviews
                  </span>
                </div>
              </div>
              
            </div>
            
            <p style={styles.cardBio}>{p.bio?.slice(0, 150)}...</p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {p.tags?.slice(0, 4).map(tag => (
                <span key={tag} style={styles.tag}>{tag}</span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTop: '1px solid #f3f4f6' }}>
              <span style={styles.locationBadge}>📍 {p.city}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={styles.price}>{p.price}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  heroGlow1: {
    position: 'absolute',
    top: '-50%',
    right: '-10%',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(60px)',
    pointerEvents: 'none'
  },
  heroGlow2: {
    position: 'absolute',
    bottom: '-30%',
    left: '-5%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(6, 95, 70, 0.4) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none'
  },
  app: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh' },
  loading: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  hero: { 
    background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 70%, #14b8a6 100%)', 
    padding: '100px 20px 64px', 
    position: 'relative',
    overflow: 'hidden',
    clipPath: 'ellipse(120% 100% at 50% 0%)'
  },
  heroInner: { maxWidth: 700, margin: '0 auto', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: 52, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' },
  heroSub: { color: '#d1fae5', fontSize: 16, margin: '0 0 8px', lineHeight: 1.6 },
  searchWrap: { background: '#fff', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.15)', marginTop: 24 },
  searchInput: { border: 'none', outline: 'none', fontSize: 16, flex: 1, background: 'transparent', color: '#111827' },
  clearBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 18 },
  filtersWrap: { background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  filters: { maxWidth: 1400, margin: '0 auto', padding: '12px 20px', display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto' },
  filterBtn: { background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 20, padding: '7px 16px', fontSize: 13, fontWeight: 500, color: '#6b7280', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', transition: 'all 0.2s' },
  filterBtnActive: { background: '#065f46', borderColor: '#065f46', color: '#fff', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)', transform: 'translateY(-1px)' },
  availToggle: { marginLeft: 'auto', fontSize: 13, color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', background: '#fff', padding: '7px 16px', borderRadius: 20, border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' },
  results: { maxWidth: 1400, margin: '0 auto', padding: '24px 20px 60px' },
  resultCount: { color: '#6b7280', fontSize: 14, marginBottom: 20 },
  distanceRow: { marginBottom: 40 },
  rowHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  rowTitleBadge: { 
    fontSize: 12, 
    fontWeight: 600, 
    color: '#065f46', 
    background: '#ecfdf5', 
    padding: '6px 14px', 
    borderRadius: 20,
    letterSpacing: '0.02em',
    textTransform: 'uppercase'
  },
  rowNav: { display: 'flex', gap: 8 },
  navBtn: { width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#6b7280', transition: 'all 0.2s' },
  slider: { display: 'flex', gap: 16, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: 8 },
  card: { minWidth: 300, maxWidth: 300, background: '#fff', borderRadius: 16, padding: 16, cursor: 'pointer', border: '1.5px solid #e5e7eb', transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)' },
  cardTop: { display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 },
  cardAvatar: { width: 80, height: 80, background: '#ecfdf5', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, objectFit: 'cover', flexShrink: 0 },
  cardName: { margin: 0, fontSize: 17, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardSub: { margin: '4px 0 0', fontSize: 13, color: '#6b7280' },
  cardBio: { fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0, minHeight: 70 },
  price: { fontSize: 16, fontWeight: 700, color: '#065f46' },
  locationBadge: { fontSize: 12, color: '#6b7280', background: '#f3f4f6', borderRadius: 8, padding: '4px 10px', fontWeight: 500 },
  verified: { background: '#d1fae5', color: '#065f46', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 10, flexShrink: 0 },
  tag: { background: '#f3f4f6', color: '#374151', fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 500 },
  empty: { textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
  btnPrimary: { background: '#065f46', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  modalBackdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { background: '#fff', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' },
  closeBtn: { position: 'absolute', top: 16, right: 16, background: '#f3f4f6', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', fontSize: 14 }
};

export default Helperr;
