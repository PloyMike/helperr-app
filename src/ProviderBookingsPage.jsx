import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';

function ProviderBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [userProfile, setUserProfile] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    if (!user || !userProfile?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('profile_id', userProfile.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user, userProfile]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleAccept = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;
      alert('Booking confirmed!');
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
      alert('Error confirming booking');
    }
  };

  const handleDecline = async (bookingId) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      alert('Booking declined');
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
      alert('Error declining booking');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return '#065f46';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'confirmed': return '✓ Confirmed';
      case 'pending': return '⏳ Pending';
      case 'cancelled': return '✕ Cancelled';
      default: return status;
    }
  };

  const filteredBookings = bookings.filter(b => 
    statusFilter === 'all' || b.status === statusFilter
  );

  if (!user) {
    return (
      <div style={styles.app}>
        <Header transparent={true} isScrolled={isScrolled} />
        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <h1 style={styles.heroTitle}>Provider Bookings</h1>
            <p style={styles.heroSub}>Manage bookings for your services</p>
          </div>
        </div>
        <div style={styles.loginRequired}>
          <h2>Login Required</h2>
          <p>Please login to view your provider bookings</p>
          <button onClick={() => window.navigateTo('login')} style={styles.btnPrimary}>
            Login
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div style={styles.app}>
        <Header transparent={true} isScrolled={isScrolled} />
        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <h1 style={styles.heroTitle}>Provider Bookings</h1>
            <p style={styles.heroSub}>Manage bookings for your services</p>
          </div>
        </div>
        <div style={styles.noProfile}>
          <h2>No Provider Profile</h2>
          <p>Create a provider profile to receive bookings</p>
          <button onClick={() => window.navigateTo('edit-profile')} style={styles.btnPrimary}>
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.app}>
        <Header transparent={true} isScrolled={isScrolled} />
        <div style={styles.loading}>
          
          <h2>Loading bookings...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header transparent={true} isScrolled={isScrolled} />
      
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Provider Bookings</h1>
          <p style={styles.heroSub}>Manage bookings for your services</p>
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
            
            <h3>No bookings found</h3>
            <p>You don't have any {statusFilter !== 'all' ? statusFilter : ''} bookings yet</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredBookings.map(booking => (
              <div key={booking.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={styles.customerPlaceholder}>
                      {booking.customer_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 style={styles.cardTitle}>{booking.customer_name}</h3>
                      <p style={styles.cardSub}>Customer Request</p>
                    </div>
                  </div>
                  <span style={{...styles.statusBadge, background: getStatusColor(booking.status)}}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    
                    <div>
                      <span style={styles.infoLabel}>Date</span>
                      <span style={styles.infoValue}>{new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <div style={styles.infoRow}>
                    
                    <div>
                      <span style={styles.infoLabel}>Time</span>
                      <span style={styles.infoValue}>{booking.time_slot}</span>
                    </div>
                  </div>

                  <div style={styles.infoRow}>
                    
                    <div>
                      <span style={styles.infoLabel}>Address</span>
                      <span style={styles.infoValue}>
                        {booking.service_address || 'No address provided'}
                        {booking.address_notes && <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Note: {booking.address_notes}</div>}
                      </span>
                    </div>
                  </div>

                  <div style={styles.infoRow}>
                    
                    <div>
                      <span style={styles.infoLabel}>Contact</span>
                      <button 
                        onClick={() => window.navigateTo('messages')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#065f46',
                          fontSize: 15,
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          padding: 0
                        }}
                      >
                        Contact via Helperr Messages
                      </button>
                    </div>
                  </div>

                  <div style={styles.infoRow}>
                    
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
                  {booking.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleAccept(booking.id)} style={styles.btnAccept}>
                        Accept
                      </button>
                      <button onClick={() => handleDecline(booking.id)} style={styles.btnDecline}>
                        Decline
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
  hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 70%, #14b8a6 100%)', padding: '120px 20px 64px', marginBottom: 40, position: 'relative', overflow: 'hidden', clipPath: 'ellipse(120% 100% at 50% 0%)' },
  heroInner: { maxWidth: 1100, margin: '0 auto', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' },
  heroSub: { color: '#d1fae5', fontSize: 16, margin: 0 },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 20px 60px' },
  filters: { display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', background: '#fff', padding: 20, borderRadius: 16, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)' },
  filterBtn: { padding: '10px 20px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#6b7280', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' },
  filterBtnActive: { background: '#065f46', borderColor: '#065f46', color: 'white', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)', transform: 'translateY(-1px)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 },
  card: { background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', transition: 'all 0.2s' },
  cardHeader: { padding: 20, borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  customerPlaceholder: { width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 700 },
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
  btnAccept: { flex: 1, padding: '12px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)' },
  btnDecline: { flex: 1, padding: '12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  empty: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)' },
  btnPrimary: { padding: '12px 24px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', marginTop: 16 },
  loading: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  loginRequired: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 },
  noProfile: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 }
};

export default ProviderBookingsPage;
