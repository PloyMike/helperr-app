import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Header from './Header';
import PaymentSelection from './PaymentSelection';

function RepayPage() {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [success, setSuccess] = useState(false);

  const bookingId = window.currentBookingId;

  useEffect(() => {
    if (!bookingId) {
      setError('No booking ID provided. Please use the link from your email.');
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
        setError('Booking not found.');
      } else if (data.payment_status === 'captured' || data.status === 'completed') {
        setError('This booking has already been paid. No further action needed.');
      } else if (data.status === 'cancelled') {
        setError('This booking has been cancelled and cannot be repaid.');
      } else if (data.payment_status !== 'capture_failed' && data.payment_status !== 'failed_permanent') {
        setError('This booking does not require repayment at this time.');
      } else {
        setBooking(data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load booking. Please try again or contact support@helperr.co');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    setVerifying(true);
    setTimeout(() => {
      if (emailInput.trim().toLowerCase() === booking.customer_email.toLowerCase()) {
        setVerified(true);
      } else {
        alert('Email does not match the booking. Please check and try again.');
      }
      setVerifying(false);
    }, 500);
  };

  const handlePaymentSuccess = async () => {
    try {
      // Reset capture counters so auto-capture starts fresh
      await supabase
        .from('bookings')
        .update({
          capture_attempts: 0,
          capture_error: null,
          capture_attempted_at: null
        })
        .eq('id', bookingId);
      setSuccess(true);
      setShowPaymentSelection(false);
    } catch (err) {
      console.error('Reset error:', err);
      setSuccess(true);
      setShowPaymentSelection(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.center}>
          <h2>Loading booking...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <div style={styles.errorBox}>
            <h2 style={styles.errorTitle}>⚠ Unable to Repay</h2>
            <p style={styles.errorText}>{error}</p>
            <p style={styles.errorText}>If you need help, contact us at <a href="mailto:support@helperr.co" style={styles.link}>support@helperr.co</a></p>
            <button onClick={() => { window.location.href = '/'; }} style={styles.primaryBtn}>Back to Homepage</button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <div style={styles.successBox}>
            <h2 style={styles.successTitle}>✓ Payment Successful</h2>
            <p style={styles.successText}>Your payment has been authorized. Your booking is now active again.</p>
            <p style={styles.successText}>The provider will be notified and the service will proceed as scheduled.</p>
            <button onClick={() => { window.location.href = '/'; }} style={styles.primaryBtn}>Back to Homepage</button>
          </div>
        </div>
      </div>
    );
  }

  if (showPaymentSelection && verified && booking) {
    return (
      <PaymentSelection
        booking={booking}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setShowPaymentSelection(false)}
      />
    );
  }

  if (!verified) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.container}>
          <div style={styles.card}>
            <h2 style={styles.title}>Complete Your Payment</h2>
            <p style={styles.subtitle}>Enter your email to verify your booking</p>
            <form onSubmit={handleVerifyEmail}>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="your.email@example.com"
                required
                style={styles.input}
                disabled={verifying}
              />
              <button type="submit" disabled={verifying} style={styles.primaryBtn}>
                {verifying ? 'Verifying...' : 'Continue'}
              </button>
            </form>
            <p style={styles.helpText}>This email must match the one used when booking.</p>
          </div>
        </div>
      </div>
    );
  }

  // Verified — show booking details + payment button
  return (
    <div style={styles.page}>
      <Header />
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Complete Your Payment</h2>
          <div style={styles.detailsBox}>
            <h3 style={styles.detailsTitle}>Booking Details</h3>
            <p style={styles.detail}><strong>Provider:</strong> {booking.profiles?.name || 'Provider'}</p>
            <p style={styles.detail}><strong>Service:</strong> {booking.service_name || '—'}</p>
            <p style={styles.detail}><strong>Date:</strong> {booking.booking_date} · {booking.time_slot}</p>
            <p style={styles.detail}><strong>Total:</strong> {booking.total_price}</p>
          </div>
          <p style={styles.subtitle}>Choose a payment method to complete your payment:</p>
          <button onClick={() => setShowPaymentSelection(true)} style={styles.primaryBtn}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: '"Outfit", sans-serif',
    background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 50%, #f9fafb 100%)',
    minHeight: '100vh',
    paddingTop: 70
  },
  center: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    maxWidth: 600,
    margin: '0 auto',
    padding: '40px 20px'
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 8px 24px rgba(6, 95, 70, 0.08)',
    border: '1px solid #ecfdf5'
  },
  title: {
    margin: '0 0 8px',
    fontSize: 26,
    fontWeight: 800,
    background: 'linear-gradient(135deg, #065f46 0%, #14b8a6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    margin: '0 0 24px',
    fontSize: 15,
    color: '#6b7280'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #ecfdf5',
    borderRadius: 12,
    fontSize: 16,
    fontFamily: '"Outfit", sans-serif',
    outline: 'none',
    marginBottom: 12,
    boxSizing: 'border-box'
  },
  primaryBtn: {
    width: '100%',
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #14b8a6 0%, #065f46 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif',
    boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)',
    transition: 'all 0.2s'
  },
  helpText: {
    margin: '12px 0 0',
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center'
  },
  detailsBox: {
    background: '#f0fdfa',
    border: '1px solid #ecfdf5',
    borderRadius: 12,
    padding: 20,
    margin: '20px 0'
  },
  detailsTitle: {
    margin: '0 0 12px',
    fontSize: 16,
    fontWeight: 700,
    color: '#065f46'
  },
  detail: {
    margin: '6px 0',
    fontSize: 14,
    color: '#111827'
  },
  errorBox: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 8px 24px rgba(220, 38, 38, 0.08)',
    border: '1px solid #fef2f2',
    textAlign: 'center'
  },
  errorTitle: {
    margin: '0 0 12px',
    fontSize: 24,
    fontWeight: 700,
    color: '#dc2626'
  },
  errorText: {
    margin: '8px 0',
    fontSize: 15,
    color: '#6b7280'
  },
  successBox: {
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 8px 24px rgba(20, 184, 166, 0.12)',
    border: '1px solid #ecfdf5',
    textAlign: 'center'
  },
  successTitle: {
    margin: '0 0 12px',
    fontSize: 24,
    fontWeight: 700,
    color: '#065f46'
  },
  successText: {
    margin: '8px 0',
    fontSize: 15,
    color: '#6b7280'
  },
  link: {
    color: '#065f46',
    fontWeight: 600,
    textDecoration: 'none'
  }
};

export default RepayPage;
