import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Header from './Header';
import BookingCalendar from './BookingCalendar';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/';
        return;
      }

      // Step 1: Get favorite profile IDs
      const { data: favData, error: favError } = await supabase
        .from('favorites')
        .select('profile_id')
        .eq('user_email', user.email);

      if (favError) throw favError;

      if (!favData || favData.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Step 2: Get full profile data for each favorite
      const profileIds = favData.map(f => f.profile_id);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', profileIds);

      if (profilesError) throw profilesError;

      setFavorites(profiles || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (profileId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_email', user.email)
        .eq('profile_id', profileId);

      if (error) throw error;

      setFavorites(favorites.filter(f => f.id !== profileId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error removing favorite');
    }
  };

  const handleMessageProvider = (email) => {
    localStorage.setItem('helperr_message_to', email);
    window.navigateTo('messages');
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.loading}>Loading favorites...</div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header />
      
      <div style={styles.container}>
        <h1 style={styles.title}>❤️ My Favorites</h1>

        {favorites.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 64 }}>💔</div>
            <h3>No favorites yet</h3>
            <p>Click the heart icon on any profile to add them to your favorites</p>
            <button onClick={() => window.navigateTo('home')} style={styles.btnPrimary}>
              Browse Experts
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {favorites.map(profile => (
              <div key={profile.id} style={styles.card}>
                <button
                  onClick={() => removeFavorite(profile.id)}
                  style={styles.removeBtn}
                  title="Remove from favorites"
                >
                  ❤️
                </button>

                <div onClick={() => setSelected(profile)} style={{ cursor: 'pointer' }}>
                  <div style={styles.cardTop}>
                    {profile.image_url && profile.image_url.startsWith('http') ? (
                      <img src={profile.image_url} alt={profile.name} style={styles.cardAvatar} />
                    ) : (
                      <div style={styles.cardAvatar}>{profile.image_url || '👤'}</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <h3 style={styles.cardName}>{profile.name}</h3>
                        {profile.verified && <span style={styles.verified}>✓</span>}
                      </div>
                      <p style={styles.cardSub}>{profile.subcategory || profile.category}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                        <span style={{ color: '#f59e0b' }}>⭐</span>
                        <span style={{ fontSize: 12, color: '#6b7280' }}>
                          {profile.rating} · {profile.review_count} reviews
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={styles.price}>{profile.price}</div>
                      <div style={{
                        fontSize: 11,
                        color: profile.available ? '#059669' : '#dc2626',
                        marginTop: 4,
                        fontWeight: 600
                      }}>
                        {profile.available ? '● Available' : '● Busy'}
                      </div>
                    </div>
                  </div>

                  <p style={styles.cardBio}>{profile.bio?.slice(0, 100)}...</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                    {profile.tags?.slice(0, 4).map(tag => (
                      <span key={tag} style={styles.tag}>{tag}</span>
                    ))}
                  </div>

                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid #f3f4f6' }}>
                    <span style={styles.locationBadge}>📍 {profile.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                  💬 Message
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
                  📅 Book Now
                </button>
              </div>
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

const styles = {
  page: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', paddingTop: 80 },
  loading: { minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  container: { maxWidth: 1200, margin: '0 auto', padding: '40px 20px' },
  title: { fontSize: 32, fontWeight: 800, marginBottom: 32, color: '#111827' },
  empty: { textAlign: 'center', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  btnPrimary: { background: '#065f46', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 24px', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 },
  card: { position: 'relative', background: '#fff', borderRadius: 16, padding: 24, border: '1.5px solid #e5e7eb', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  removeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'white',
    border: 'none',
    borderRadius: '50%',
    width: 40,
    height: 40,
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    zIndex: 10,
    color: '#dc2626'
  },
  cardTop: { display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 },
  cardAvatar: { width: 80, height: 80, background: '#ecfdf5', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, objectFit: 'cover', flexShrink: 0 },
  cardName: { margin: 0, fontSize: 17, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardSub: { margin: '4px 0 0', fontSize: 13, color: '#6b7280' },
  cardBio: { fontSize: 13, color: '#6b7280', lineHeight: 1.5, margin: 0 },
  price: { fontSize: 16, fontWeight: 700, color: '#065f46' },
  locationBadge: { fontSize: 12, color: '#6b7280', background: '#f3f4f6', borderRadius: 8, padding: '4px 10px', fontWeight: 500 },
  verified: { background: '#d1fae5', color: '#065f46', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 10, flexShrink: 0 },
  tag: { background: '#f3f4f6', color: '#374151', fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 500 },
  modalBackdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { background: '#fff', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', position: 'relative' },
  closeBtn: { position: 'absolute', top: 16, right: 16, background: '#f3f4f6', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', fontSize: 14 }
};

export default FavoritesPage;
