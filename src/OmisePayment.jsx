import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

function OmisePayment({ booking, onSuccess, onCancel }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  // Calculate amounts
  const priceText = booking.total_price || '50฿/Hr';
  const priceMatch = priceText.match(/(\d+)/);
  const basePrice = priceMatch ? parseInt(priceMatch[0]) : 500;
  const helperrFee = Math.round(basePrice * 0.09);
  const totalAmount = basePrice + helperrFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // Load Omise.js
      if (!window.Omise) {
        const script = document.createElement('script');
        script.src = 'https://cdn.omise.co/omise.js';
        script.onload = () => processPayment();
        document.head.appendChild(script);
      } else {
        await processPayment();
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
      setProcessing(false);
    }
  };

  const processPayment = async () => {
    try {
      window.Omise.setPublicKey(process.env.REACT_APP_OMISE_PUBLIC_KEY);

      // Create token
      window.Omise.createToken('card', {
        name: cardName,
        number: cardNumber.replace(/\s/g, ''),
        expiration_month: expiryMonth,
        expiration_year: expiryYear,
        security_code: cvv,
      }, async (statusCode, response) => {
        if (statusCode === 200) {
          // Call Edge Function
          const { data: { session } } = await supabase.auth.getSession();
          
          const paymentResponse = await fetch('https://jyuatojpkluyidpefzub.supabase.co/functions/v1/omise-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({
              bookingId: booking.id,
              amount: basePrice,
              token: response.id,
            }),
          });

          const result = await paymentResponse.json();

          if (result.error) {
            throw new Error(result.error);
          }

          // Update booking
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              payment_status: 'authorized',
              payment_intent_id: result.chargeId,
              total_amount: totalAmount,
            })
            .eq('id', booking.id);

          if (updateError) throw updateError;

          // Send payment authorized email
          try {
            const { data: { session } } = await supabase.auth.getSession();
            
            await fetch('https://jyuatojpkluyidpefzub.supabase.co/functions/v1/send-booking-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`,
              },
              body: JSON.stringify({
                template: 'payment-authorized',
                to: booking.customer_email,
                variables: {
                  customer_name: booking.customer_name,
                  provider_name: booking.profiles?.name || 'Provider',
                  service: booking.service_name,
                  booking_date: booking.booking_date,
                  time_slot: booking.time_slot,
                  address: booking.service_address || 'N/A',
                  amount: `฿${totalAmount}`,
                },
              }),
            });
          } catch (emailError) {
            console.error('Email error:', emailError);
          }

          onSuccess();
        } else {
          throw new Error(response.message || 'Card tokenization failed');
        }
      });
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.summary}>
          <div style={styles.summaryRow}>
            <span>Service:</span>
            <span>฿{basePrice}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Platform Fee (9%):</span>
            <span>฿{helperrFee}</span>
          </div>
          <div style={{ ...styles.summaryRow, ...styles.total }}>
            <span>Total:</span>
            <span>฿{totalAmount}</span>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Card Holder Name</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
            style={styles.input}
            placeholder="John Doe"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim())}
            required
            maxLength="19"
            style={styles.input}
            placeholder="4242 4242 4242 4242"
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={styles.label}>Month</label>
            <input
              type="text"
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
              required
              maxLength="2"
              style={styles.input}
              placeholder="12"
            />
          </div>
          <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={styles.label}>Year</label>
            <input
              type="text"
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
              required
              maxLength="4"
              style={styles.input}
              placeholder="2034"
            />
          </div>
          <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={styles.label}>CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
              maxLength="4"
              style={styles.input}
              placeholder="123"
            />
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.actions}>
          <button type="button" onClick={onCancel} style={styles.btnCancel}>
            Cancel
          </button>
          <button type="submit" disabled={processing} style={{
            ...styles.btnPay,
            opacity: processing ? 0.6 : 1,
          }}>
            {processing ? 'Processing...' : 'Pay with Omise'}
          </button>
        </div>

        <p style={styles.note}>
          💡 Secured by Omise - Thailand's trusted payment gateway
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: { padding: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  summary: { background: '#f9fafb', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#6b7280' },
  total: { fontSize: 18, fontWeight: 700, color: '#111827', paddingTop: 12, borderTop: '2px solid #e5e7eb', marginTop: 8 },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: '#374151' },
  input: { padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 15, fontFamily: '"Outfit", sans-serif' },
  error: { background: '#fee2e2', color: '#dc2626', padding: 12, borderRadius: 8, fontSize: 14 },
  actions: { display: 'flex', gap: 12 },
  btnCancel: { flex: 1, padding: '14px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  btnPay: { flex: 1, padding: '14px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)' },
  note: { fontSize: 13, color: '#6b7280', textAlign: 'center', margin: '8px 0 0' },
};

export default OmisePayment;
