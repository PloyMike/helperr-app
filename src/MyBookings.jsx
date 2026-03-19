import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';

function MyBookings() {
  const { user, signIn } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      let bookingsQuery = supabase.from('bookings').select('*');
      
      if (profileData) {
        bookingsQuery = bookingsQuery.eq('profile_id', profileData.id);
      } else {
        bookingsQuery = bookingsQuery.eq('customer_email', user.email);
      }

      const { data, error } = await bookingsQuery.order('created_at', { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);
      
      if (error) throw error;
      fetchBookings();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const { error } = await signIn(loginEmail, loginPassword);
      if (error) throw error;
    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      setLoginLoading(false);
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
        <Header />
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
        <Header />
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
      <Header />

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>My Bookings</h1>
          <p style={styles.heroSub}>Manage all your bookings in one place</p>
        </div>
      </div>

      <div style={styles.container}>
        
        <div style={styles.filters}>
          {['all', 'pending', 'confirmed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                ...styles.filterBtn,
                ...(statusFilter === status ? styles.filterBtnActive : {})
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {filteredBookings.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: 48 }}>📭</div>
            <h3>No bookings found</h3>
            <p>
              {statusFilter === 'all' 
                ? "You don't have any bookings yet" 
                : `No ${statusFilter} bookings`}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredBookings.map(booking => (
              <div key={booking.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.cardTitle}>{booking.customer_name}</h3>
                    <p style={styles.cardSub}>{booking.customer_email}</p>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    background: getStatusColor(booking.status) + '20',
                    color: getStatusColor(booking.status)
                  }}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>

                <div style={styles.cardContent}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>📅 Date:</span>
                    <span style={styles.infoValue}>{booking.booking_date}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>⏰ Time:</span>
                    <span style={styles.infoValue}>{booking.time_slot}</span>
                  </div>
                  {booking.customer_phone && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>📞 Phone:</span>
                      <span style={styles.infoValue}>{booking.customer_phone}</span>
                    </div>
                  )}
                  {booking.message && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>💬 Message:</span>
                      <span style={styles.infoValue}>{booking.message}</span>
                    </div>
                  )}
                  {booking.total_price && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>💰 Price:</span>
                      <span style={{...styles.infoValue, fontWeight: 700, color: '#065f46'}}>
                        {booking.total_price}
                      </span>
                    </div>
                  )}
                </div>

                {booking.status === 'pending' && (
                  <div style={styles.cardActions}>
                    <button
                      onClick={() => handleStatusChange(booking.id, 'confirmed')}
                      style={styles.btnConfirm}
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(booking.id, 'cancelled')}
                      style={styles.btnCancel}
                    >
                      ✕ Decline
                    </button>
                  </div>
                )}
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
  filters: { display: 'flex', gap: 12, marginBottom: 30, flexWrap: 'wrap' },
  filterBtn: { background: 'white', border: '2px solid #e5e7eb', borderRadius: 20, padding: '10px 20px', fontSize: 14, fontWeight: 600, color: '#6b7280', cursor: 'pointer', transition: 'all 0.2s' },
  filterBtnActive: { background: '#065f46', borderColor: '#065f46', color: '#fff' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 },
  card: { background: 'white', borderRadius: 16, padding: 20, border: '1.5px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 },
  cardTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' },
  cardSub: { margin: '4px 0 0', fontSize: 13, color: '#6b7280' },
  statusBadge: { padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  cardContent: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  infoLabel: { fontSize: 13, color: '#6b7280', fontWeight: 500 },
  infoValue: { fontSize: 13, color: '#374151', fontWeight: 600, textAlign: 'right' },
  cardActions: { display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid #f3f4f6' },
  btnConfirm: { flex: 1, padding: '10px', background: '#059669', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  btnCancel: { flex: 1, padding: '10px', background: '#DC2626', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  empty: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb' },
  loginContainer: { minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  loginCard: { background: 'white', borderRadius: 24, padding: '40px 32px', maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' },
  loginTitle: { fontSize: 28, fontWeight: 800, color: '#1F2937', margin: '0 0 8px' },
  loginSub: { color: '#6B7280', marginBottom: 24, fontSize: 15 },
  loginForm: { display: 'flex', flexDirection: 'column', gap: 16 },
  input: { width: '100%', padding: '14px 16px', border: '2px solid #E5E7EB', borderRadius: 12, fontSize: 15, outline: 'none', fontFamily: '"Outfit", sans-serif', boxSizing: 'border-box' },
  btnPrimary: { padding: '14px 24px', background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(20,184,166,0.3)' }
};

export default MyBookings;
