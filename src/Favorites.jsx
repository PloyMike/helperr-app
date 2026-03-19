import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import Header from './Header';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    const saved = localStorage.getItem('helperr_favorites');
    const favs = saved ? JSON.parse(saved) : [];
    setFavorites(favs);

    if (favs.length > 0) {
      const ids = favs.map(f => f.id);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .in('id', ids);
      setProfiles(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFavorites();
    
    const handleStorageChange = () => {
      fetchFavorites();
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [fetchFavorites]);

  const removeFavorite = (profileId) => {
    const updated = favorites.filter(f => f.id !== profileId);
    localStorage.setItem('helperr_favorites', JSON.stringify(updated));
    setFavorites(updated);
    setProfiles(profiles.filter(p => p.id !== profileId));
  };

  if (loading) {
    return (
      <div style={styles.app}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Header />
        <div style={styles.loading}>
          <div style={{ fontSize: 48 }}>⭐</div>
          <h2>Loading favorites...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header />

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>My Favorites</h1>
          <p style={styles.heroSub}>Your saved providers - quick access anytime</p>
        </div>
      </div>

      <div style={styles.container}>
        {profiles.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>⭐</div>
            <h3>No favorites yet</h3>
            <p>Start adding providers to your favorites for quick access</p>
            <button onClick={() => window.navigateTo('home')} style={styles.btnPrimary}>
              Browse Providers
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {profiles.map(p => (
              <div key={p.id} style={styles.card}>
                <div style={styles.cardTop}>
                  {p.image_url && p.image_url.startsWith('http') ? (
                    <img src={p.image_url} alt={p.name} style={styles.cardAvatarImg} />
                  ) : (
                    <div style={styles.cardAvatar}>{p.image_url || '👤'}</div>
                  )}
                  <div style={{ flex: 1 }}>
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
                  <div style={{ textAlign: 'right' }}>
                    <div style={styles.price}>{p.price}</div>
                    <button
                      onClick={() => removeFavorite(p.id)}
                      style={styles.removeBtn}
                    >
                      ❤️
                    </button>
                  </div>
                </div>

                <p style={styles.cardBio}>{p.bio?.slice(0, 100)}...</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {p.tags?.slice(0, 3).map(tag => (
                    <span key={tag} style={styles.tag}>{tag}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button
                    onClick={() => window.navigateTo('home')}
                    style={styles.btnSecondary}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => window.navigateTo('home')}
                    style={styles.btnPrimary}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  app: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', paddingTop: 80 },
  loading: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 100%)', padding: '40px 20px', marginBottom: 40 },
  heroInner: { maxWidth: 1100, margin: '0 auto', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' },
  heroSub: { color: '#d1fae5', fontSize: 16, margin: 0 },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 20px 60px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 },
  card: { background: 'white', borderRadius: 16, padding: 20, border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  cardTop: { display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 },
  cardAvatar: { width: 52, height: 52, background: '#ecfdf5', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 },
  cardAvatarImg: { width: 52, height: 52, borderRadius: 14, objectFit: 'cover', flexShrink: 0 },
  cardName: { margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' },
  cardSub: { margin: '4px 0 0', fontSize: 13, color: '#6b7280' },
  cardBio: { margin: 0, fontSize: 13, color: '#6b7280', lineHeight: 1.6 },
  price: { fontSize: 15, fontWeight: 700, color: '#065f46', marginBottom: 8 },
  removeBtn: { background: '#fee2e2', border: 'none', padding: '6px 10px', borderRadius: 8, fontSize: 16, cursor: 'pointer' },
  verified: { background: '#d1fae5', color: '#065f46', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 10 },
  tag: { background: '#f3f4f6', color: '#374151', fontSize: 12, padding: '4px 10px', borderRadius: 20, fontWeight: 500 },
  empty: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  btnPrimary: { flex: 1, padding: '10px 16px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  btnSecondary: { flex: 1, padding: '10px 16px', background: 'white', color: '#065f46', border: '2px solid #065f46', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' }
};

export default Favorites;
