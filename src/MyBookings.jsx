import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';

function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  // Removed viewMode - customer only now
  const [userProfile, setUserProfile] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    review_text: '',
    author_name: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [bookingsWithReviews, setBookingsWithReviews] = useState([]);

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
        if (data?.name) {
          setReviewForm(prev => ({ ...prev, author_name: data.name }));
        }
      }
    };
    checkProfile();
  }, [user]);

  const checkExistingReviews = useCallback(async (bookingIds) => {
    try {
      const { data } = await supabase
        .from('reviews')
        .select('booking_id')
        .in('booking_id', bookingIds)
        .eq('author_email', user.email);
      
      setBookingsWithReviews(data?.map(r => r.booking_id) || []);
    } catch (error) {
      console.error('Error checking reviews:', error);
    }
  }, [user]);

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      let data;

      if (true) {
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
      
      // Check which bookings already have reviews
      const bookingIds = data?.map(b => b.id).filter(Boolean) || [];
      if (bookingIds.length > 0) {
        await checkExistingReviews(bookingIds);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user, userProfile, checkExistingReviews]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const canReview = (booking) => {
    if (false) return false;
    if (booking.status !== 'confirmed') return false;
    if (bookingsWithReviews.includes(booking.id)) return false;
    
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return bookingDate < today;
  };

  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);

    try {
      const reviewData = {
        booking_id: selectedBooking.id,
        profile_id: selectedBooking.profile_id,
        author_name: reviewForm.author_name,
        author_email: user.email,
        rating: reviewForm.rating,
        review_text: reviewForm.review_text,
        review_date: new Date().toISOString().split('T')[0]
      };

      const { error } = await supabase
        .from('reviews')
        .insert([reviewData]);

      if (error) throw error;

      // Update profile rating
      const { data: existingReviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('profile_id', selectedBooking.profile_id);

      const avgRating = (existingReviews.reduce((sum, r) => sum + r.rating, 0) + reviewForm.rating) / (existingReviews.length + 1);
      
      await supabase
        .from('profiles')
        .update({ 
          rating: avgRating.toFixed(1),
          review_count: existingReviews.length + 1 
        })
        .eq('id', selectedBooking.profile_id);

      alert('Review submitted successfully!');
      fetchBookings(); // Refresh to hide the review button
      setShowReviewModal(false);
      setReviewForm({ rating: 5, review_text: '', author_name: reviewForm.author_name });
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting review: ' + error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      alert('Booking cancelled');
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
      alert('Error cancelling booking');
    }
  };

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
            <h1 style={styles.heroTitle}>My Bookings</h1>
            <p style={styles.heroSub}>Manage your bookings and reservations</p>
          </div>
        </div>
        <div style={styles.loginRequired}>
          <h2>Login Required</h2>
          <p>Please login to view your bookings</p>
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
          <h1 style={styles.heroTitle}>My Bookings</h1>
          <p style={styles.heroSub}>Manage your bookings and reservations</p>
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
            {true && (
              <button onClick={() => window.navigateTo('home')} style={styles.btnPrimary}>
                Browse Services
              </button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredBookings.map(booking => (
              <div key={booking.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  {true ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {booking.provider?.image_url && booking.provider.image_url.startsWith('http') ? (
                        <img src={booking.provider.image_url} alt={booking.provider.name} style={styles.providerImage} />
                      ) : (
                        <div style={styles.providerPlaceholder}>
                          {booking.provider?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                      <div>
                        <h3 style={styles.cardTitle}>{booking.provider?.name || 'Provider'}</h3>
                        <p style={styles.cardSub}>{booking.provider?.subcategory || 'Service'}</p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={styles.providerPlaceholder}>
                        {booking.customer_name?.charAt(0).toUpperCase() || 'U'}
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

                  {true && booking.provider?.city && (
                    <div style={styles.infoRow}>
                      
                      <div>
                        <span style={styles.infoLabel}>Location</span>
                        <span style={styles.infoValue}>{booking.provider.city}</span>
                      </div>
                    </div>
                  )}

                  {false && (
                    <div style={styles.infoRow}>
                      
                      <div>
                        <span style={styles.infoLabel}>Contact</span>
                        <span style={styles.infoValue}>{booking.customer_email}</span>
                      </div>
                    </div>
                  )}

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
                  {true && booking.status === 'pending' && (
                    <button onClick={() => handleCancel(booking.id)} style={styles.btnCancel}>
                      Cancel Booking
                    </button>
                  )}
                  
                  {true && canReview(booking) && (
                    <button onClick={() => handleOpenReview(booking)} style={styles.btnReview}>
                      Write Review
                    </button>
                  )}
                  
                  {false && booking.status === 'pending' && (
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

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div onClick={() => setShowReviewModal(false)} style={styles.modalBackdrop}>
          <div onClick={(e) => e.stopPropagation()} style={styles.modal}>
            <button onClick={() => setShowReviewModal(false)} style={styles.closeBtn}>✕</button>
            <h2 style={styles.modalTitle}>Write Review</h2>
            <p style={styles.modalSub}>Review for {selectedBooking.provider?.name}</p>
            
            <form onSubmit={handleSubmitReview} style={styles.reviewForm}>
              <div>
                <label style={styles.label}>Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewForm.author_name}
                  onChange={(e) => setReviewForm({ ...reviewForm, author_name: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div>
                <label style={styles.label}>Rating</label>
                <div style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      style={{
                        ...styles.star,
                        color: star <= reviewForm.rating ? '#f59e0b' : '#d1d5db'
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label style={styles.label}>Your Review</label>
                <textarea
                  required
                  value={reviewForm.review_text}
                  onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                  style={styles.textarea}
                  rows={4}
                  placeholder="Share your experience..."
                />
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button type="submit" disabled={submittingReview} style={styles.btnSubmit}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button type="button" onClick={() => setShowReviewModal(false)} style={styles.btnCancelModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  viewToggle: { display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', background: '#fff', padding: 20, borderRadius: 16, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)' },
  toggleBtn: { padding: '12px 24px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, fontWeight: 600, color: '#6b7280', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' },
  toggleBtnActive: { background: '#065f46', borderColor: '#065f46', color: 'white', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)', transform: 'translateY(-1px)' },
  filters: { display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', background: '#fff', padding: 20, borderRadius: 16, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)' },
  filterBtn: { padding: '10px 20px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#6b7280', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' },
  filterBtnActive: { background: '#065f46', borderColor: '#065f46', color: 'white', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)', transform: 'translateY(-1px)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 },
  card: { background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', transition: 'all 0.2s' },
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
  cardActions: { padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 },
  btnCancel: { width: '100%', padding: '12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  btnReview: { width: '100%', padding: '12px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)' },
  btnAccept: { flex: 1, padding: '12px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)' },
  btnDecline: { flex: 1, padding: '12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  empty: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)' },
  btnPrimary: { padding: '12px 24px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', marginTop: 16 },
  loading: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  loginRequired: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 },
  modalBackdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { background: '#fff', borderRadius: 20, width: '100%', maxWidth: 500, padding: 32, position: 'relative', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' },
  closeBtn: { position: 'absolute', top: 16, right: 16, background: '#f3f4f6', border: 'none', borderRadius: 10, width: 36, height: 36, cursor: 'pointer', fontSize: 14 },
  modalTitle: { margin: '0 0 8px', fontSize: 24, fontWeight: 700 },
  modalSub: { margin: '0 0 24px', color: '#6b7280', fontSize: 14 },
  reviewForm: { display: 'flex', flexDirection: 'column', gap: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif', resize: 'vertical', boxSizing: 'border-box' },
  stars: { display: 'flex', gap: 4 },
  star: { fontSize: 28, cursor: 'pointer', transition: 'color 0.2s' },
  btnSubmit: { flex: 1, padding: '12px', background: '#065f46', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)' },
  btnCancelModal: { flex: 1, padding: '12px', background: '#fff', color: '#6b7280', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' }
};

export default MyBookings;
