import React, { useState } from 'react';
import { supabase } from './supabase';
import PaymentSelection from './PaymentSelection';

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
  const [bookingData, setBookingData] = useState(null);
  const [bookingId, setBookingId] = useState(null);

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
    return date.toLocaleDateString('de-DE', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    });
  };

  const formatDateFull = (date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateISO = (date) => {
    return date.toISOString().split('T')[0];
  };

  // VOLLER 24-STUNDEN-TAG MIT ZEITBEREICHEN
  const timeSlots = [
    { value: '00:00', label: '00:00 - 01:00' },
    { value: '01:00', label: '01:00 - 02:00' },
    { value: '02:00', label: '02:00 - 03:00' },
    { value: '03:00', label: '03:00 - 04:00' },
    { value: '04:00', label: '04:00 - 05:00' },
    { value: '05:00', label: '05:00 - 06:00' },
    { value: '06:00', label: '06:00 - 07:00' },
    { value: '07:00', label: '07:00 - 08:00' },
    { value: '08:00', label: '08:00 - 09:00' },
    { value: '09:00', label: '09:00 - 10:00' },
    { value: '10:00', label: '10:00 - 11:00' },
    { value: '11:00', label: '11:00 - 12:00' },
    { value: '12:00', label: '12:00 - 13:00' },
    { value: '13:00', label: '13:00 - 14:00' },
    { value: '14:00', label: '14:00 - 15:00' },
    { value: '15:00', label: '15:00 - 16:00' },
    { value: '16:00', label: '16:00 - 17:00' },
    { value: '17:00', label: '17:00 - 18:00' },
    { value: '18:00', label: '18:00 - 19:00' },
    { value: '19:00', label: '19:00 - 20:00' },
    { value: '20:00', label: '20:00 - 21:00' },
    { value: '21:00', label: '21:00 - 22:00' },
    { value: '22:00', label: '22:00 - 23:00' },
    { value: '23:00', label: '23:00 - 00:00' }
  ];

  const handleContinueToPayment = () => {
    if (!formData.name || !formData.email) {
      alert('Bitte Name und E-Mail ausfüllen!');
      return;
    }
    setBookingData({
      profile_id: profile.id,
      profile_name: profile.name,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      booking_date: selectedDate,
      time_slot: selectedTimeSlot,
      message: formData.message,
      total_price: profile.price,
      status: 'pending'
    });
    setStep(4);
  };

  const handlePaymentSuccess = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          profile_id: bookingData.profile_id,
          customer_name: bookingData.customer_name,
          customer_email: bookingData.customer_email,
          customer_phone: bookingData.customer_phone,
          booking_date: bookingData.booking_date,
          time_slot: bookingData.time_slot,
          message: bookingData.message,
          total_price: bookingData.total_price,
          status: 'pending'
        }])
        .select();
      if (error) throw error;
      setBookingId(data[0].id);
      setStep(5);
    } catch (error) {
      alert('Fehler: ' + error.message);
    }
  };

  const handlePaymentCancel = () => {
    setStep(3);
  };

  const getSelectedDateObj = () => {
    return selectedDate ? new Date(selectedDate + 'T00:00:00') : null;
  };

  const getSelectedTimeSlot = () => {
    return timeSlots.find(slot => slot.value === selectedTimeSlot);
  };

  return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      {step === 4 && bookingData && (
        <PaymentSelection 
          booking={bookingData}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
      
      {step !== 4 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20,
          fontFamily: '"Outfit", sans-serif'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 24,
            maxWidth: 700,
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            
            {/* HEADER */}
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid #F3F4F6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)'
            }}>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#1F2937'
                }}>
                  {step === 1 ? '📅 Datum wählen' : 
                   step === 2 ? '⏰ Uhrzeit wählen' : 
                   step === 3 ? '📋 Deine Daten' : 
                   '✅ Bestätigung'}
                </h2>
                <p style={{
                  margin: '4px 0 0 0',
                  fontSize: 14,
                  color: '#6B7280'
                }}>
                  Buchung für {profile.name}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: '#F3F4F6',
                  border: 'none',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  fontSize: 20,
                  cursor: 'pointer',
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#E5E7EB';
                  e.target.style.color = '#1F2937';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#F3F4F6';
                  e.target.style.color = '#6B7280';
                }}
              >
                ✕
              </button>
            </div>

            {/* PROGRESS INDICATOR */}
            <div style={{
              display: 'flex',
              padding: '16px 32px',
              gap: 8,
              background: '#F9FAFB'
            }}>
              {[1, 2, 3].map(num => (
                <div
                  key={num}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 4,
                    background: step >= num ? '#14B8A6' : '#E5E7EB',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </div>

            <div style={{ padding: 32 }}>
              
              {/* STEP 1: DATE SELECTION */}
              {step === 1 && (
                <div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: 12
                  }}>
                    {getAvailableDates().slice(0, 15).map(date => {
                      const dateISO = formatDateISO(date);
                      const isSelected = selectedDate === dateISO;
                      
                      return (
                        <button
                          key={dateISO}
                          onClick={() => {
                            setSelectedDate(dateISO);
                            setStep(2);
                          }}
                          style={{
                            padding: '16px 12px',
                            background: isSelected ? 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' : 'white',
                            border: isSelected ? 'none' : '2px solid #E5E7EB',
                            borderRadius: 16,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            color: isSelected ? 'white' : '#374151',
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 600,
                            fontSize: 13,
                            textAlign: 'center'
                          }}
                          onMouseOver={(e) => {
                            if (!isSelected) {
                              e.target.style.borderColor = '#14B8A6';
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.2)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!isSelected) {
                              e.target.style.borderColor = '#E5E7EB';
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }
                          }}
                        >
                          {formatDate(date)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: TIME SLOT SELECTION - KOMPAKT WIE DATUM */}
              {step === 2 && (
                <div>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      background: '#F3F4F6',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      marginBottom: 24,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#374151',
                      fontFamily: '"Outfit", sans-serif'
                    }}
                  >
                    ← Zurück
                  </button>

                  <div style={{
                    background: '#F9FAFB',
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 24
                  }}>
                    <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
                      Ausgewähltes Datum:
                    </p>
                    <p style={{
                      margin: '4px 0 0 0',
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#1F2937'
                    }}>
                      {getSelectedDateObj() && formatDateFull(getSelectedDateObj())}
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: 12
                  }}>
                    {timeSlots.map(slot => {
                      const isSelected = selectedTimeSlot === slot.value;
                      
                      return (
                        <button
                          key={slot.value}
                          onClick={() => {
                            setSelectedTimeSlot(slot.value);
                            setStep(3);
                          }}
                          style={{
                            padding: '16px 12px',
                            background: isSelected ? 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' : 'white',
                            border: isSelected ? 'none' : '2px solid #E5E7EB',
                            borderRadius: 16,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            color: isSelected ? 'white' : '#374151',
                            fontFamily: '"Outfit", sans-serif',
                            fontWeight: 600,
                            fontSize: 13,
                            textAlign: 'center'
                          }}
                          onMouseOver={(e) => {
                            if (!isSelected) {
                              e.target.style.borderColor = '#14B8A6';
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.2)';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!isSelected) {
                              e.target.style.borderColor = '#E5E7EB';
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = 'none';
                            }
                          }}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: CONTACT FORM */}
              {step === 3 && (
                <div>
                  <button
                    onClick={() => setStep(2)}
                    style={{
                      background: '#F3F4F6',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      marginBottom: 24,
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#374151',
                      fontFamily: '"Outfit", sans-serif'
                    }}
                  >
                    ← Zurück
                  </button>

                  <div style={{
                    background: '#F9FAFB',
                    padding: 20,
                    borderRadius: 12,
                    marginBottom: 24
                  }}>
                    <h3 style={{
                      margin: '0 0 12px 0',
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#1F2937'
                    }}>
                      Deine Buchung
                    </h3>
                    <div style={{ display: 'grid', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6B7280', fontSize: 14 }}>Datum:</span>
                        <span style={{ fontWeight: 600, color: '#374151', fontSize: 14 }}>
                          {getSelectedDateObj() && formatDate(getSelectedDateObj())}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6B7280', fontSize: 14 }}>Zeit:</span>
                        <span style={{ fontWeight: 600, color: '#374151', fontSize: 14 }}>
                          {getSelectedTimeSlot()?.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6B7280', fontSize: 14 }}>Preis:</span>
                        <span style={{ fontWeight: 700, color: '#14B8A6', fontSize: 16 }}>
                          {profile.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: 16 }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#374151'
                      }}>
                        Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Dein vollständiger Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: '2px solid #E5E7EB',
                          borderRadius: 12,
                          fontSize: 15,
                          outline: 'none',
                          fontFamily: '"Outfit", sans-serif',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#374151'
                      }}>
                        E-Mail *
                      </label>
                      <input
                        type="email"
                        placeholder="deine@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: '2px solid #E5E7EB',
                          borderRadius: 12,
                          fontSize: 15,
                          outline: 'none',
                          fontFamily: '"Outfit", sans-serif',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#374151'
                      }}>
                        Telefon (optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+49 123 456789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: '2px solid #E5E7EB',
                          borderRadius: 12,
                          fontSize: 15,
                          outline: 'none',
                          fontFamily: '"Outfit", sans-serif',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#374151'
                      }}>
                        Nachricht (optional)
                      </label>
                      <textarea
                        placeholder="Besondere Wünsche oder Anfragen..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: '2px solid #E5E7EB',
                          borderRadius: 12,
                          fontSize: 15,
                          outline: 'none',
                          fontFamily: '"Outfit", sans-serif',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#14B8A6'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                      />
                    </div>

                    <button
                      onClick={handleContinueToPayment}
                      style={{
                        padding: '16px 24px',
                        background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 12,
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: 'pointer',
                        marginTop: 8,
                        fontFamily: '"Outfit", sans-serif',
                        boxShadow: '0 4px 12px rgba(20,184,166,0.3)',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(20,184,166,0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.3)';
                      }}
                    >
                      Weiter zur Zahlung →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: SUCCESS */}
              {step === 5 && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{
                    fontSize: 80,
                    marginBottom: 24
                  }}>
                    ✅
                  </div>
                  <h2 style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: '#1F2937',
                    margin: '0 0 12px 0'
                  }}>
                    Buchung bestätigt!
                  </h2>
                  <p style={{
                    fontSize: 16,
                    color: '#6B7280',
                    marginBottom: 24
                  }}>
                    Deine Buchungs-ID: <strong>{bookingId?.substring(0, 8)}</strong>
                  </p>
                  <button
                    onClick={onClose}
                    style={{
                      padding: '16px 32px',
                      background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: '"Outfit", sans-serif',
                      boxShadow: '0 4px 12px rgba(20,184,166,0.3)'
                    }}
                  >
                    Schließen
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingCalendar;
