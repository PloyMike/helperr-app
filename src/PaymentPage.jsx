import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import PaymentSelection from './PaymentSelection';

function PaymentPage() {
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get booking ID from URL (we'll pass it via navigation)
  const bookingId = window.currentBookingId;

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided');
      setLoading(false);
      return;
    }

    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, profiles(name, email)')
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      
      if (!data) {
        setError('Booking not found');
      } else if (data.customer_email !== user?.email) {
        setError('You do not have permission to pay for this booking');
      } else {
        setBooking(data);
      }
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError('Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    // Update booking payment status
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'authorized' })
        .eq('id', bookingId);

      if (error) throw error;

      // Get session for authenticated email sending
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token && booking) {
        // Send booking confirmation email to customer
        try {
          await fetch("https://jyuatojpkluyidpefzub.supabase.co/functions/v1/send-booking-email", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
              template: "booking-confirmation",
              to: booking.customer_email,
              variables: {
                customer_name: booking.customer_name,
                provider_name: booking.profile?.name || "Provider",
                service: booking.service_name,
                booking_date: booking.booking_date,
                time_slot: booking.time_slot,
                address: booking.service_address,
              },
            }),
          });
        } catch (emailError) {
          console.error("Customer email error:", emailError);
        }

        // Send booking request email to provider
        try {
          await fetch("https://jyuatojpkluyidpefzub.supabase.co/functions/v1/send-booking-email", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
              template: "booking-request",
              to: booking.profile?.email || "",
              variables: {
                provider_name: booking.profile?.name || "Provider",
                customer_name: booking.customer_name,
                service: booking.service_name,
                booking_date: booking.booking_date,
                time_slot: booking.time_slot,
                address: booking.service_address,
              },
            }),
          });
        } catch (emailError) {
          console.error("Provider email error:", emailError);
        }
      }

      alert('✅ Payment authorized! Your booking is confirmed.');
      window.navigateTo('bookings');
    } catch (err) {
      console.error('Error updating booking:', err);
      alert('Payment successful but failed to update booking. Please contact support.');
    }
  };

  const handleCancel = () => {
    window.navigateTo('bookings');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading payment details...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>❌ {error || 'Booking not found'}</h2>
          <button onClick={() => window.navigateTo('bookings')} style={styles.btnPrimary}>
            Go to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <PaymentSelection 
        booking={booking}
        onSuccess={handlePaymentSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f9fafb',
    fontFamily: '"Outfit", sans-serif',
    padding: 20
  },
  loading: {
    fontSize: 18,
    color: '#6b7280'
  },
  error: {
    background: 'white',
    padding: 40,
    borderRadius: 16,
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: 500
  },
  btnPrimary: {
    marginTop: 20,
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif'
  }
};

export default PaymentPage;
