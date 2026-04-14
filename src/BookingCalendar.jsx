import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

function BookingCalendar({ profile, onClose }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [startHour, setStartHour] = useState(10);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(11);
  const [endMinute, setEndMinute] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const startHourRef = useRef(null);
  const startMinuteRef = useRef(null);
  const endHourRef = useRef(null);
  const endMinuteRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const initCustomerName = async () => {
      if (user) {
        const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || '';
        setCustomerName(userName);
      }
    };
    initCustomerName();
  }, [user]);

  const getMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let startingDayOfWeek = firstDay.getDay();
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      dates.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      dates.push(date);
    }
    
    return dates;
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getMonthName = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  const getTimeString = () => {
    const sh = startHour.toString().padStart(2, '0');
    const sm = startMinute.toString().padStart(2, '0');
    const eh = endHour.toString().padStart(2, '0');
    const em = endMinute.toString().padStart(2, '0');
    return `${sh}:${sm} - ${eh}:${em}`;
  };

  const isValidTimeRange = () => {
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    return end > start;
  };

  const formatDateFull = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatDateISO = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTimeSlot || !customerName.trim()) {
      alert('Please complete all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('bookings').insert([{
        profile_id: profile.id,
        customer_name: customerName,
        customer_email: user.email,
        customer_phone: '',
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
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        const itemHeight = 40;
        if (startHourRef.current) startHourRef.current.scrollTop = startHour * itemHeight;
        if (startMinuteRef.current) startMinuteRef.current.scrollTop = (startMinute / 15) * itemHeight;
        if (endHourRef.current) endHourRef.current.scrollTop = endHour * itemHeight;
        if (endMinuteRef.current) endMinuteRef.current.scrollTop = (endMinute / 15) * itemHeight;
      }, 50);
    }
  }, [step, startHour, startMinute, endHour, endMinute]);

  const handleScroll = (ref, items, setValue) => {
    if (!ref.current) return;
    const itemHeight = 40;
    const scrollTop = ref.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    setValue(items[clampedIndex]);
  };

  const AppleScrollPicker = ({ items, value, onChange, pickerRef }) => {
    return (
      <div style={isMobile ? styles.scrollPickerWrapperMobile : styles.scrollPickerWrapper}>
        <div style={styles.scrollPickerHighlight}></div>
        <div 
          ref={pickerRef}
          style={styles.scrollPicker}
          onScroll={() => handleScroll(pickerRef, items, onChange)}
        >
          <div style={isMobile ? styles.scrollSpacerMobile : styles.scrollSpacer}></div>
          {items.map((item, i) => (
            <div key={i} style={{
              ...styles.scrollItem,
              opacity: item === value ? 1 : 0.3,
              transform: item === value ? 'scale(1)' : 'scale(0.85)',
              fontSize: item === value ? 20 : 16
            }}>
              {item.toString().padStart(2, '0')}
            </div>
          ))}
          <div style={isMobile ? styles.scrollSpacerMobile : styles.scrollSpacer}></div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Book {profile.name}</h2>
            <p style={styles.subtitle}>{profile.category} • {profile.price}</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <div style={styles.progress}>
          <div style={{...styles.progressStep, ...(step >= 1 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>1</div>
            <span style={styles.progressLabel}>Date</span>
          </div>
          <div style={styles.progressLine}></div>
          <div style={{...styles.progressStep, ...(step >= 2 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>2</div>
            <span style={styles.progressLabel}>Time</span>
          </div>
          <div style={styles.progressLine}></div>
          <div style={{...styles.progressStep, ...(step >= 3 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>3</div>
            <span style={styles.progressLabel}>Confirm</span>
          </div>
        </div>

        <div style={styles.body}>
          {step === 1 && (
            <div>
              <h3 style={styles.stepTitle}>Select a Date</h3>
              
              <div style={styles.calendarHeader}>
                <button onClick={() => changeMonth(-1)} style={styles.monthBtn}>←</button>
                <div style={styles.monthTitle}>{getMonthName()}</div>
                <button onClick={() => changeMonth(1)} style={styles.monthBtn}>→</button>
              </div>

              <div style={styles.weekdaysHeader}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} style={styles.weekday}>{day}</div>
                ))}
              </div>

              <div style={styles.monthGrid}>
                {getMonthDates().map((date, index) => {
                  if (!date) {
                    return <div key={'empty-' + index} style={styles.emptyDay}></div>;
                  }
                  
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isPast = date < today;
                  const dateISO = formatDateISO(date);
                  const isSelected = selectedDate === dateISO;
                  
                  return (
                    <button 
                      key={dateISO} 
                      onClick={() => !isPast && setSelectedDate(dateISO)} 
                      disabled={isPast}
                      style={{
                        ...styles.calendarDay,
                        ...(isSelected ? styles.calendarDaySelected : {}),
                        ...(isPast ? styles.calendarDayDisabled : {})
                      }}
                    >
                      {date.getDate()}
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
              <h3 style={styles.stepTitle}>Select Time</h3>
              <p style={styles.selectedInfo}>📅 {formatDateFull(new Date(selectedDate))}</p>
              
              <div style={isMobile ? styles.mobileTimeContainer : styles.desktopTimeContainer}>
                <div style={isMobile ? styles.timeSectionMobile : styles.timeSection}>
                  <div style={isMobile ? styles.timeSectionLabelMobile : styles.timeSectionLabel}>Start Time</div>
                  <div style={styles.pickerRow}>
                    <AppleScrollPicker items={hours} value={startHour} onChange={setStartHour} pickerRef={startHourRef} />
                    <span style={styles.colon}>:</span>
                    <AppleScrollPicker items={minutes} value={startMinute} onChange={setStartMinute} pickerRef={startMinuteRef} />
                  </div>
                </div>

                {!isMobile && <div style={styles.timeDivider}>→</div>}

                <div style={isMobile ? styles.timeSectionMobile : styles.timeSection}>
                  <div style={isMobile ? styles.timeSectionLabelMobile : styles.timeSectionLabel}>End Time</div>
                  <div style={styles.pickerRow}>
                    <AppleScrollPicker items={hours} value={endHour} onChange={setEndHour} pickerRef={endHourRef} />
                    <span style={styles.colon}>:</span>
                    <AppleScrollPicker items={minutes} value={endMinute} onChange={setEndMinute} pickerRef={endMinuteRef} />
                  </div>
                </div>
              </div>

              {!isValidTimeRange() && (
                <div style={styles.errorBox}>
                  ⚠️ End time must be after start time
                </div>
              )}

              <div style={isMobile ? styles.timePreviewMobile : styles.timePreview}>
                <div style={styles.timePreviewLabel}>Selected Time</div>
                <div style={styles.timePreviewValue}>{getTimeString()}</div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} style={styles.btnBack}>
                  ← Back
                </button>
                <button 
                  onClick={() => {
                    setSelectedTimeSlot(getTimeString());
                    setStep(3);
                  }} 
                  disabled={!isValidTimeRange()} 
                  style={{
                    ...styles.btnNext, 
                    opacity: !isValidTimeRange() ? 0.5 : 1, 
                    cursor: !isValidTimeRange() ? 'not-allowed' : 'pointer'
                  }}
                >
                  Continue to Confirm →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={styles.stepTitle}>Confirm Booking</h3>
              
              <div style={styles.summary}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Provider:</span>
                  <span style={styles.summaryValue}>{profile.name}</span>
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
                  <span style={styles.summaryValue}>{customerName || 'Not set'}</span>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Booking for *</label>
                <input 
                  type="text"
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  style={styles.input}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message (Optional)</label>
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  style={styles.textarea} 
                  placeholder="Any special requests or notes for the provider..." 
                  rows={4}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(2)} style={styles.btnBack}>
                  ← Back
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={submitting || !customerName.trim()} 
                  style={{
                    ...styles.btnSubmit,
                    opacity: (submitting || !customerName.trim()) ? 0.5 : 1,
                    cursor: (submitting || !customerName.trim()) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? '⏳ Sending...' : '✅ Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '20px', fontFamily: '"Outfit", sans-serif' },
  modal: { background: 'white', borderRadius: 16, width: '100%', maxWidth: 700, maxHeight: '88vh', overflowY: 'auto', margin: '0 8px' },
  header: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: '12px 12px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { margin: 0, fontSize: 'clamp(18px, 5vw, 22px)', fontWeight: 800, color: 'white' },
  subtitle: { margin: '4px 0 0', fontSize: 13, color: '#d1fae5' },
  closeBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16, fontWeight: 700 },
  progress: { display: 'flex', alignItems: 'center', padding: '10px 12px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  progressStep: { display: 'flex', alignItems: 'center', gap: 6 },
  progressStepActive: { },
  progressNumber: { width: 28, height: 28, borderRadius: '50%', background: '#e5e7eb', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 },
  progressLabel: { fontSize: 12, color: '#6b7280', fontWeight: 600 },
  progressLine: { flex: 1, height: 2, background: '#e5e7eb', margin: '0 6px' },
  body: { padding: '12px 10px' },
  stepTitle: { fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 },
  calendarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '8px 12px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', borderRadius: 10 },
  monthBtn: { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: '"Outfit", sans-serif' },
  monthTitle: { color: 'white', fontSize: 16, fontWeight: 700 },
  weekdaysHeader: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 6, padding: '6px 0' },
  weekday: { textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' },
  monthGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 12 },
  emptyDay: { padding: '10px', opacity: 0 },
  calendarDay: { padding: '8px 6px', border: '1.5px solid #e5e7eb', borderRadius: 8, background: 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: '"Outfit", sans-serif', fontSize: 14, fontWeight: 600, color: '#111827' },
  calendarDaySelected: { borderColor: '#065f46', background: '#ecfdf5', color: '#065f46', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.2)' },
  calendarDayDisabled: { opacity: 0.3, cursor: 'not-allowed', background: '#f9fafb' },
  selectedInfo: { fontSize: 12, color: '#6b7280', marginBottom: 8, background: '#f9fafb', padding: 6, borderRadius: 8, textAlign: 'center' },
  
  // MOBILE TIME CONTAINER
  mobileTimeContainer: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6 },
  timeSectionMobile: { background: '#f9fafb', borderRadius: 8, padding: 6, border: '2px solid #e5e7eb' },
  timeSectionLabelMobile: { fontSize: 10, fontWeight: 700, color: '#065f46', marginBottom: 4, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' },
  scrollPickerWrapperMobile: { position: 'relative', width: 70, height: 100, overflow: 'hidden' },
  scrollSpacerMobile: { height: 30 },
  timePreviewMobile: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: 6, borderRadius: 8, marginBottom: 8, textAlign: 'center' },
  
  // DESKTOP TIME CONTAINER  
  desktopTimeContainer: { display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8, flexWrap: 'wrap' },
  timeSection: { background: '#f9fafb', borderRadius: 10, padding: 10, border: '2px solid #e5e7eb', flex: '1 1 auto', maxWidth: 200, minWidth: 160 },
  timeSectionLabel: { fontSize: 11, fontWeight: 700, color: '#065f46', marginBottom: 8, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' },
  scrollPickerWrapper: { position: 'relative', width: 70, height: 160, overflow: 'hidden' },
  scrollSpacer: { height: 60 },
  timePreview: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: 10, borderRadius: 10, marginBottom: 12, textAlign: 'center' },
  
  pickerRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  scrollPickerHighlight: { 
    position: 'absolute', 
    top: '50%', 
    left: 0, 
    right: 0, 
    height: 40, 
    transform: 'translateY(-50%)', 
    background: 'rgba(236, 253, 245, 0.6)', 
    border: '2px solid #065f46', 
    borderRadius: 8, 
    pointerEvents: 'none', 
    zIndex: 1 
  },
  scrollPicker: { 
    height: '100%', 
    overflowY: 'scroll', 
    scrollSnapType: 'y mandatory', 
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none'
  },
  scrollItem: { 
    height: 40, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontWeight: 700, 
    color: '#065f46', 
    scrollSnapAlign: 'center',
    transition: 'all 0.2s',
    fontFamily: '"Outfit", sans-serif'
  },
  colon: { fontSize: 20, fontWeight: 700, color: '#065f46', padding: '0 4px' },
  timeDivider: { fontSize: 16, color: '#6b7280', fontWeight: 700, display: 'flex', alignItems: 'center', padding: '0 4px' },
  errorBox: { background: '#fee2e2', color: '#dc2626', padding: 8, borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 10, textAlign: 'center' },
  timePreviewLabel: { fontSize: 11, color: '#d1fae5', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' },
  timePreviewValue: { fontSize: 16, color: 'white', fontWeight: 800 },
  summary: { background: '#f9fafb', padding: 12, borderRadius: 12, marginBottom: 12, border: '1px solid #e5e7eb' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: '#6b7280', fontWeight: 600 },
  summaryValue: { fontSize: 14, color: '#111827', fontWeight: 700 },
  formGroup: { marginBottom: 12 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontFamily: '"Outfit", sans-serif', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 13, fontFamily: '"Outfit", sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box' },
  btnNext: { flex: 1, padding: '10px 14px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', width: '100%' },
  btnBack: { padding: '10px 14px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  btnSubmit: { flex: 1, padding: '10px 14px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)' }
};

export default BookingCalendar;
