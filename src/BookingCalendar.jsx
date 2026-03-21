import React, { useState } from 'react';
import { supabase } from './supabase';

function BookingCalendar({ profile, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from('bookings').insert([{
        profile_id: profile.id,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        booking_date: selectedDate,
        time_slot: selectedTimeSlot,
        message: formData.message,
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
            <span style={styles.progressLabel}>Details</span>
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
              <div style={styles.timeGrid}>
                {timeSlots.map(slot => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button key={slot} onClick={() => setSelectedTimeSlot(slot)} style={{...styles.timeBtn, ...(isSelected ? styles.timeBtnActive : {})}}>
                      {slot}
                    </button>
                  );
                })}
              </div>
              <div style={styles.btnGroup}>
                <button onClick={() => setStep(1)} style={styles.btnBack}>← Back</button>
                <button onClick={() => setStep(3)} disabled={!selectedTimeSlot} style={{...styles.btnNext, flex: 1, opacity: !selectedTimeSlot ? 0.5 : 1, cursor: !selectedTimeSlot ? 'not-allowed' : 'pointer'}}>
                  Continue to Details →
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <h3 style={styles.stepTitle}>Your Details</h3>
              <div style={styles.summary}>
                <p>📅 {formatDateFull(new Date(selectedDate))}</p>
                <p>🕐 {selectedTimeSlot}</p>
                <p>💰 {profile.price}</p>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Your Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={styles.input} placeholder="John Doe" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={styles.input} placeholder="john@example.com" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={styles.input} placeholder="+66 123 456 789" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Message (Optional)</label>
                <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} style={styles.textarea} placeholder="Any special requests..." rows={3} />
              </div>
              <div style={styles.btnGroup}>
                <button type="button" onClick={() => setStep(2)} style={styles.btnBack}>← Back</button>
                <button type="submit" disabled={submitting} style={{...styles.btnSubmit, flex: 1, opacity: submitting ? 0.6 : 1}}>
                  {submitting ? 'Sending...' : '📨 Send Booking Request'}
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
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: '"Outfit", sans-serif' },
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
  timeBtn: { padding: '12px', border: '2px solid #e5e7eb', borderRadius: 10, background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#374151', transition: 'all 0.2s' },
  timeBtnActive: { borderColor: '#065f46', background: '#ecfdf5', color: '#065f46' },
  selectedInfo: { background: '#ecfdf5', padding: 12, borderRadius: 10, fontSize: 14, color: '#065f46', fontWeight: 600, marginBottom: 16 },
  summary: { background: '#f9fafb', padding: 16, borderRadius: 12, marginBottom: 20, fontSize: 14, color: '#374151' },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif', resize: 'vertical', boxSizing: 'border-box' },
  btnGroup: { display: 'flex', gap: 12, marginTop: 20 },
  btnBack: { padding: '14px 24px', background: 'white', color: '#374151', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  btnNext: { padding: '14px 24px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', width: '100%' },
  btnSubmit: { padding: '14px 24px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' }
};

export default BookingCalendar;
