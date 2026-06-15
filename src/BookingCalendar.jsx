import React, { useState, useEffect, useRef } from 'react';
import { getCurrencyCode, getCurrencySymbol } from './currency';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

function BookingCalendar({ profile, onClose }) {
  // Multi-day vs hourly booking based on provider's price_type
  const isDayBooking = profile?.price_type === 'day';

  // Default schedule (used if provider has no schedule yet)
  const defaultSchedule = {
    mon: { open: true, start: '09:00', end: '18:00' },
    tue: { open: true, start: '09:00', end: '18:00' },
    wed: { open: true, start: '09:00', end: '18:00' },
    thu: { open: true, start: '09:00', end: '18:00' },
    fri: { open: true, start: '09:00', end: '18:00' },
    sat: { open: true, start: '09:00', end: '18:00' },
    sun: { open: false, start: '09:00', end: '18:00' }
  };
  const providerSchedule = profile?.schedule || defaultSchedule;

  // Map Date to day-key ('mon', 'tue', ...)
  const dayKeyFromDate = (date) => {
    const keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return keys[date.getDay()];
  };

  // Check if a specific date is available per schedule
  const isDateAvailable = (date) => {
    const dayKey = dayKeyFromDate(date);
    return providerSchedule[dayKey]?.open === true;
  };

  // Get provider's working hours for a date (returns { startH, startM, endH, endM } or null)
  const getProviderHoursForDate = (dateISO) => {
    if (!dateISO) return null;
    const date = new Date(dateISO);
    const dayKey = dayKeyFromDate(date);
    const dayInfo = providerSchedule[dayKey];
    if (!dayInfo?.open) return null;
    const [sH, sM] = (dayInfo.start || '09:00').split(':').map(Number);
    const [eH, eM] = (dayInfo.end || '18:00').split(':').map(Number);
    return { startH: sH, startM: sM, endH: eH, endM: eM };
  };

  // Check if every day from start to end (inclusive) is available
  const isRangeFullyAvailable = (startISO, daysCount) => {
    if (!startISO || !daysCount) return false;
    const start = new Date(startISO);
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      if (!isDateAvailable(d)) return false;
    }
    return true;
  };

  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [startHour, setStartHour] = useState(10);
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(11);
  const [endMinute, setEndMinute] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [locationMethod, setLocationMethod] = useState('manual');
  const [gpsLocation, setGpsLocation] = useState(null);
  const [address, setAddress] = useState({
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
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
    const fetchBookedSlots = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('time_slot, status, payment_status, created_at')
          .eq('profile_id', profile.id)
          .eq('booking_date', selectedDate)
          .in('status', ['pending', 'confirmed']);
        
        if (error) throw error;
        
        // Slot blockiert, wenn:
        // - Buchung 'confirmed' (Provider hat akzeptiert) ODER
        // - Zahlung autorisiert/captured ODER
        // - Buchung ist 'pending' und juenger als 10 Min (Kunde tippt gerade Kartendaten)
        const HOLD_MS = 10 * 60 * 1000;
        const now = Date.now();
        const blocking = (data || []).filter(b => {
          if (b.status === 'confirmed') return true;
          if (b.payment_status === 'authorized' || b.payment_status === 'captured') return true;
          if (b.status === 'pending' && b.created_at) {
            const ageMs = now - new Date(b.created_at).getTime();
            if (ageMs < HOLD_MS) return true;
          }
          return false;
        });
        const slots = blocking.map(b => b.time_slot);
        setBookedSlots(slots);
        console.log('Booked slots for', selectedDate, ':', slots);
      } catch (error) {
        console.error('Error fetching booked slots:', error);
        setBookedSlots([]);
      }
    };

    if (selectedDate && profile?.id) {
      fetchBookedSlots();
    }
  }, [selectedDate, profile?.id]);

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

  const sh = startHour.toString().padStart(2, '0');
  const sm = startMinute.toString().padStart(2, '0');
  const eh = endHour.toString().padStart(2, '0');
  const em = endMinute.toString().padStart(2, '0');

  // Live-Preis: Stundenlohn x gebuchte Dauer (fuer Anzeige in der Confirm-Page)
  const liveDuration = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
  const liveHourlyMatch = String(profile.price || '').match(/(\d+)/);
  const liveHourlyRate = liveHourlyMatch ? parseInt(liveHourlyMatch[0]) : 0;
  const liveCurSym = getCurrencySymbol(getCurrencyCode(profile.price));
  const livePrice = liveDuration > 0 ? Math.round(liveHourlyRate * liveDuration) : 0;

  const getTimeString = () => {
    return `${sh}:${sm} - ${eh}:${em}`;
  };

  const getValidationError = () => {
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    
    if (end <= start) {
      return 'End time must be after start time';
    }
    
    const overlappingSlot = bookedSlots.find(bookedSlot => {
      const [bookedStart, bookedEnd] = bookedSlot.split(' - ');
      const [bsH, bsM] = bookedStart.split(':').map(Number);
      const [beH, beM] = bookedEnd.split(':').map(Number);
      
      const bookedStartMin = bsH * 60 + bsM;
      const bookedEndMin = beH * 60 + beM;
      
      return (start < bookedEndMin && end > bookedStartMin);
    });
    
    if (overlappingSlot) {
      return `Unavailable - Already booked ${overlappingSlot}`;
    }
    
    if (isPastTime()) {
      return 'Please book at least 30 minutes in advance';
    }
    
    return null;
  };

  // Helper: prueft ob der Slot zu kurzfristig ist (Start muss >= jetzt + 30 Min)
  const isPastTime = () => {
    if (!selectedDate) return false;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    // Nur fuer heute relevant; zukuenftige Tage sind nie "past"
    if (selectedDate !== todayStr) return false;
    const nowMinutes = today.getHours() * 60 + today.getMinutes();
    const startMinutes = startHour * 60 + startMinute;
    // Mindestens 30 Min Vorlauf
    return startMinutes < nowMinutes + 30;
  };

  // Generate hourly start slots from 8:00 to 21:00
  const getAllStartSlots = () => {
    const slots = [];
    for (let h = 8; h <= 21; h++) {
      slots.push({ h, m: 0, label: `${h.toString().padStart(2, '0')}:00` });
    }
    return slots;
  };

  // Check if slot is outside provider's working hours for selected date
  const slotIsOutsideHours = (h, m, durationMin) => {
    const hours = getProviderHoursForDate(selectedDate);
    if (!hours) return true;  // No hours available = blocked
    const slotStart = h * 60 + m;
    const slotEnd = slotStart + durationMin;
    const providerStart = hours.startH * 60 + hours.startM;
    const providerEnd = hours.endH * 60 + hours.endM;
    return slotStart < providerStart || slotEnd > providerEnd;
  };

  // Check if a slot (h:m) plus duration would overlap with booked slots
  const wouldOverlapBooked = (h, m, durationMin) => {
    const startMin = h * 60 + m;
    const endMin = startMin + durationMin;
    return bookedSlots.some(slot => {
      const [bs, be] = slot.split(' - ');
      const [bsH, bsM] = bs.split(':').map(Number);
      const [beH, beM] = be.split(':').map(Number);
      const bsMin = bsH * 60 + bsM;
      const beMin = beH * 60 + beM;
      return startMin < beMin && endMin > bsMin;
    });
  };

  // Check if slot is past (with 30min buffer for today)
  const slotIsPast = (h, m) => {
    if (!selectedDate) return false;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    if (selectedDate !== todayStr) return false;
    const nowMinutes = today.getHours() * 60 + today.getMinutes();
    const slotMinutes = h * 60 + m;
    return slotMinutes < nowMinutes + 30;
  };

  // Duration in minutes (current state)
  const currentDurationMin = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

  // Set start slot + duration (updates all 4 states)
  const setStartSlotAndDuration = (h, m, durationMin) => {
    setStartHour(h);
    setStartMinute(m);
    const endTotal = h * 60 + m + durationMin;
    setEndHour(Math.floor(endTotal / 60));
    setEndMinute(endTotal % 60);
  };

  // Duration presets in minutes (full hours only)
  const DURATION_OPTIONS = [
    { label: '1h', min: 60 },
    { label: '2h', min: 120 },
    { label: '3h', min: 180 },
    { label: '4h', min: 240 }
  ];

  const isValidTimeRange = () => {
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    
    if (end <= start) return false;
    if (isPastTime()) return false;
    
    const isBooked = bookedSlots.some(bookedSlot => {
      const [bookedStart, bookedEnd] = bookedSlot.split(' - ');
      const [bsH, bsM] = bookedStart.split(':').map(Number);
      const [beH, beM] = bookedEnd.split(':').map(Number);
      
      const bookedStartMin = bsH * 60 + bsM;
      const bookedEndMin = beH * 60 + beM;
      
      return (start < bookedEndMin && end > bookedStartMin);
    });
    
    if (isBooked) {
      return false;
    }
    
    return true;
  };

  const formatDateFull = (date) => {
    if (typeof date === 'string') {
      const [year, month, day] = date.split('-').map(Number);
      date = new Date(year, month - 1, day);
    }
    return date.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatDateISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {

    // Check if user is logged in
    if (!user) {
      alert("Please sign up or login to book this expert!");
      onClose();
      window.navigateTo("signup");
      return;
    }
    // Validation: hourly vs day-booking
    if (!selectedDate || !customerName.trim()) {
      alert('Please complete all required fields');
      return;
    }
    if (isDayBooking) {
      if (!endDate) {
        alert('Please select an end date for your booking');
        return;
      }
    } else {
      if (!selectedTimeSlot) {
        alert('Please select a time slot');
        return;
      }
    }

    setSubmitting(true);

    // Calculate booking specifics based on type (hourly vs day)
    let durationHours, servicePrice, bookingTimeSlot, bookingEndDate;
    
    if (isDayBooking) {
      // Day-Booking
      const start = new Date(selectedDate);
      const end = new Date(endDate);
      const days = Math.floor((end - start) / (24 * 60 * 60 * 1000)) + 1;
      const dailyMatch = String(profile.price || '').match(/(\d+)/);
      const dailyRate = dailyMatch ? parseInt(dailyMatch[0]) : 0;
      servicePrice = days * dailyRate;
      durationHours = days * 24;
      bookingTimeSlot = `${days} day${days > 1 ? 's' : ''}`;
      bookingEndDate = endDate;
    } else {
      // Hourly-Booking
      const startMin = startHour * 60 + startMinute;
      const endMin = endHour * 60 + endMinute;
      durationHours = (endMin - startMin) / 60;
      const hourlyMatch = String(profile.price || '').match(/(\d+)/);
      const hourlyRate = hourlyMatch ? parseInt(hourlyMatch[0]) : 0;
      servicePrice = Math.round(hourlyRate * durationHours);
      bookingTimeSlot = selectedTimeSlot;
      bookingEndDate = null;
    }

    try {
      const { data, error } = await supabase.from('bookings').insert([{
        profile_id: profile.id,
        customer_name: customerName,
        customer_email: user.email,
        customer_phone: '',
        booking_date: selectedDate,
        end_date: bookingEndDate,
        time_slot: bookingTimeSlot,
        service_address: locationMethod === 'gps' 
          ? `GPS Location: ${gpsLocation.latitude.toFixed(6)}, ${gpsLocation.longitude.toFixed(6)}`
          : `${address.street} ${address.houseNumber}, ${address.postalCode} ${address.city}`,
        address_notes: address.notes,
        service_name: profile.subcategory || profile.job || "Service",
        location_type: locationMethod,
        gps_latitude: locationMethod === 'gps' ? gpsLocation.latitude : null,
        gps_longitude: locationMethod === 'gps' ? gpsLocation.longitude : null,
        gps_accuracy: locationMethod === 'gps' ? gpsLocation.accuracy : null,
        message: message,
        total_price: profile.price,
        service_price: servicePrice,
        duration_hours: durationHours,
        status: 'pending'
      }]).select();

      if (error) throw error;

      // Booking erstellt - redirect zur Payment Page mit booking_id
      const bookingId = data?.[0]?.id;
      onClose();
      
      // Setze booking_id für Payment Page
      window.currentBookingId = bookingId;
      window.navigateTo('payment');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
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
    // Sanft exakt zur Mitte einrasten (iOS-Feeling)
    const target = clampedIndex * itemHeight;
    if (Math.abs(scrollTop - target) > 1) {
      ref.current.scrollTo({ top: target, behavior: 'smooth' });
    }
  };

  const AppleScrollPicker = ({ items, value, onChange, pickerRef }) => {
    return (
      <div style={isMobile ? styles.scrollPickerWrapperMobile : styles.scrollPickerWrapper}>
        <div style={styles.scrollPickerHighlight}></div>
        <div 
          ref={pickerRef}
          style={styles.scrollPicker}
          onScroll={(e) => {
                clearTimeout(pickerRef.current?._timeout);
                pickerRef.current._timeout = setTimeout(() => {
                  handleScroll(pickerRef, items, onChange);
                }, 50);
              }}
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
            <span style={styles.progressLabel}>Address</span>
          </div>
          <div style={styles.progressLine}></div>
          <div style={{...styles.progressStep, ...(step >= 4 ? styles.progressStepActive : {})}}>
            <div style={styles.progressNumber}>4</div>
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
                  const maxDate = new Date(today);
                  maxDate.setDate(maxDate.getDate() + 6);
                  const isTooFar = date > maxDate;
                  const isUnavailable = !isDateAvailable(date);
                  const isDisabled = isPast || isTooFar || isUnavailable;
                  const dateISO = formatDateISO(date);
                  const isSelected = selectedDate === dateISO;
                  
                  // For day-booking: highlight range from selectedDate to endDate
                  const isInRange = isDayBooking && selectedDate && endDate &&
                    dateISO > selectedDate && dateISO <= endDate;
                  
                  return (
                    <button 
                      key={dateISO} 
                      onClick={() => !isDisabled && setSelectedDate(dateISO)} 
                      disabled={isDisabled}
                      title={isUnavailable ? 'Provider not available on this day' : (isTooFar ? 'Max. 6 days in advance' : '')}
                      style={{
                        ...styles.calendarDay,
                        ...(isSelected ? styles.calendarDaySelected : {}),
                        ...(isInRange ? styles.calendarDayInRange : {}),
                        ...(isDisabled ? styles.calendarDayDisabled : {})
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', margin: '12px 0 0', fontFamily: '"Outfit", sans-serif' }}>
                You can book up to 6 days in advance
              </p>

              {isDayBooking && (
                <div style={{ marginTop: 16, padding: 14, background: '#ecfdf5', borderRadius: 12, border: '1px solid #14b8a6' }}>
                  <div style={{ fontSize: 12, color: '#065f46', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
                    Service Details
                  </div>
                  <div style={{ fontSize: 14, color: '#065f46', fontWeight: 600 }}>
                    📌 1 Day = {profile?.day_duration_hours || 8} hours
                    {profile?.day_duration_hours === 8 && ' (Workday)'}
                    {profile?.day_duration_hours === 12 && ' (Overnight)'}
                    {profile?.day_duration_hours === 24 && ' (Live-in)'}
                  </div>
                  {selectedDate && (() => {
                    const hours = getProviderHoursForDate(selectedDate);
                    if (!hours) return null;
                    const startStr = `${String(hours.startH).padStart(2,'0')}:${String(hours.startM).padStart(2,'0')}`;
                    return (
                      <div style={{ fontSize: 13, color: '#065f46', marginTop: 6 }}>
                        🕐 Service starts at {startStr} on your start date
                      </div>
                    );
                  })()}
                </div>
              )}
              {isDayBooking && selectedDate && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                    How many days?
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                    {[1, 2, 3, 4, 5, 6].map(days => {
                      // Berechne EndDate fuer diese Anzahl Tage
                      const start = new Date(selectedDate);
                      const calcEnd = new Date(start);
                      calcEnd.setDate(start.getDate() + days - 1);
                      const calcEndISO = formatDateISO(calcEnd);
                      // Check: ueberschreitet 6-Tage-Max?
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const maxAllowed = new Date(today);
                      maxAllowed.setDate(maxAllowed.getDate() + 6);
                      const exceedsMax = calcEnd > maxAllowed;
                      const rangeUnavailable = !isRangeFullyAvailable(selectedDate, days);
                      const isDisabled = exceedsMax || rangeUnavailable;
                      
                      const currentDays = endDate ? 
                        Math.floor((new Date(endDate) - new Date(selectedDate)) / (24 * 60 * 60 * 1000)) + 1 : 0;
                      const isSelected = currentDays === days;
                      
                      return (
                        <button
                          key={days}
                          type="button"
                          onClick={() => !isDisabled && setEndDate(calcEndISO)}
                          disabled={isDisabled}
                          title={rangeUnavailable ? 'Provider not available on all days' : (exceedsMax ? 'Exceeds 6-day limit' : '')}
                          style={{
                            padding: '12px 4px',
                            background: isSelected ? 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)' : (isDisabled ? '#f9fafb' : '#fff'),
                            color: isSelected ? '#fff' : (isDisabled ? '#d1d5db' : '#065f46'),
                            border: '2px solid ' + (isSelected ? '#065f46' : (isDisabled ? '#f3f4f6' : '#ecfdf5')),
                            borderRadius: 10,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            fontFamily: '"Outfit", sans-serif',
                            boxShadow: isSelected ? '0 4px 12px rgba(20, 184, 166, 0.3)' : 'none'
                          }}
                        >
                          {days}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {isDayBooking && selectedDate && endDate && (
                <div style={{ background: '#ecfdf5', borderRadius: 12, padding: 16, marginTop: 16, border: '1px solid #14b8a6' }}>
                  <div style={{ fontSize: 13, color: '#065f46', fontWeight: 600, marginBottom: 4 }}>BOOKING PREVIEW</div>
                  <div style={{ fontSize: 15, color: '#065f46', fontWeight: 700 }}>
                    {selectedDate} → {endDate}
                  </div>
                  <div style={{ fontSize: 13, color: '#065f46', marginTop: 4 }}>
                    {(() => {
                      const start = new Date(selectedDate);
                      const end = new Date(endDate);
                      const days = Math.floor((end - start) / (24 * 60 * 60 * 1000)) + 1;
                      const dailyMatch = String(profile.price || '').match(/(\d+)/);
                      const dailyRate = dailyMatch ? parseInt(dailyMatch[0]) : 0;
                      const total = days * dailyRate;
                      return `${days} day${days > 1 ? 's' : ''} × ${dailyRate} = ${total}`;
                    })()}
                  </div>
                </div>
              )}
              <button 
                onClick={() => {
                  if (isDayBooking) {
                    setStep(3);
                  } else {
                    setStep(2);
                  }
                }} 
                disabled={!selectedDate || (isDayBooking && !endDate)} 
                style={{...styles.btnNext, opacity: (!selectedDate || (isDayBooking && !endDate)) ? 0.5 : 1, cursor: (!selectedDate || (isDayBooking && !endDate)) ? 'not-allowed' : 'pointer'}}
              >
                {isDayBooking ? 'Continue to Location →' : 'Continue to Time Selection →'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={styles.stepTitle}>Select Time</h3>
              <p style={styles.selectedInfo}>{formatDateFull(selectedDate)}</p>
              
              <div style={styles.durationSection}>
                <div style={styles.durationLabel}>Duration</div>
                <div style={styles.durationGrid}>
                  {DURATION_OPTIONS.map(opt => {
                    const isSelected = currentDurationMin === opt.min;
                    return (
                      <button
                        key={opt.min}
                        type="button"
                        onClick={() => setStartSlotAndDuration(startHour, startMinute, opt.min)}
                        style={{
                          ...styles.durationBtn,
                          ...(isSelected ? styles.durationBtnSelected : {})
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={styles.slotsSection}>
                <div style={styles.slotsLabel}>Start Time</div>
                <div style={styles.slotsGrid}>
                  {getAllStartSlots().map(slot => {
                    const past = slotIsPast(slot.h, slot.m);
                    const booked = wouldOverlapBooked(slot.h, slot.m, currentDurationMin);
                    const outsideHours = slotIsOutsideHours(slot.h, slot.m, currentDurationMin);
                    const isSelected = startHour === slot.h && startMinute === slot.m;
                    const disabled = past || booked || outsideHours;
                    return (
                      <button
                        key={slot.label}
                        type="button"
                        onClick={() => !disabled && setStartSlotAndDuration(slot.h, slot.m, currentDurationMin)}
                        disabled={disabled}
                        style={{
                          ...styles.slotBtn,
                          ...(isSelected && !disabled ? styles.slotBtnSelected : {}),
                          ...(disabled ? styles.slotBtnDisabled : {}),
                          ...(booked && !past ? styles.slotBtnBooked : {})
                        }}
                        title={past ? 'Past' : booked ? 'Already booked' : outsideHours ? 'Outside provider hours' : ''}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={styles.errorSlot}>
                {!isValidTimeRange() && getValidationError() && (
                  <div style={styles.errorBox}>
                    ⚠️ {getValidationError()}
                  </div>
                )}
              </div>

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
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={styles.stepTitle}>Service Location</h3>
              
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 15 }}>
                    <input 
                      type="radio" 
                      name="locationMethod"
                      checked={locationMethod === 'manual'}
                      onChange={() => setLocationMethod('manual')}
                      style={{ marginRight: 8, cursor: 'pointer' }}
                    />
                    Enter address manually
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 15 }}>
                    <input 
                      type="radio" 
                      name="locationMethod"
                      checked={locationMethod === 'gps'}
                      onChange={() => setLocationMethod('gps')}
                      style={{ marginRight: 8, cursor: 'pointer' }}
                    />
                    Share my location (GPS)
                  </label>
                </div>
              </div>

              {locationMethod === 'gps' && (
                <div style={{ marginBottom: 24 }}>
                  {!gpsLocation ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setGpsLocation({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy
                              });
                            },
                            (error) => {
                              alert('Unable to get your location. Please enable location services or use manual address entry.');
                              console.error('GPS Error:', error);
                            }
                          );
                        } else {
                          alert('Geolocation is not supported by your browser.');
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 12,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      Share My Current Location
                    </button>
                  ) : (
                    <div style={{ 
                      padding: 20, 
                      background: '#f0fdf4', 
                      borderRadius: 12,
                      border: '2px solid #86efac'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#166534', fontWeight: 600, fontSize: 16 }}>
                        Location Captured
                      </div>
                      <div style={{ fontSize: 14, color: '#15803d', marginBottom: 6 }}>
                        Latitude: {gpsLocation.latitude.toFixed(6)}
                      </div>
                      <div style={{ fontSize: 14, color: '#15803d', marginBottom: 6 }}>
                        Longitude: {gpsLocation.longitude.toFixed(6)}
                      </div>
                      <div style={{ fontSize: 13, color: '#16a34a', marginTop: 8, padding: 8, background: 'white', borderRadius: 6 }}>
                        Accuracy: ±{Math.round(gpsLocation.accuracy)} meters
                      </div>
                      <button
                        type="button"
                        onClick={() => setGpsLocation(null)}
                        style={{
                          marginTop: 16,
                          padding: '10px 20px',
                          background: 'white',
                          border: '2px solid #86efac',
                          borderRadius: 8,
                          color: '#166534',
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 500
                        }}
                      >
                        Update Location
                      </button>
                      
                      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '2px solid #86efac' }}>
                        <label style={{ ...styles.label, fontSize: 14, marginBottom: 8 }}>
                          Additional notes (optional)
                        </label>
                        <textarea
                          placeholder="e.g., Near the big mango tree, blue house with red roof..."
                          value={address.notes}
                          onChange={(e) => setAddress({...address, notes: e.target.value})}
                          style={{
                            ...styles.input,
                            minHeight: 80,
                            resize: 'vertical',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {locationMethod === 'manual' && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Street *</label>
                    <input 
                      type="text"
                      value={address.street} 
                      onChange={(e) => setAddress({...address, street: e.target.value})} 
                      style={styles.input}
                      placeholder="e.g. Main Street"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 16 }}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>City *</label>
                      <input 
                        type="text"
                        value={address.city} 
                        onChange={(e) => setAddress({...address, city: e.target.value})} 
                        style={styles.input}
                        placeholder="e.g. Bangkok"
                        required
                      />
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Postal Code *</label>
                      <input 
                        type="text"
                        value={address.postalCode} 
                        onChange={(e) => setAddress({...address, postalCode: e.target.value})} 
                        style={styles.input}
                        placeholder="e.g. 10110"
                        required
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>House/Building Number *</label>
                    <input 
                      type="text"
                      value={address.houseNumber} 
                      onChange={(e) => setAddress({...address, houseNumber: e.target.value})} 
                      style={styles.input}
                      placeholder="e.g. 123"
                      required
                    />
                  </div>

                  <div style={{ marginTop: 24 }}>
                    <label style={styles.label}>Additional notes (optional)</label>
                    <textarea
                      placeholder="Any additional details..."
                      value={address.notes}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 500) {
                          setAddress({...address, notes: value});
                        }
                      }}
                      style={{
                        ...styles.input,
                        minHeight: 100,
                        resize: 'vertical',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                      }}
                    />
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4, textAlign: 'right' }}>
                      {address.notes.length}/500
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                <button 
                  type="button"
                  onClick={() => setStep(2)} 
                  style={styles.btnBack}
                >
                  ← Back
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (locationMethod === 'manual' && (!address.street || !address.city || !address.postalCode || !address.houseNumber)) {
                      alert('Please fill in all required address fields');
                      return;
                    }
                    if (locationMethod === 'gps' && !gpsLocation) {
                      alert('Please share your location or switch to manual address entry');
                      return;
                    }
                    setStep(4);
                  }} 
                  style={styles.btnNext}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={styles.stepTitle}>Confirm and Pay</h3>
              
              <div style={styles.summary}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Expert:</span>
                  <span style={styles.summaryValue}>{profile.name}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Date:</span>
                  <span style={styles.summaryValue}>{formatDateFull(selectedDate)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Time:</span>
                  <span style={styles.summaryValue}>{selectedTimeSlot}</span>
                </div>
                <div style={{...styles.summaryRow, alignItems: 'flex-start'}}>
                  <span style={styles.summaryLabel}>Address:</span>
                  <span style={styles.summaryValue}>
                    {locationMethod === 'gps' ? (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#10b981', fontWeight: 500, marginBottom: 6 }}>
                          GPS Location Shared
                        </div>
                        <div style={{ fontSize: 13, color: '#6b7280' }}>
                          Lat: {gpsLocation?.latitude.toFixed(6)}
                        </div>
                        <div style={{ fontSize: 13, color: '#6b7280' }}>
                          Lng: {gpsLocation?.longitude.toFixed(6)}
                        </div>
                        {address.notes && (
                          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6, fontStyle: 'italic' }}>
                            Note: {address.notes}
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {isMobile ? (
                          <>
                            <div>{address.street} {address.houseNumber}</div>
                            <div style={{ marginTop: 4, textAlign: 'right' }}>{address.postalCode} {address.city}</div>
                          </>
                        ) : (
                          <>{address.street} {address.houseNumber}, {address.postalCode} {address.city}</>
                        )}
                        {address.notes && (
                          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6, fontStyle: 'italic' }}>
                            Note: {address.notes}
                          </div>
                        )}
                      </>
                    )}
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Price:</span>
                  <span style={styles.summaryValue}>{liveCurSym}{livePrice} ({liveCurSym}{liveHourlyRate} × {liveDuration} {liveDuration === 1 ? 'hr' : 'hrs'})</span>
                </div>
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginTop: 12,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: '#065f46'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>💡 How it works</div>
                  Your card is only <strong>pre-authorized</strong> now — no money is charged yet. The full amount will be automatically captured 15 minutes after the service is completed. If anything goes wrong, you have 24 hours to contact us.
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
                  onChange={(e) => {
                    const value = e.target.value;
                    const digitCount = (value.match(/\d/g) || []).length;
                    
                    if (value.includes('@') || 
                        value.includes('http') || 
                        value.includes('www.') ||
                        value.includes('+49') ||
                        value.includes('+43') ||
                        value.includes('+41') ||
                        digitCount >= 7) {
                      alert('⚠️ Please enter only your name. No emails, phone numbers or links allowed. All communication happens through Helperr Messages.');
                      return;
                    }
                    setCustomerName(value);
                  }} 
                  style={styles.input}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Message (Optional)</label>
                <textarea 
                  value={message}
                  onChange={(e) => {
                    const value = e.target.value;
                    const digitCount = (value.match(/\d/g) || []).length;
                    
                    if (value.includes('@') || 
                        value.includes('http') || 
                        value.includes('www.') ||
                        value.includes('+49') ||
                        value.includes('+43') ||
                        value.includes('+41') ||
                        digitCount >= 7) {
                      alert('⚠️ No emails, phone numbers or links allowed. All communication happens through Helperr Messages.');
                      return;
                    }
                    setMessage(value);
                  }} 
                  style={{
                    ...styles.textarea,
                    ...(isMobile ? { height: 50, minHeight: 50 } : {})
                  }} 
                  placeholder="Any special requests or notes for the expert..." 
                  rows={4}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(3)} style={styles.btnBack}>
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
                  {submitting ? 'Sending...' : 'Confirm and Pay'}
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
  stepTitle: { fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 },
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
  
  mobileTimeContainer: { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6 },
  timeSectionMobile: { background: '#f9fafb', borderRadius: 8, padding: 6, border: '2px solid #e5e7eb' },
  timeSectionLabelMobile: { fontSize: 10, fontWeight: 700, color: '#065f46', marginBottom: 4, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' },
  scrollPickerWrapperMobile: { position: 'relative', width: 70, height: 100, overflow: 'hidden' },
  scrollSpacerMobile: { height: 30 },
  timePreviewMobile: { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: 6, borderRadius: 8, marginBottom: 8, textAlign: 'center' },
  
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
    transition: 'opacity 0.2s ease, transform 0.2s ease, font-size 0.2s ease',
    fontFamily: '"Outfit", sans-serif'
  },
  colon: { fontSize: 20, fontWeight: 700, color: '#065f46', padding: '0 4px' },
  timeDivider: { fontSize: 16, color: '#6b7280', fontWeight: 700, display: 'flex', alignItems: 'center', padding: '0 4px' },
  errorSlot: { minHeight: 48, marginTop: 8, marginBottom: 8 },
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
  btnSubmit: { flex: 1, padding: '10px 14px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)' },
  btnSecondary: { padding: '14px 24px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s' },
  btnPrimary: { flex: 1, padding: '14px 24px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)', transition: 'all 0.2s' },
  footer: { display: 'flex', gap: 12, marginTop: 20 },
  durationSection: { marginBottom: 20 },
  durationLabel: { fontSize: 13, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 },
  durationGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  durationBtn: { padding: '10px 4px', background: '#fff', color: '#065f46', border: '2px solid #ecfdf5', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.15s' },
  durationBtnSelected: { background: 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)', color: '#fff', borderColor: '#065f46', boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)' },
  slotsSection: { marginBottom: 16 },
  slotsLabel: { fontSize: 13, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 },
  slotsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  slotBtn: { padding: '12px 4px', background: '#fff', color: '#065f46', border: '2px solid #ecfdf5', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.15s' },
  slotBtnSelected: { background: 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)', color: '#fff', borderColor: '#065f46', boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)' },
  slotBtnDisabled: { background: '#f9fafb', color: '#d1d5db', borderColor: '#f3f4f6', cursor: 'not-allowed', textDecoration: 'line-through' },
  slotBtnBooked: { background: '#fef2f2', color: '#dc2626', borderColor: '#fee2e2', cursor: 'not-allowed', textDecoration: 'line-through' },
  calendarDayInRange: { background: '#ccfbf1', color: '#065f46', borderColor: '#14b8a6' }
};

export default BookingCalendar;
