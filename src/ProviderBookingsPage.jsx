import { Capacitor } from '@capacitor/core';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';

function ProviderBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // === Calendar View State ===
  const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', or 'week'
  const [isMobile, setIsMobile] = useState(false);
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ESC key closes modal
  useEffect(() => {
    if (!selectedBookingForModal) return;
    const handleEsc = (e) => { if (e.key === 'Escape') setSelectedBookingForModal(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedBookingForModal]);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [expandedDate, setExpandedDate] = useState(null);
  const [expandedBookingId, setExpandedBookingId] = useState(null);

  // Helper: format date as YYYY-MM-DD
  const formatDateISOLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper: get all bookings for a given date (handles multi-day bookings)
  const getBookingsForDate = (dateISO) => {
    return filteredBookings.filter(b => {
      const start = b.booking_date;
      const end = b.end_date || b.booking_date;
      return dateISO >= start && dateISO <= end;
    });
  };

  // Helper: parse time_slot start hour for sorting (e.g. "10:00 - 11:00" -> 600, "3 days" -> 0)
  const parseSlotStartMin = (slot) => {
    if (!slot || !slot.includes(' - ')) return 0; // multi-day: top
    const [start] = slot.split(' - ');
    const [h, m] = start.split(':').map(Number);
    return h * 60 + m;
  };

  // Helper: get all dates in current calendar month
  const getCalendarMonthDates = () => {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];
    // Padding for first week (Monday-based)
    let firstWeekday = firstDay.getDay();
    firstWeekday = firstWeekday === 0 ? 6 : firstWeekday - 1; // Mon=0, Sun=6
    for (let i = 0; i < firstWeekday; i++) dates.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      dates.push(new Date(year, month, d));
    }
    return dates;
  };

  const changeCalendarMonth = (delta) => {
    setExpandedDate(null);
    setCurrentCalendarMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + delta);
      return newDate;
    });
  };

  // === Weekly View State + Helpers ===
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    // Start of current week (Monday)
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday-based
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const changeWeek = (delta) => {
    setCurrentWeekStart(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + delta * 7);
      return newDate;
    });
  };

  // Get the 7 dates of current week (Mon-Sun)
  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  // Get min/max hours across all days in current week
  // Falls back to 8-18 if no schedule data
  const getWeekHourRange = () => {
    const weekDates = getWeekDates();
    const dayKeys = ['mon','tue','wed','thu','fri','sat','sun'];
    let minH = 24, maxH = 0;
    weekDates.forEach((date, idx) => {
      const booking = filteredBookings.find(b => b.profiles?.schedule);
      const schedule = booking?.profiles?.schedule;
      if (!schedule) return;
      const jsDay = date.getDay();
      const dayKey = jsDay === 0 ? 'sun' : dayKeys[jsDay - 1];
      const dayInfo = schedule[dayKey];
      if (dayInfo?.open) {
        const [sH] = dayInfo.start.split(':').map(Number);
        const [eH, eM] = dayInfo.end.split(':').map(Number);
        if (sH < minH) minH = sH;
        if (eH + (eM > 0 ? 1 : 0) > maxH) maxH = eH + (eM > 0 ? 1 : 0);
      }
    });
    if (minH >= maxH) { minH = 8; maxH = 18; }
    return { minH, maxH };
  };

  // Check if a day is "open" per provider schedule
  const isDayOpen = (date) => {
    const dayKeys = ['mon','tue','wed','thu','fri','sat','sun'];
    const jsDay = date.getDay();
    const dayKey = jsDay === 0 ? 'sun' : dayKeys[jsDay - 1];
    const booking = filteredBookings.find(b => b.profiles?.schedule);
    const schedule = booking?.profiles?.schedule;
    return schedule?.[dayKey]?.open !== false;
  };

  // Parse time_slot like "10:00 - 11:00" -> { startMin, endMin }
  const parseSlotRange = (slot) => {
    if (!slot || !slot.includes(' - ')) return null;
    const [s, e] = slot.split(' - ');
    const [sH, sM] = s.split(':').map(Number);
    const [eH, eM] = e.split(':').map(Number);
    return { startMin: sH * 60 + sM, endMin: eH * 60 + eM };
  };
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
          .select('id, name, email')
          .eq('email', user.email)
          .single();
        
        setUserProfile(data);
      }
    };
    checkProfile();
  }, [user]);

  const fetchBookings = useCallback(async () => {
    if (!user || !userProfile?.id) {
      // Still waiting for user/profile to load — keep loading state true
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, profiles(schedule, day_duration_hours)')
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
      const { data: booking } = await supabase
        .from('bookings')
        .select('*, profiles(name, email, schedule, day_duration_hours)')
        .eq('id', bookingId)
        .single();

      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;

      const { data: { session } } = await supabase.auth.getSession();

      try {
        await fetch('https://jyuatojpkluyidpefzub.supabase.co/functions/v1/send-booking-email', {
          method: 'POST',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({
            template: 'booking-accepted',
            to: booking.customer_email,
            variables: {
              customer_name: booking.customer_name,
              provider_name: userProfile.name,
              booking_date: booking.booking_date,
              end_date: booking.end_date,
              time_slot: booking.time_slot,

              start_time: (() => {

                if (!booking.end_date) return null;

                const date = new Date(booking.booking_date);

                const dayKey = ['sun','mon','tue','wed','thu','fri','sat'][date.getDay()];

                return booking.profiles?.schedule?.[dayKey]?.start || null;

              })(),
              service: booking.service_name,
              address: booking.service_address,
            },
          }),
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
      }

      alert('Booking confirmed!');
      await fetchBookings();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error confirming booking');
    }
  };

  const handleCancelConfirmed = async (bookingId) => {
    if (!window.confirm('Cancel this booking? The customer will be notified and their payment authorization released.')) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch('https://jyuatojpkluyidpefzub.supabase.co/functions/v1/cancel-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ bookingId, cancelledBy: 'provider' })
      });
      
      const result = await res.json();
      if (!res.ok || result.error) {
        throw new Error(result.error || 'Cancel failed');
      }
      
      alert('Booking cancelled. The customer has been notified.');
      fetchBookings();
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleDecline = async (bookingId) => {
    try {
      const { data: booking } = await supabase
        .from('bookings')
        .select('*, profiles(name, email, schedule, day_duration_hours)')
        .eq('id', bookingId)
        .single();

      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      const { data: { session } } = await supabase.auth.getSession();

      try {
        await fetch('https://jyuatojpkluyidpefzub.supabase.co/functions/v1/send-booking-email', {
          method: 'POST',
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({
            template: 'booking-declined',
            to: booking.customer_email,
            variables: {
              customer_name: booking.customer_name,
              provider_name: userProfile.name,
              booking_date: booking.booking_date,
              end_date: booking.end_date,
              time_slot: booking.time_slot,

              start_time: (() => {

                if (!booking.end_date) return null;

                const date = new Date(booking.booking_date);

                const dayKey = ['sun','mon','tue','wed','thu','fri','sat'][date.getDay()];

                return booking.profiles?.schedule?.[dayKey]?.start || null;

              })(),
              service: booking.service_name,
              address: booking.service_address,
            },
          }),
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
      }

      alert('Booking declined');
      fetchBookings();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error declining booking');
    }
  };



  const handleArchive = async (bookingId) => {
    if (!window.confirm("Archive this booking? It will be hidden from your list.")) return;
    
    try {
      const { error } = await supabase.from("bookings").update({ status: "archived" }).eq("id", bookingId);
      if (error) throw error;
      fetchBookings();
      
    } catch (error) {
      console.error("Error:", error);
      alert("Error archiving booking");
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

  const filteredBookings = bookings.filter(b => {
    if (statusFilter === "archived") return b.status === "archived";
    if (statusFilter === "all") return b.status !== "archived";
    return b.status === statusFilter;
  });

  // Helper: render a single booking card (used in list AND modal)
  const renderBookingCard = (booking, opts = {}) => {
    if (!booking) return null;
    const inModal = opts.inModal || false;
    return (
      <div key={booking.id} style={{...styles.card, position: "relative", ...(inModal ? { boxShadow: 'none', margin: 0 } : {})}}>
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
          {!inModal && booking.status !== 'archived' && <button onClick={() => handleArchive(booking.id)} style={styles.archiveBtn} title="Archive booking">✕</button>}
        </div>

        <div style={styles.cardBody}>
          {booking.end_date && booking.end_date !== booking.booking_date ? (
            <>
              <div style={styles.infoRow}><div><span style={styles.infoLabel}>From</span><span style={styles.infoValue}>{new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span></div></div>
              <div style={styles.infoRow}><div><span style={styles.infoLabel}>To</span><span style={styles.infoValue}>{new Date(booking.end_date).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span></div></div>
              <div style={styles.infoRow}><div><span style={styles.infoLabel}>Duration</span><span style={styles.infoValue}>{booking.time_slot}</span></div></div>
              {(() => {
                const date = new Date(booking.booking_date);
                const dayKey = ['sun','mon','tue','wed','thu','fri','sat'][date.getDay()];
                const startTime = booking.profiles?.schedule?.[dayKey]?.start;
                if (!startTime) return null;
                return (<div style={styles.infoRow}><div><span style={styles.infoLabel}>Service starts at</span><span style={styles.infoValue}>{startTime}</span></div></div>);
              })()}
            </>
          ) : (
            <>
              <div style={styles.infoRow}><div><span style={styles.infoLabel}>Date</span><span style={styles.infoValue}>{new Date(booking.booking_date).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span></div></div>
              <div style={styles.infoRow}><div><span style={styles.infoLabel}>Time</span><span style={styles.infoValue}>{booking.time_slot}</span></div></div>
            </>
          )}
          {booking.service_address && (
            <div style={styles.infoRow}>
              <div>
                <span style={styles.infoLabel}>Address</span>
                <span style={styles.infoValue}>
                  {booking.service_address?.startsWith("GPS Location:") ? (() => { const coords = booking.service_address.replace("GPS Location: ", "").split(", "); return <a href={`https://www.google.com/maps?q=${coords[0]},${coords[1]}`} target="_blank" rel="noopener noreferrer" style={{ color: "#14B8A6", textDecoration: "underline" }}>📍 {booking.service_address}</a>; })() : (booking.service_address || "No address provided")}
                  {booking.address_notes && <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Note: {booking.address_notes}</div>}
                </span>
              </div>
            </div>
          )}
          <div style={styles.infoRow}>
            <div>
              <span style={styles.infoLabel}>Contact</span>
              <button onClick={() => { localStorage.setItem('helperr_message_to', booking.customer_email); window.navigateTo('messages'); }} style={styles.contactBtn}>
                💬 Contact via Helperr Messages
              </button>
            </div>
          </div>
          <div style={styles.infoRow}><div><span style={styles.infoLabel}>Price</span><span style={styles.infoValue}>{booking.total_price}</span></div></div>
          {booking.message && (<div style={styles.messageBox}><span style={styles.infoLabel}>Message:</span><p style={styles.messageText}>{booking.message}</p></div>)}
        </div>

        <div style={styles.cardActions}>
          {booking.status === 'pending' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleAccept(booking.id)} style={styles.btnAccept}>Accept</button>
              <button onClick={() => handleDecline(booking.id)} style={styles.btnDecline}>Decline</button>
            </div>
          )}
          {booking.status === 'confirmed' && booking.payment_status !== 'captured' && (
            <button onClick={() => handleCancelConfirmed(booking.id)} style={styles.btnDecline}>Cancel Booking</button>
          )}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div style={styles.app}>
        <Header transparent={true} isScrolled={isScrolled} />
        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <h1 style={styles.heroTitle}>Expert Bookings</h1>
            <p style={styles.heroSub}>Manage your customer bookings</p>
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
          <h1 style={styles.heroTitle}>Expert Bookings</h1>
          <p style={styles.heroSub}>Manage your customer bookings</p>
        </div>
      </div>

      <div style={styles.container}>
        {/* Pyramide-Style Filter + Toggle - Profi Design */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          {/* Status-Filter Card - Card mit Gradient + Pills */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
            padding: '14px 20px',
            borderRadius: 16,
            boxShadow: '0 8px 24px rgba(6, 95, 70, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
            border: '1px solid rgba(20, 184, 166, 0.15)',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'cancelled', label: 'Cancelled' },
              { key: 'archived', label: 'Archived' }
            ].map(({ key, label }) => {
              const isActive = statusFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: 999,
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive ? 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)' : 'transparent',
                    color: isActive ? '#fff' : '#6b7280',
                    fontWeight: 600,
                    fontSize: 13,
                    fontFamily: '"Outfit", sans-serif',
                    boxShadow: isActive ? '0 4px 12px rgba(20, 184, 166, 0.35)' : 'none',
                    transform: isActive ? 'translateY(-1px)' : 'translateY(0)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(20, 184, 166, 0.08)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* View-Toggle drunter - schmaler */}
          <div style={{
            background: '#ffffff',
            padding: '8px 12px',
            borderRadius: 14,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
            border: '1px solid #f3f4f6',
            display: 'flex',
            gap: 6
          }}>
            {[
              { key: 'list', label: 'List' },
              { key: 'calendar', label: 'Month' },
              { key: 'week', label: 'Week' }
            ].map(({ key, label }) => {
              const isActive = viewMode === key;
              return (
                <button
                  key={key}
                  onClick={() => setViewMode(key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive ? 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)' : 'transparent',
                    color: isActive ? '#fff' : '#6b7280',
                    fontWeight: 600,
                    fontSize: 13,
                    fontFamily: '"Outfit", sans-serif',
                    boxShadow: isActive ? '0 4px 12px rgba(20, 184, 166, 0.35)' : 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(20, 184, 166, 0.08)'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {viewMode === 'week' && isMobile ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button onClick={() => changeWeek(-1)} style={{ background: '#f3f4f6', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 18, cursor: 'pointer', fontWeight: 700, color: '#065f46' }}>←</button>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#065f46', margin: 0, fontFamily: '"Outfit", sans-serif', textAlign: 'center' }}>
                {currentWeekStart.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} - {(() => { const e = new Date(currentWeekStart); e.setDate(e.getDate() + 6); return e.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }); })()}
              </h3>
              <button onClick={() => changeWeek(1)} style={{ background: '#f3f4f6', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 18, cursor: 'pointer', fontWeight: 700, color: '#065f46' }}>→</button>
            </div>
            {/* Multi-Day Banner */}
            {(() => {
              const weekStart = formatDateISOLocal(currentWeekStart);
              const weekEndDate = new Date(currentWeekStart); weekEndDate.setDate(weekEndDate.getDate() + 6);
              const weekEnd = formatDateISOLocal(weekEndDate);
              const multiDay = filteredBookings.filter(b => b.end_date && b.end_date !== b.booking_date && b.booking_date <= weekEnd && b.end_date >= weekStart);
              if (multiDay.length === 0) return null;
              return (
                <div style={{ marginBottom: 12, padding: 10, background: '#ecfdf5', borderRadius: 10, border: '1px solid #14b8a6' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#065f46', textTransform: 'uppercase', marginBottom: 6 }}>Multi-Day This Week</div>
                  {multiDay.map(b => (
                    <div key={b.id} style={{ fontSize: 13, color: '#065f46', padding: '4px 0' }}>
                      ● {b.customer_name} • {b.time_slot} ({b.booking_date} → {b.end_date})
                    </div>
                  ))}
                </div>
              );
            })()}
            {/* Tag-Karten */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {getWeekDates().map(date => {
                const iso = formatDateISOLocal(date);
                const today = formatDateISOLocal(new Date());
                const isToday = iso === today;
                const dayOpen = isDayOpen(date);
                const dayBookings = getBookingsForDate(iso)
                  .filter(b => !b.end_date || b.end_date === b.booking_date) // exclude multi-day (shown in banner)
                  .sort((a, b) => parseSlotStartMin(a.time_slot) - parseSlotStartMin(b.time_slot));
                return (
                  <div key={iso} style={{ background: isToday ? '#ecfdf5' : '#fff', border: isToday ? '2px solid #14b8a6' : '1px solid #f3f4f6', borderRadius: 12, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: dayOpen ? '#065f46' : '#9ca3af' }}>{date.getDate()}</div>
                      </div>
                      {!dayOpen && <div style={{ fontSize: 10, color: '#dc2626', fontWeight: 700, padding: '2px 6px', background: '#fef2f2', borderRadius: 4 }}>CLOSED</div>}
                    </div>
                    {dayBookings.length === 0 ? (
                      <div style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>No bookings</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {dayBookings.map(b => {
                          const bgColor = b.status === 'confirmed' ? '#14b8a6' : b.status === 'pending' ? '#fbbf24' : '#9ca3af';
                          return (
                            <div key={b.id} onClick={() => setSelectedBookingForModal(b)} style={{ background: bgColor, color: '#fff', borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}>
                              <div style={{ fontSize: 13, fontWeight: 700 }}>{b.time_slot}</div>
                              <div style={{ fontSize: 11, opacity: 0.95 }}>{b.customer_name} • {b.service_name}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : viewMode === 'week' ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', marginBottom: 24, overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <button onClick={() => changeWeek(-1)} style={{ background: '#f3f4f6', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 18, cursor: 'pointer', fontWeight: 700, color: '#065f46' }}>←</button>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#065f46', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                Week of {currentWeekStart.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })} - {(() => { const e = new Date(currentWeekStart); e.setDate(e.getDate() + 6); return e.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }); })()}
              </h3>
              <button onClick={() => changeWeek(1)} style={{ background: '#f3f4f6', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 18, cursor: 'pointer', fontWeight: 700, color: '#065f46' }}>→</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {getWeekDates().map(date => {
                const iso = formatDateISOLocal(date);
                const today = formatDateISOLocal(new Date());
                const isToday = iso === today;
                const dayOpen = isDayOpen(date);
                const visibleStatuses = ['pending', 'confirmed', 'completed'];
                const dayBookings = getBookingsForDate(iso)
                  .filter(b => visibleStatuses.includes(b.status))
                  .filter(b => !b.end_date || b.end_date === b.booking_date)
                  .sort((a, b) => parseSlotStartMin(a.time_slot) - parseSlotStartMin(b.time_slot));
                return (
                  <div key={iso} style={{ minHeight: 220, background: isToday ? '#ecfdf5' : '#fff', border: isToday ? '2px solid #14b8a6' : '1px solid #f3f4f6', borderRadius: 10, padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ textAlign: 'center', paddingBottom: 6, borderBottom: '1px solid #f3f4f6', marginBottom: 4 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: dayOpen ? '#065f46' : '#9ca3af' }}>{date.getDate()}</div>
                      {!dayOpen && <div style={{ fontSize: 9, color: '#dc2626', fontWeight: 600 }}>CLOSED</div>}
                    </div>
                    {dayBookings.length === 0 ? (
                      <div style={{ fontSize: 11, color: '#9ca3af', fontStyle: 'italic', textAlign: 'center', padding: 10 }}>No bookings</div>
                    ) : (
                      dayBookings.map(b => {
                        const bgColor = b.status === 'confirmed' ? '#14b8a6' : b.status === 'pending' ? '#fbbf24' : '#9ca3af';
                        const isMulti = b.end_date && b.end_date !== b.booking_date;
                        const shortTime = isMulti ? b.time_slot : (b.time_slot?.split(' - ')[0] || '');
                        return (
                          <div key={b.id} onClick={() => setSelectedBookingForModal(b)} style={{ background: bgColor, color: '#fff', borderRadius: 6, padding: '5px 7px', fontSize: 11, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} title={`${b.time_slot} - ${b.customer_name}`}>
                            <div style={{ fontWeight: 700 }}>{shortTime}</div>
                            <div style={{ fontSize: 10, opacity: 0.95, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.customer_name}</div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
            {expandedDate && (
              <div style={{ marginTop: 20, padding: 16, background: '#f9fafb', borderRadius: 12 }}>
                <h4 style={{ margin: '0 0 12px', color: '#065f46', fontSize: 16, fontFamily: '"Outfit", sans-serif' }}>
                  {new Date(expandedDate).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                </h4>
                {(() => {
                  const visibleStatuses = ['pending', 'confirmed', 'completed'];
                  const dayBookings = getBookingsForDate(expandedDate)
                    .filter(b => visibleStatuses.includes(b.status))
                    .sort((a, b) => parseSlotStartMin(a.time_slot) - parseSlotStartMin(b.time_slot));
                  if (dayBookings.length === 0) return <div style={{ color: '#9ca3af', fontSize: 14 }}>No bookings</div>;
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {dayBookings.map(b => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBookingForModal(b)}
                          style={{
                            padding: '10px 14px',
                            background: '#fff',
                            border: '2px solid #ecfdf5',
                            borderRadius: 10,
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: '"Outfit", sans-serif'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#065f46' }}>{b.time_slot}</div>
                              <div style={{ fontSize: 13, color: '#6b7280' }}>{b.customer_name} • {b.service_name}</div>
                            </div>
                            <div style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: b.status === 'confirmed' ? '#d1fae5' : b.status === 'pending' ? '#fef3c7' : '#f3f4f6', color: b.status === 'confirmed' ? '#065f46' : b.status === 'pending' ? '#92400e' : '#6b7280', fontWeight: 600 }}>
                              {b.status}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : viewMode === 'calendar' ? (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button onClick={() => changeCalendarMonth(-1)} style={{ background: '#f3f4f6', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 18, cursor: 'pointer', fontWeight: 700, color: '#065f46' }}>←</button>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#065f46', margin: 0, fontFamily: '"Outfit", sans-serif' }}>
                {currentCalendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button onClick={() => changeCalendarMonth(1)} style={{ background: '#f3f4f6', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 18, cursor: 'pointer', fontWeight: 700, color: '#065f46' }}>→</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textAlign: 'center', padding: 6 }}>{day}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, alignItems: 'stretch' }}>
              {getCalendarMonthDates().map((date, idx) => {
                if (!date) return <div key={'empty-' + idx} style={{ minHeight: isMobile ? 44 : 100 }} />;
                const iso = formatDateISOLocal(date);
                // Filter: only pending, confirmed, completed (not cancelled/archived)
                const visibleStatuses = ['pending', 'confirmed', 'completed'];
                const dayBookings = getBookingsForDate(iso)
                  .filter(b => visibleStatuses.includes(b.status))
                  .sort((a, b) => parseSlotStartMin(a.time_slot) - parseSlotStartMin(b.time_slot));
                const hasBookings = dayBookings.length > 0;
                const isExpanded = expandedDate === iso;
                const today = formatDateISOLocal(new Date());
                const isToday = iso === today;

                if (isMobile) {
                  // Mobile: colored box (B) + badge with count (C)
                  // Box wird teal-farbig wenn Bookings da, mit Anzahl als Badge oben rechts
                  const bookingCount = dayBookings.length;
                  return (
                    <button
                      key={iso}
                      onClick={() => setExpandedDate(isExpanded ? null : iso)}
                      style={{
                        minHeight: 44,
                        background: isExpanded
                          ? 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)'
                          : (hasBookings ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' : '#fff'),
                        color: (isExpanded || hasBookings) ? '#fff' : '#374151',
                        border: isToday ? '2px solid #065f46' : '1px solid #f3f4f6',
                        borderRadius: 10,
                        cursor: 'pointer',
                        fontWeight: hasBookings ? 700 : 500,
                        fontSize: 13,
                        fontFamily: '"Outfit", sans-serif',
                        position: 'relative',
                        transition: 'all 0.15s',
                        boxShadow: hasBookings ? '0 2px 8px rgba(20, 184, 166, 0.25)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {date.getDate()}
                    </button>
                  );
                }

                // Desktop: Google Calendar style with booking entries inside
                return (
                  <div
                    key={iso}
                    onClick={() => setExpandedDate(isExpanded ? null : iso)}
                    style={{
                      minHeight: 100,
                      background: isExpanded ? '#ecfdf5' : '#fff',
                      border: isToday ? '2px solid #14b8a6' : '1px solid #f3f4f6',
                      borderRadius: 8,
                      cursor: 'pointer',
                      padding: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: isToday ? '#14b8a6' : '#065f46', marginBottom: 2 }}>
                      {date.getDate()}
                    </div>
                    {dayBookings.map(b => {
                      const bgColor = b.status === 'confirmed' ? '#14b8a6' : b.status === 'pending' ? '#fbbf24' : '#9ca3af';
                      // Extract short label: "10:00" for hour, "1d/3d" for multi-day
                      const isMulti = b.end_date && b.end_date !== b.booking_date;
                      const shortTime = isMulti ? b.time_slot : (b.time_slot?.split(' - ')[0] || '');
                      return (
                        <div
                          key={b.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedBookingForModal(b); }}
                          style={{
                            background: bgColor,
                            color: '#fff',
                            borderRadius: 4,
                            padding: '2px 5px',
                            fontSize: 11,
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                          }}
                          title={`${b.time_slot} - ${b.customer_name}`}
                        >
                          {shortTime} {b.customer_name}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {expandedDate && (
              <div style={{ marginTop: 20, padding: 16, background: '#f9fafb', borderRadius: 12 }}>
                <h4 style={{ margin: '0 0 12px', color: '#065f46', fontSize: 16, fontFamily: '"Outfit", sans-serif' }}>
                  {new Date(expandedDate).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                </h4>
                {getBookingsForDate(expandedDate).length === 0 ? (
                  <div style={{ color: '#9ca3af', fontSize: 14 }}>No bookings</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {getBookingsForDate(expandedDate)
                      .sort((a, b) => parseSlotStartMin(a.time_slot) - parseSlotStartMin(b.time_slot))
                      .map(b => (
                        <button
                          key={b.id}
                          onClick={() => setSelectedBookingForModal(b)}
                          style={{
                            padding: '10px 14px',
                            background: '#fff',
                            border: '2px solid #ecfdf5',
                            borderRadius: 10,
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontFamily: '"Outfit", sans-serif'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#065f46' }}>{b.time_slot}</div>
                              <div style={{ fontSize: 13, color: '#6b7280' }}>{b.customer_name} • {b.service_name}</div>
                            </div>
                            <div style={{ fontSize: 11, padding: '4px 8px', borderRadius: 6, background: b.status === 'confirmed' ? '#d1fae5' : b.status === 'pending' ? '#fef3c7' : '#f3f4f6', color: b.status === 'confirmed' ? '#065f46' : b.status === 'pending' ? '#92400e' : '#6b7280', fontWeight: 600 }}>
                              {b.status}
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={styles.empty}>
            <h3>No bookings found</h3>
            <p>You don't have any {statusFilter !== 'all' ? statusFilter : ''} bookings yet</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredBookings.map(booking => renderBookingCard(booking))}
          </div>
        )}
      </div>

      {/* Modal: Booking Details */}
      {selectedBookingForModal && (
        <div
          onClick={() => setSelectedBookingForModal(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 16, maxWidth: 600, width: '100%',
              maxHeight: '90vh', overflow: 'auto', position: 'relative',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            <button
              onClick={() => setSelectedBookingForModal(null)}
              style={{
                position: 'absolute', top: 12, right: 12, zIndex: 10,
                background: '#f3f4f6', border: 'none', width: 36, height: 36,
                borderRadius: '50%', cursor: 'pointer', fontSize: 18,
                color: '#374151', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              title="Close"
            >
              ✕
            </button>
            {renderBookingCard(selectedBookingForModal, { inModal: true })}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', paddingTop: 0 },
  hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 70%, #14b8a6 100%)', padding: Capacitor.isNativePlatform() ? 'calc(env(safe-area-inset-top) + 20px) 20px 40px' : '120px 20px 64px', marginBottom: 40, position: 'relative', overflow: 'hidden', clipPath: 'ellipse(120% 100% at 50% 0%)' },
  heroInner: { maxWidth: 1100, margin: '0 auto', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' },
  heroSub: { color: '#d1fae5', fontSize: 16, margin: 0 },
  container: { maxWidth: 1100, margin: '0 auto', padding: Capacitor.isNativePlatform() ? '0 20px calc(120px + env(safe-area-inset-bottom)) 20px' : '0 20px 60px' },
  filters: { display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', background: '#fff', padding: 20, borderRadius: 16, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)' },
  filterBtn: { padding: '10px 20px', background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#6b7280', cursor: 'pointer', fontFamily: '"Outfit", sans-serif', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' },
  filterBtnActive: { background: '#065f46', borderColor: '#065f46', color: 'white', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)', transform: 'translateY(-1px)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 },
  card: { background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', transition: 'all 0.2s' },
  cardHeader: { padding: 20, borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  customerPlaceholder: { width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 700 },
  cardTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' },
  cardSub: { margin: '4px 0 0', fontSize: 13, color: '#6b7280' },
  statusBadge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, color: 'white', marginRight: 32 },
  archiveBtn: { position: "absolute", top: 20, right: 12, background: "rgba(107, 114, 128, 0.1)", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: "#6b7280", transition: "all 0.2s", zIndex: 10 },
  cardBody: { padding: 20 },
  infoRow: { display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  infoLabel: { display: 'block', fontSize: 12, color: '#6b7280', fontWeight: 600 },
  infoValue: { display: 'block', fontSize: 14, color: '#111827', fontWeight: 500, marginTop: 2 },
  messageBox: { marginTop: 16, padding: 12, background: '#f9fafb', borderRadius: 10 },
  messageText: { margin: '4px 0 0', fontSize: 13, color: '#374151', lineHeight: 1.6 },
  cardActions: { padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 },
  btnAccept: { flex: 1, padding: '12px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)' },
  contactBtn: { background: 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 3px 10px rgba(20, 184, 166, 0.25)', marginTop: 4, transition: 'all 0.2s' },
  btnDecline: { flex: 1, padding: '12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  empty: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)' },
  btnPrimary: { padding: '12px 24px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', marginTop: 16 },
  loading: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#6b7280' },
  loginRequired: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 }
};

export default ProviderBookingsPage;
