import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Header from './Header';

function Helperr() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selected, setSelected] = useState(null);

  const CATEGORIES = ['All', 'Massage & Wellness', 'Tours & Adventures', 'Yoga & Fitness', 'Cooking Classes', 'Diving & Water Sports', 'Photography'];

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = profiles.filter(p => {
    const matchSearch = !search || 
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.job?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'All' || p.category === category;
    const matchAvail = !onlyAvailable || p.available;
    return matchSearch && matchCat && matchAvail;
  });

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <h2>Loading experts...</h2>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header />

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.heroEyebrow}>🌴 Koh Samui, Thailand</p>
          <h1 style={styles.heroTitle}>Find Local Experts</h1>
          <p style={styles.heroSub}>Book verified local guides, instructors & service providers</p>

          {/* Search */}
          <div style={styles.searchWrap}>
            <span style={{ fontSize: 18 }}>🔍</span>
            <input
              style={styles.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, skill, or keyword..."
            />
            {search && (
              <button onClick={() => setSearch('')} style={styles.clearBtn}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* FILTERS */}
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

      {/* RESULTS */}
      <div style={styles.results}>
        <p style={styles.resultCount}>
          {filtered.length} expert{filtered.length !== 1 ? 's' : ''} found
          {category !== 'All' ? ` in "${category}"` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>

        {filtered.length === 0 ? (
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
          <div style={styles.grid}>
            {filtered.map(p => (
              <div key={p.id} onClick={() => setSelected(p)} style={styles.card}>
                <div style={styles.cardTop}>
                  {p.image_url && p.image_url.startsWith('http') ? (
                    <img src={p.image_url} alt={p.name} style={{...styles.cardAvatar, fontSize: 'inherit', objectFit: 'cover'}} />
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
                    <div style={{
                      fontSize: 11,
                      color: p.available ? '#059669' : '#dc2626',
                      marginTop: 4,
                      fontWeight: 600
                    }}>
                      {p.available ? '● Available' : '● Busy'}
                    </div>
                  </div>
                </div>
                <p style={styles.cardBio}>{p.bio.slice(0, 100)}...</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  {p.tags?.slice(0, 3).map(tag => (
                    <span key={tag} style={styles.tag}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <span style={styles.locationBadge}>📍 {p.city}</span>
                  <span style={styles.viewProfile}>View Profile →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
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
              <div style={{ marginTop: 20, padding: 16, background: '#f9fafb', borderRadius: 12 }}>
                <p style={{ margin: 0, fontSize: 14 }}>📞 {selected.phone}</p>
                {selected.line_id && <p style={{ margin: '8px 0 0', fontSize: 14 }}>💬 LINE: {selected.line_id}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh' },
  loading: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 100%)', padding: '48px 20px 64px', clipPath: 'ellipse(120% 100% at 50% 0%)' },
  heroInner: { maxWidth: 700, margin: '0 auto', textAlign: 'center' },
  heroEyebrow: { color: '#a7f3d0', fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' },
  heroTitle: { color: '#fff', fontSize: 52, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' },
  heroSub: { color: '#d1fae5', fontSize: 16, margin: '0 0 32px', lineHeight: 1.6 },
  searchWrap: { background: '#fff', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
  searchInput: { border: 'none', outline: 'none', fontSize: 16, flex: 1, background: 'transparent', color: '#111827' },
  clearBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 18 },
  filtersWrap: { background: '#fff', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  filters: { maxWidth: 1100, margin: '0 auto', padding: '12px 20px', display: 'flex', gap: 8, alignItems: 'center', overflowX: 'auto' },
  filterBtn: { background: 'none', border: '1.5px solid #e5e7eb', borderRadius: 20, padding: '7px 16px', fontSize: 13, fontWeight: 500, color: '#6b7280', cursor: 'pointer', whiteSpace: 'nowrap' },
  filterBtnActive: { background: '#065f46', borderColor: '#065f46', color: '#fff' },
  availToggle: { marginLeft: 'auto', fontSize: 13, color: '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  results: { maxWidth: 1100, margin: '0 auto', padding: '24px 20px 60px' },
  resultCount: { color: '#6b7280', fontSize: 14, marginBottom: 20 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 },
  card: { background: '#fff', borderRadius: 16, padding: 20, cursor: 'pointer', border: '1.5px solid #e5e7eb', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  cardTop: { display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 },
  cardAvatar: { width: 52, height: 52, background: '#ecfdf5', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 },
  cardName: { margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' },
  cardSub: { margin: '4px 0 0', fontSize: 13, color: '#6b7280' },
  cardBio: { margin: 0, fontSize: 13, color: '#6b7280', lineHeight: 1.6 },
  price: { fontSize: 15, fontWeight: 700, color: '#065f46' },
  locationBadge: { fontSize: 12, color: '#6b7280', background: '#f3f4f6', borderRadius: 8, padding: '4px 8px' },
  viewProfile: { fontSize: 13, color: '#065f46', fontWeight: 600 },
  verified: { background: '#d1fae5', color: '#065f46', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 10 },
  tag: { background: '#f3f4f6', color: '#374151', fontSize: 12, padding: '4px 10px', borderRadius: 20, fontWeight: 500 },
  empty: { textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 },
  btnPrimary: { background: '#065f46', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  modalBackdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { background: '#fff', borderRadius: 20, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', position: 'relative' },
  closeBtn: { position: 'absolute', top: 16, right: 16, background: '#f3f4f6', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', fontSize: 14 }
};

export default Helperr;
