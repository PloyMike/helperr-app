import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

function BookingCalendar({ profile, onClose }) {
  
  const containsForbiddenContent = (text) => {
    const forbiddenPatterns = [
      /\b\d{10,}\b/,
      /\+?\d[\d\s\-()]{8,}/,
      /\b0\d{9}\b/,
      /@/,
      /\[at\]/i,
      /\.com\b/i,
      /\.net\b/i,
      /\.org\b/i,
      /\.de\b/i,
      /\.co\b/i,
      /whatsapp/i,
      /line\s*id/i,
      /telegram/i,
      /facebook/i,
      /instagram/i,
      /wechat/i,
      /viber/i,
      /signal/i
    ];

    return forbiddenPatterns.some(pattern => pattern.test(text));
  };

  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('name, email, phone')
          .eq('email', user.email)
          .single();
        
        setUserProfile(data || { name: '', email: user.email, phone: '' });
      }
    };
    fetchUserProfile();
  }, [user]);

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' });
  };

  const formatDateFull = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatDateISO = (date) => {
    return date.toISOString().split('T')[0];
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const start = i.toString().padStart(2, '0') + ':00';
    const end = ((i + 1) % 24).toString().padStart(2, '0') + ':00';
    return `${start} - ${end}`;
  });

  const fetchBookedSlots = useCallback(async (date) => {
    setLoadingSlots(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('time_slot')
        .eq('profile_id', profile.id)
        .eq('booking_date', date)
        .in('status', ['pending', 'confirmed']);

      if (error) throw error;
      
      const slots = data.map(booking => booking.time_slot);
      setBookedSlots(slots);
    } catch (error) {
      console.error('Error loading booked slots:', error);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [profile.id]);

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate, fetchBookedSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check message for forbidden content
    if (message && containsForbiddenContent(message)) {
      alert('⚠️ Your message contains phone numbers, emails, or external contact methods which are not allowed. Please use our platform messaging for all communication.');
      return;
    }
    
    if (!user) {
      alert('Please login to make a booking');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('bookings').insert([{
        profile_id: profile.id,
        customer_name: userProfile?.name || 'Customer',
        customer_email: userProfile?.email || user.email,
        customer_phone: userProfile?.phone || '',
        booking_date: selectedDate,
        time_slot: selectedTimeSlot,
        message: message,
        total_price: profile.price,
        status: 'pending'
      }]);

      if (error) throw error;
      alert('✅ Booking request sent successfully!');
      onClose();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Book {profile.name}</h2>
            <p style={styles.subtitle}>{profile.subcategory} · {profile.price}</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.progress}>
          <div style={{...styles.progressStep, ...(step >= 1 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>1</div>
            <span style={styles.progressLabel}>Date</span>
          </div>
          <div style={styles.progressLine} />
          <div style={{...styles.progressStep, ...(step >= 2 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>2</div>
            <span style={styles.progressLabel}>Time</span>
          </div>
          <div style={styles.progressLine} />
          <div style={{...styles.progressStep, ...(step >= 3 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>3</div>
            <span style={styles.progressLabel}>Confirm</span>
          </div>
        </div>
        <div style={styles.content}>
          {step === 1 && (
            <div>
              <h3 style={styles.stepTitle}>Select a Date</h3>
              <div style={styles.dateGrid}>
                {getAvailableDates().map(date => {
                  const dateISO = formatDateISO(date);
                  const isSelected = selectedDate === dateISO;
                  return (
                    <button key={dateISO} onClick={() => setSelectedDate(dateISO)} style={{...styles.dateBtn, ...(isSelected ? styles.dateBtnActive : {})}}>
                      <div style={styles.dateDay}>{formatDate(date).split(',')[0]}</div>
                      <div style={styles.dateNumber}>{date.getDate()}</div>
                      <div style={styles.dateMonth}>{formatDate(date).split(' ')[1]}</div>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setStep(2)} disabled={!selectedDate} style={{...styles.btnNext, opacity: !selectedDate ? 0.5 : 1, cursor: !selectedDate ? 'not-allowed' : 'pointer'}}>
                Continue to Time Selection →
              </button>
            </div>
          )}
          {step === 2 && (
            <div>
              <h3 style={styles.stepTitle}>Select Time Slot</h3>
              <p style={styles.selectedInfo}>📅 {formatDateFull(new Date(selectedDate))}</p>
              
              {loadingSlots ? (
                <div style={styles.loadingSlots}>
                  <div style={{ fontSize: 24 }}>⏳</div>
                  <p>Checking availability...</p>
                </div>
              ) : (
                <>
                  {bookedSlots.length > 0 && (
                    <div style={styles.infoBox}>
                      ℹ️ {bookedSlots.length} slot{bookedSlots.length > 1 ? 's' : ''} already booked on this day
                    </div>
                  )}
                  <div style={styles.timeGrid}>
                    {timeSlots.map(slot => {
                      const isBooked = bookedSlots.includes(slot);
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => !isBooked && setSelectedTimeSlot(slot)}
                          disabled={isBooked}
                          style={{
                            ...styles.timeBtn,
                            ...(isSelected ? styles.timeBtnActive : {}),
                            ...(isBooked ? styles.timeBtnBooked : {})
                          }}
                        >
                          {slot}
                          {isBooked && <div style={styles.bookedLabel}>Booked</div>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              
              <div style={styles.btnGroup}>
                <button onClick={() => setStep(1)} style={styles.btnBack}>← Back</button>
                <button onClick={() => setStep(3)} disabled={!selectedTimeSlot} style={{...styles.btnNext, flex: 1, opacity: !selectedTimeSlot ? 0.5 : 1, cursor: !selectedTimeSlot ? 'not-allowed' : 'pointer'}}>
                  Continue to Confirm →
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h3 style={styles.stepTitle}>Confirm Booking</h3>
              
              <div style={styles.summary}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Provider:</span>
                  <span style={styles.summaryValue}>{profile.name}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Service:</span>
                  <span style={styles.summaryValue}>{profile.subcategory}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Date:</span>
                  <span style={styles.summaryValue}>{formatDateFull(new Date(selectedDate))}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Time:</span>
                  <span style={styles.summaryValue}>{selectedTimeSlot}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Price:</span>
                  <span style={styles.summaryValue}>{profile.price}</span>
                </div>
                <div style={{...styles.summaryRow, borderTop: '1px solid #e5e7eb', paddingTop: 12, marginTop: 12}}>
                  <span style={styles.summaryLabel}>Your Name:</span>
                  <span style={styles.summaryValue}>{userProfile?.name || 'Not set'}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Your Email:</span>
                  <span style={styles.summaryValue}>{userProfile?.email || user?.email}</span>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message (Optional)</label>
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  style={styles.textarea} 
                  placeholder="Any special requests or notes for the provider..." 
                  rows={3} 
                />
              </div>

              <div style={styles.btnGroup}>
                <button type="button" onClick={() => setStep(2)} style={styles.btnBack}>← Back</button>
                <button type="submit" disabled={submitting} style={{...styles.btnSubmit, flex: 1, opacity: submitting ? 0.6 : 1}}>
                  {submitting ? 'Sending...' : '✅ Confirm Booking'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: '"Outfit", sans-serif' },
  modal: { background: 'white', borderRadius: 20, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' },
  header: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: 24, borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { margin: 0, fontSize: 24, fontWeight: 800, color: 'white' },
  subtitle: { margin: '4px 0 0', fontSize: 14, color: '#d1fae5' },
  closeBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, fontWeight: 700 },
  progress: { display: 'flex', alignItems: 'center', padding: '24px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  progressStep: { display: 'flex', alignItems: 'center', gap: 8 },
  progressStepActive: { color: '#065f46' },
  progressNumber: { width: 32, height: 32, borderRadius: '50%', background: '#e5e7eb', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 },
  progressLabel: { fontSize: 13, fontWeight: 600, color: '#6b7280' },
  progressLine: { flex: 1, height: 2, background: '#e5e7eb', margin: '0 12px' },
  content: { padding: 24 },
  stepTitle: { margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: '#111827' },
  dateGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 10, marginBottom: 20 },
  dateBtn: { padding: '12px 8px', border: '2px solid #e5e7eb', borderRadius: 12, background: 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' },
  dateBtnActive: { borderColor: '#065f46', background: '#ecfdf5' },
  dateDay: { fontSize: 11, color: '#6b7280', fontWeight: 600 },
  dateNumber: { fontSize: 20, fontWeight: 800, color: '#111827', margin: '4px 0' },
  dateMonth: { fontSize: 11, color: '#6b7280', fontWeight: 600 },
  timeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, marginBottom: 20, maxHeight: 400, overflowY: 'auto' },
  timeBtn: { padding: '12px', border: '2px solid #e5e7eb', borderRadius: 10, background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#374151', transition: 'all 0.2s', position: 'relative' },
  timeBtnActive: { borderColor: '#065f46', background: '#ecfdf5', color: '#065f46' },
  timeBtnBooked: { background: '#fee2e2', borderColor: '#fecaca', color: '#991b1b', cursor: 'not-allowed', opacity: 0.6 },
  bookedLabel: { fontSize: 10, color: '#dc2626', fontWeight: 700, marginTop: 4 },
  selectedInfo: { background: '#ecfdf5', padding: 12, borderRadius: 10, fontSize: 14, color: '#065f46', fontWeight: 600, marginBottom: 16 },
  infoBox: { background: '#fffbeb', padding: 12, borderRadius: 10, fontSize: 13, color: '#92400e', marginBottom: 16, fontWeight: 500 },
  loadingSlots: { textAlign: 'center', padding: 40, color: '#6b7280' },
  summary: { background: '#f9fafb', padding: 20, borderRadius: 12, marginBottom: 20 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 },
  summaryLabel: { color: '#6b7280', fontWeight: 600 },
  summaryValue: { color: '#111827', fontWeight: 600, textAlign: 'right' },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  textarea: { width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif', resize: 'vertical', boxSizing: 'border-box' },
  btnGroup: { display: 'flex', gap: 12, marginTop: 20 },
  btnBack: { padding: '14px 24px', background: 'white', color: '#374151', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  btnNext: { padding: '14px 24px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', width: '100%' },
  btnSubmit: { padding: '14px 24px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' }
};

export default BookingCalendar;
