import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from './supabase';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ booking, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Calculate amounts
  const priceText = booking.total_price || '50€/Std';
  const priceMatch = priceText.match(/(\d+)/);
  const basePrice = priceMatch ? parseInt(priceMatch[0]) : 50;
  const helperrFee = Math.round(basePrice * 0.09);
  const totalAmount = basePrice + helperrFee;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Call Edge Function to create Payment Intent
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('https://jyuatojpkluyidpefzub.supabase.co/functions/v1/stripe-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${session?.access_token}\`,
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: basePrice,
        }),
      });

      const { clientSecret, paymentIntentId, error: apiError } = await response.json();

      if (apiError) {
        throw new Error(apiError);
      }

      // Confirm payment with card
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Update booking with payment info
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'authorized',
          payment_intent_id: paymentIntentId,
          total_amount: totalAmount,
        })
        .eq('id', booking.id);

      if (updateError) throw updateError;

      onSuccess();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.summary}>
        <div style={styles.summaryRow}>
          <span>Service:</span>
          <span>\${basePrice}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Platform Fee (9%):</span>
          <span>\${helperrFee}</span>
        </div>
        <div style={{ ...styles.summaryRow, ...styles.total }}>
          <span>Total:</span>
          <span>\${totalAmount}</span>
        </div>
      </div>

      <div style={styles.cardWrapper}>
        <CardElement options={cardElementOptions} />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.actions}>
        <button type="button" onClick={onCancel} style={styles.btnCancel}>
          Cancel
        </button>
        <button type="submit" disabled={!stripe || processing} style={{
          ...styles.btnPay,
          opacity: (!stripe || processing) ? 0.6 : 1,
        }}>
          {processing ? 'Processing...' : 'Authorize Payment'}
        </button>
      </div>

      <p style={styles.note}>
        💡 Your card will be pre-authorized but not charged until the service is completed.
      </p>
    </form>
  );
}

function StripePayment({ booking, onSuccess, onCancel }) {
  return (
    <div style={styles.container}>
      <Elements stripe={stripePromise}>
        <CheckoutForm booking={booking} onSuccess={onSuccess} onCancel={onCancel} />
      </Elements>
    </div>
  );
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const styles = {
  container: {
    padding: 20,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  summary: {
    background: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    border: '1px solid #e5e7eb',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  total: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111827',
    paddingTop: 12,
    borderTop: '2px solid #e5e7eb',
    marginTop: 8,
  },
  cardWrapper: {
    padding: 16,
    border: '2px solid #e5e7eb',
    borderRadius: 12,
    background: 'white',
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
  },
  actions: {
    display: 'flex',
    gap: 12,
  },
  btnCancel: {
    flex: 1,
    padding: '14px',
    background: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif',
  },
  btnPay: {
    flex: 1,
    padding: '14px',
    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: '"Outfit", sans-serif',
    boxShadow: '0 4px 12px rgba(6, 95, 70, 0.3)',
  },
  note: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    margin: '8px 0 0',
  },
};

export default StripePayment;
