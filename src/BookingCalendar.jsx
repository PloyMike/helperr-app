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

  const formatDateISO = (date) => {
    return date.toISOString().split('T')[0];
  };

  const timeSlots = [
    { value: 'morning', label: 'Vormittag', time: '09:00 - 12:00', icon: '🌅' },
    { value: 'afternoon', label: 'Nachmittag', time: '13:00 - 17:00', icon: '☀️' },
    { value: 'fullday', label: 'Ganztag', time: '09:00 - 17:00', icon: '📅' }
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

  return (
    <div>
      {step === 4 && bookingData && (
        <PaymentSelection 
          booking={bookingData}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
      {step !== 4 && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
          <div style={{backgroundColor:'white',borderRadius:16,maxWidth:600,width:'100%',maxHeight:'90vh',overflow:'auto'}}>
            <div style={{padding:24}}>
              <button onClick={onClose} style={{float:'right',background:'none',border:'none',fontSize:24,cursor:'pointer'}}>×</button>
              <h2>Buchung - {profile.name}</h2>
              {step === 1 && <div><h3>Datum wählen</h3><div>{getAvailableDates().slice(0,10).map(date => <button key={formatDateISO(date)} onClick={() => {setSelectedDate(formatDateISO(date));setStep(2);}} style={{display:'block',margin:5,padding:10}}>{formatDate(date)}</button>)}</div></div>}
              {step === 2 && <div><button onClick={() => setStep(1)}>Zurück</button><h3>Uhrzeit</h3>{timeSlots.map(slot => <button key={slot.value} onClick={() => {setSelectedTimeSlot(slot.value);setStep(3);}} style={{display:'block',margin:5,padding:10}}>{slot.icon} {slot.label}</button>)}</div>}
              {step === 3 && <div><button onClick={() => setStep(2)}>Zurück</button><h3>Kontakt</h3><input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData,name:e.target.value})} style={{display:'block',width:'100%',marginBottom:10,padding:10}}/><input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData,email:e.target.value})} style={{display:'block',width:'100%',marginBottom:10,padding:10}}/><input placeholder="Telefon" value={formData.phone} onChange={e => setFormData({...formData,phone:e.target.value})} style={{display:'block',width:'100%',marginBottom:10,padding:10}}/><button onClick={handleContinueToPayment} style={{padding:15,background:'#667eea',color:'white',border:'none',borderRadius:8,width:'100%',cursor:'pointer'}}>Weiter zur Zahlung</button></div>}
              {step === 5 && <div><h2>✅ Bestätigt!</h2><p>Buchungs-ID: {bookingId?.substring(0,8)}</p><button onClick={onClose} style={{padding:15,background:'#667eea',color:'white',border:'none',borderRadius:8,cursor:'pointer'}}>Schließen</button></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingCalendar;