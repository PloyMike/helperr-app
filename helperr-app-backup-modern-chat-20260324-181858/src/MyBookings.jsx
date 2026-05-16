import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';

function MyBookings() {
  const { user, signIn } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('customer'); // 'customer' or 'provider'
  const [userProfile, setUserProfile] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Check if user has a provider profile
  useEffect(() => {
    const checkProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('email', user.email)
          .single();
        
        setUserProfile(data);
      }
    };
    checkProfile();
  }, [user]);

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      let data;

      if (viewMode === 'customer') {
        // Customer view: bookings I made
        const { data: customerData, error: customerError } = await supabase
          .from('bookings')
          .select(`
            *,
            provider:profiles!bookings_profile_id_fkey(name, image_url, subcategory, city)
          `)
          .eq('customer_email', user.email)
          .order('booking_date', { ascending: false });

        if (customerError) throw customerError;
        data = customerData;
      } else {
        // Provider view: bookings for my services
        if (!userProfile?.id) {
          data = [];
        } else {
          const { data: providerData, error: providerError } = await supabase
            .from('bookings')
            .select('*')
            .eq('profile_id', userProfile.id)
            .order('booking_date', { ascending: false });

          if (providerError) throw providerError;
          data = providerData;
        }
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user, viewMode, userProfile]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await signIn(loginEmail, loginPassword);
    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDecline = async (bookingId) => {
    if (!window.confirm('Decline this booking request?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const filteredBookings = bookings.filter(b =>
    statusFilter === 'all' || b.status === statusFilter
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return '#059669';
      case 'pending': return '#F97316';
      case 'cancelled': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (!user) {
    return (
      <div style={styles.app}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Header transparent={true} />
        <div style={styles.loginContainer}>
          <div style={styles.loginCard}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🔐</div>
            <h2 style={styles.loginTitle}>Login Required</h2>
            <p style={styles.loginSub}>Please login to view your bookings</p>
            <form onSubmit={handleLogin} style={styles.loginForm}>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={styles.input}
              />
              <button type="submit" disabled={loginLoading} style={styles.btnPrimary}>
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.app}>
        <Header transparent={true} />
        <div style={styles.loading}>
          <div style={{ fontSize: 48 }}>📅</div>
          <h2>Loading bookings...</h2>
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
          <h1 style={styles.heroTitle}>My Bookings</h1>
          <p style={styles.heroSub}>Manage your service bookings</p>
        </div>
      </div>

      <div style={styles.container}>
        
        {/* VIEW MODE TOGGLE (only show if user has provider profile) */}
        {userProfile && (
          <div style={styles.viewToggle}>
            <button
              onClick={() => setViewMode('customer')}
              style={{...styles.toggleBtn, ...(viewMode === 'customer' ? styles.toggleBtnActive : {})}}
            >
              📅 My Bookings (as Customer)
            </button>
            <button
              onClick={() => setViewMode('provider')}
              style={{...styles.toggleBtn, ...(viewMode === 'provider' ? styles.toggleBtnActive : {})}}
            >
              📋 Service Requests (as Provider)
            </button>
          </div>
        )}

        <div style={styles.filters}>
          <button onClick={() => setStatusFilter('all')} style={{...styles.filterBtn, ...(statusFilter === 'all' ? styles.filterBtnActive : {})}}>
            All ({bookings.length})
          </button>
          <button onClick={() => setStatusFilter('pending')} style={{...styles.filterBtn, ...(statusFilter === 'pending' ? styles.filterBtnActive : {})}}>
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button onClick={() => setStatusFilter('confirmed')} style={{...styles.filterBtn, ...(statusFilter === 'confirmed' ? styles.filterBtnActive : {})}}>
            Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button onClick={() => setStatusFilter('cancelled')} style={{...styles.filterBtn, ...(statusFilter === 'cancelled' ? styles.filterBtnActive : {})}}>
            Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>📅</div>
            <h3>No bookings found</h3>
            <p>
              {statusFilter === 'all' 
                ? (viewMode === 'customer' ? 'You haven\'t made any bookings yet' : 'No service requests yet')
                : `No ${statusFilter} bookings`}
            </p>
            {viewMode === 'customer' && (
              <button onClick={() => window.navigateTo('home')} style={styles.btnPrimary}>
                Browse Providers
              </button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredBookings.map(booking => (
              <div key={booking.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  {viewMode === 'customer' ? (
                    // Customer view: show provider
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {booking.provider?.image_url && booking.provider.image_url.startsWith('http') ? (
                        <img src={booking.provider.image_url} alt={booking.provider.name} style={styles.providerImage} />
                      ) : (
                        <div style={styles.providerPlaceholder}>
                          {booking.provider?.name?.charAt(0).toUpperCase() || '👤'}
                        </div>
                      )}
                      <div>
                        <h3 style={styles.cardTitle}>{booking.provider?.name || 'Provider'}</h3>
                        <p style={styles.cardSub}>{booking.provider?.subcategory || 'Service'}</p>
                      </div>
                    </div>
                  ) : (
                    // Provider view: show customer
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={styles.providerPlaceholder}>
                        {booking.customer_name?.charAt(0).toUpperCase() || '👤'}
                      </div>
                      <div>
                        <h3 style={styles.cardTitle}>{booking.customer_name}</h3>
                        <p style={styles.cardSub}>Customer Request</p>
                      </div>
                    </div>
                  )}
                  <span style={{...styles.statusBadge, background: getStatusColor(booking.status)}}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>📅</span>
                    <div>
                      <span style={styles.infoLabel}>Date</span>
                      <span style={styles.infoValue}>{new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>🕐</span>
                    <div>
                      <span style={styles.infoLabel}>Time</span>
                      <span style={styles.infoValue}>{booking.time_slot}</span>
                    </div>
                  </div>

                  {viewMode === 'customer' && booking.provider?.city && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoIcon}>📍</span>
                      <div>
                        <span style={styles.infoLabel}>Location</span>
                        <span style={styles.infoValue}>{booking.provider.city}</span>
                      </div>
                    </div>
                  )}

                  {viewMode === 'provider' && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoIcon}>📧</span>
                      <div>
                        <span style={styles.infoLabel}>Contact</span>
                        <span style={styles.infoValue}>{booking.customer_email}</span>
                      </div>
                    </div>
                  )}

                  <div style={styles.infoRow}>
                    <span style={styles.infoIcon}>💰</span>
                    <div>
                      <span style={styles.infoLabel}>Price</span>
                      <span style={styles.infoValue}>{booking.total_price}</span>
                    </div>
                  </div>

                  {booking.message && (
                    <div style={styles.messageBox}>
                      <span style={styles.infoLabel}>Message:</span>
                      <p style={styles.messageText}>{booking.message}</p>
                    </div>
                  )}
                </div>

                <div style={styles.cardActions}>
                  {viewMode === 'customer' && booking.status === 'pending' && (
                    <button onClick={() => handleCancel(booking.id)} style={styles.btnCancel}>
                      Cancel Booking
                    </button>
                  )}
                  
                  {viewMode === 'provider' && booking.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleAccept(booking.id)} style={styles.btnAccept}>
                        ✓ Accept
                      </button>
                      <button onClick={() => handleDecline(booking.id)} style={styles.btnDecline}>
                        ✕ Decline
                      </button>
                    </div>
                  )}
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
  app: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', paddingTop: 0 },
  hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 100%)', padding: '120px 20px 40px', marginBottom: 40 },
  heroInner: { maxWidth: 1100, margin: '0 auto', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' },
  heroSub: { color: '#d1fae5', fontSize: 16, margin: 0 },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 20px 60px' },
  viewToggle: { display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  toggleBtn: { padding: '12px 24px', background: 'white', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, fontWeight: 600, color: '#6b7280', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s' },
  toggleBtnActive: { background: '#065f46', borderColor: '#065f46', color: 'white' },
  filters: { display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  filterBtn: { padding: '10px 20px', background: 'white', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#6b7280', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s' },
  filterBtnActive: { background: '#065f46', borderColor: '#065f46', color: 'white' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 },
  card: { background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  cardHeader: { padding: 20, borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  providerImage: { width: 48, height: 48, borderRadius: 12, objectFit: 'cover' },
  providerPlaceholder: { width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 700 },
  cardTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' },
  cardSub: { margin: '4px 0 0', fontSize: 13, color: '#6b7280' },
  statusBadge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'white' },
  cardBody: { padding: 20 },
  infoRow: { display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  infoIcon: { fontSize: 18 },
  infoLabel: { display: 'block', fontSize: 12, color: '#6b7280', fontWeight: 600 },
  infoValue: { display: 'block', fontSize: 14, color: '#111827', fontWeight: 500, marginTop: 2 },
  messageBox: { marginTop: 16, padding: 12, background: '#f9fafb', borderRadius: 10 },
  messageText: { margin: '4px 0 0', fontSize: 13, color: '#374151', lineHeight: 1.6 },
  cardActions: { padding: '0 20px 20px' },
  btnCancel: { width: '100%', padding: '12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  btnAccept: { flex: 1, padding: '12px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  btnDecline: { flex: 1, padding: '12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  empty: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb' },
  btnPrimary: { padding: '12px 24px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', marginTop: 16 },
  loading: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  loginContainer: { minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  loginCard: { background: 'white', padding: 40, borderRadius: 20, maxWidth: 400, width: '100%', textAlign: 'center', border: '1.5px solid #e5e7eb' },
  loginTitle: { margin: '0 0 8px', fontSize: 24, fontWeight: 700 },
  loginSub: { margin: '0 0 24px', color: '#6b7280', fontSize: 14 },
  loginForm: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif' }
};

export default MyBookings;
