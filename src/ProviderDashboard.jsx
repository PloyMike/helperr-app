import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';

function ProviderDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0
  });

  const fetchDashboard = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile(profileData);

        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('*')
          .eq('profile_id', profileData.id);

        const totalBookings = bookingsData?.length || 0;
        const pendingBookings = bookingsData?.filter(b => b.status === 'pending').length || 0;
        const confirmedBookings = bookingsData?.filter(b => b.status === 'confirmed').length || 0;

        setStats({
          totalBookings,
          pendingBookings,
          confirmedBookings,
          totalRevenue: 0
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (!user) {
    return (
      <div style={styles.app}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Header transparent={true} />
        <div style={styles.loginRequired}>
          <div style={{ fontSize: 64 }}>🔐</div>
          <h2>Login Required</h2>
          <p>Please login to view your dashboard</p>
          <button onClick={() => window.navigateTo('login')} style={styles.btnPrimary}>
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.app}>
        <Header transparent={true} />
        <div style={styles.loading}>
          <div style={{ fontSize: 48 }}>📊</div>
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.app}>
        <Header transparent={true} />
        <div style={styles.noProfile}>
          <div style={{ fontSize: 64 }}>👤</div>
          <h2>No Provider Profile Found</h2>
          <p>Create a provider profile to access your dashboard</p>
          <button onClick={() => window.navigateTo('register')} style={styles.btnPrimary}>
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header transparent={true} />

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Provider Dashboard</h1>
          <p style={styles.heroSub}>Welcome back, {profile.name}!</p>
        </div>
      </div>

      <div style={styles.container}>
        
        {/* STATS GRID */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📅</div>
            <div style={styles.statValue}>{stats.totalBookings}</div>
            <div style={styles.statLabel}>Total Bookings</div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: '#FEF3C7', color: '#D97706' }}>⏳</div>
            <div style={styles.statValue}>{stats.pendingBookings}</div>
            <div style={styles.statLabel}>Pending</div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: '#D1FAE5', color: '#059669' }}>✓</div>
            <div style={styles.statValue}>{stats.confirmedBookings}</div>
            <div style={styles.statLabel}>Confirmed</div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: '#E0E7FF', color: '#4F46E5' }}>⭐</div>
            <div style={styles.statValue}>{profile.rating}</div>
            <div style={styles.statLabel}>Rating</div>
          </div>
        </div>

        {/* PROFILE INFO */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Your Profile</h2>
          <div style={styles.profileCard}>
            <div style={styles.profileHeader}>
              {profile.image_url && profile.image_url.startsWith('http') ? (
                <img src={profile.image_url} alt={profile.name} style={styles.profileAvatar} />
              ) : (
                <div style={styles.profileAvatarPlaceholder}>{profile.image_url || '👤'}</div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={styles.profileName}>{profile.name}</h3>
                  {profile.verified && <span style={styles.verified}>✓ Verified</span>}
                  <span style={{
                    ...styles.statusBadge,
                    background: profile.available ? '#D1FAE5' : '#FEE2E2',
                    color: profile.available ? '#059669' : '#DC2626'
                  }}>
                    {profile.available ? '● Available' : '● Busy'}
                  </span>
                </div>
                <p style={styles.profileJob}>{profile.job}</p>
                <p style={styles.profileLocation}>📍 {profile.city}, {profile.country}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={styles.price}>{profile.price}</div>
                <button onClick={() => window.navigateTo('edit-profile')} style={styles.editBtn}>
                  ✏️ Edit Profile
                </button>
              </div>
            </div>

            <div style={styles.profileInfo}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Category:</span>
                <span style={styles.infoValue}>{profile.category}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Specialization:</span>
                <span style={styles.infoValue}>{profile.subcategory}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Languages:</span>
                <span style={styles.infoValue}>{profile.languages?.join(', ')}</span>
              </div>
              {profile.line_id && (
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>LINE ID:</span>
                  <span style={styles.infoValue}>{profile.line_id}</span>
                </div>
              )}
            </div>

            {profile.tags && profile.tags.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', marginBottom: 8 }}>Skills:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {profile.tags.map(tag => (
                    <span key={tag} style={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionsGrid}>
            <button onClick={() => window.navigateTo('bookings')} style={styles.actionCard}>
              <div style={styles.actionIcon}>📅</div>
              <div style={styles.actionTitle}>View Bookings</div>
              <div style={styles.actionSub}>Manage your appointments</div>
            </button>

            <button onClick={() => window.navigateTo('messages')} style={styles.actionCard}>
              <div style={styles.actionIcon}>💬</div>
              <div style={styles.actionTitle}>Messages</div>
              <div style={styles.actionSub}>Chat with customers</div>
            </button>

            <button onClick={() => window.navigateTo('edit-profile')} style={styles.actionCard}>
              <div style={styles.actionIcon}>✏️</div>
              <div style={styles.actionTitle}>Edit Profile</div>
              <div style={styles.actionSub}>Update your information</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', paddingTop: 0 },
  loading: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 100%)', padding: '120px 20px 40px', marginBottom: 40 },
  heroInner: { maxWidth: 1100, margin: '0 auto', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' },
  heroSub: { color: '#d1fae5', fontSize: 16, margin: 0 },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 20px 60px' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 },
  statCard: { background: 'white', borderRadius: 16, padding: 24, border: '1.5px solid #e5e7eb', textAlign: 'center' },
  statIcon: { width: 48, height: 48, background: '#DBEAFE', color: '#1D4ED8', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px' },
  statValue: { fontSize: 32, fontWeight: 800, color: '#111827', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#6b7280', fontWeight: 500 },
  
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 20 },
  
  profileCard: { background: 'white', borderRadius: 16, padding: 24, border: '1.5px solid #e5e7eb' },
  profileHeader: { display: 'flex', gap: 20, alignItems: 'flex-start', paddingBottom: 20, borderBottom: '1px solid #f3f4f6' },
  profileAvatar: { width: 80, height: 80, borderRadius: 16, objectFit: 'cover', flexShrink: 0 },
  profileAvatarPlaceholder: { width: 80, height: 80, background: '#ecfdf5', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, flexShrink: 0 },
  profileName: { margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' },
  profileJob: { margin: '4px 0 0', fontSize: 14, color: '#6b7280' },
  profileLocation: { margin: '4px 0 0', fontSize: 13, color: '#6b7280' },
  price: { fontSize: 18, fontWeight: 700, color: '#065f46', marginBottom: 8 },
  editBtn: { background: '#f3f4f6', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#374151', fontFamily: '"Outfit", sans-serif' },
  verified: { background: '#d1fae5', color: '#065f46', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 10 },
  statusBadge: { fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 },
  
  profileInfo: { marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: 13, color: '#6b7280', fontWeight: 500 },
  infoValue: { fontSize: 13, color: '#374151', fontWeight: 600 },
  tag: { background: '#f3f4f6', color: '#374151', fontSize: 12, padding: '4px 10px', borderRadius: 20, fontWeight: 500 },
  
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  actionCard: { background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'all 0.2s', fontFamily: '"Outfit", sans-serif', textAlign: 'center' },
  actionIcon: { fontSize: 40, marginBottom: 12 },
  actionTitle: { fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 },
  actionSub: { fontSize: 13, color: '#6b7280' },
  
  loginRequired: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 },
  noProfile: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 },
  btnPrimary: { padding: '14px 24px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6,95,70,0.3)' }
};

export default ProviderDashboard;
