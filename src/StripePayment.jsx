import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function StripePayment({ booking, onSuccess, onCancel }) {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      const stripe = await stripePromise;

      // Calculate price
      const priceText = booking.total_price || '50€/Std';
      const priceMatch = priceText.match(/(\d+)/);
      const basePrice = priceMatch ? parseInt(priceMatch[0]) : 50;
      
      // Add 9% commission
      const helperrFee = Math.round(basePrice * 0.09);
      const totalAmount = basePrice + helperrFee;

      // For now, we'll simulate payment (Stripe Checkout needs backend)
      // In production, you'd create a Checkout Session on your backend
      
      alert(`💳 STRIPE PAYMENT SIMULATION\n\n` +
            `Service: ${basePrice}€\n` +
            `Helperr Gebühr (9%): ${helperrFee}€\n` +
            `Gesamt: ${totalAmount}€\n\n` +
            `✅ In Production würde hier Stripe Checkout öffnen!\n\n` +
            `Für echte Zahlungen brauchst du:\n` +
            `1. Backend API (Node.js/Python)\n` +
            `2. Stripe Checkout Session erstellen\n` +
            `3. Webhook für Bestätigungen\n\n` +
            `Für jetzt: Buchung wird als "bezahlt" markiert!`);

      // Mark as paid (simulation)
      onSuccess({
        ...booking,
        payment_status: 'paid',
        total_amount: totalAmount,
        helperr_fee: helperrFee
      });

    } catch (error) {
      console.error('Payment error:', error);
      alert('Fehler bei der Zahlung!');
    } finally {
      setProcessing(false);
    }
  };

  // Calculate amounts for display
  const priceText = booking.total_price || '50€/Std';
  const priceMatch = priceText.match(/(\d+)/);
  const basePrice = priceMatch ? parseInt(priceMatch[0]) : 50;
  const helperrFee = Math.round(basePrice * 0.09);
  const totalAmount = basePrice + helperrFee;

  return (
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
      zIndex: 2000,
      padding: 20
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 40,
        maxWidth: 500,
        width: '100%',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, textAlign: 'center', color: '#2d3748' }}>
          💳 Zahlung
        </h2>
        <p style={{ textAlign: 'center', color: '#718096', marginBottom: 30, fontSize: 14 }}>
          Sichere Bezahlung über Stripe
        </p>

        {/* Booking Summary */}
        <div style={{
          padding: 20,
          backgroundColor: '#f7fafc',
          borderRadius: 12,
          marginBottom: 24
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#2d3748' }}>
            Buchungsdetails
          </h3>
          <div style={{ fontSize: 14, color: '#4a5568', lineHeight: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Service von {booking.profile_name}:</span>
              <span style={{ fontWeight: 600 }}>{basePrice}€</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#667eea' }}>
              <span>Helperr Service-Gebühr (9%):</span>
              <span style={{ fontWeight: 600 }}>+{helperrFee}€</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: 12,
              paddingTop: 12,
              borderTop: '2px solid #e2e8f0',
              fontSize: 18,
              fontWeight: 700,
              color: '#2d3748'
            }}>
              <span>Gesamt:</span>
              <span>{totalAmount}€</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div style={{
          padding: 16,
          backgroundColor: '#edf2f7',
          borderRadius: 8,
          fontSize: 13,
          color: '#4a5568',
          lineHeight: 1.6,
          marginBottom: 24
        }}>
          <p style={{ margin: 0, fontWeight: 600, marginBottom: 8 }}>
            🔒 Sichere Zahlung
          </p>
          <p style={{ margin: 0 }}>
            • Verschlüsselte Übertragung<br />
            • Käuferschutz inklusive<br />
            • Geld-zurück-Garantie
          </p>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          style={{
            width: '100%',
            padding: '18px',
            background: processing 
              ? '#cbd5e0' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 700,
            cursor: processing ? 'not-allowed' : 'pointer',
            marginBottom: 12,
            transition: 'all 0.2s'
          }}
        >
          {processing ? 'Verarbeite...' : `${totalAmount}€ jetzt bezahlen`}
        </button>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          disabled={processing}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'white',
            color: '#718096',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: processing ? 'not-allowed' : 'pointer'
          }}
        >
          Abbrechen
        </button>

        {/* Note */}
        <p style={{ 
          marginTop: 20, 
          fontSize: 12, 
          color: '#a0aec0', 
          textAlign: 'center',
          lineHeight: 1.6
        }}>
          Demo-Modus: Echte Zahlungen erfordern Backend-Integration.<br />
          Kontaktiere Helperr Support für Live-Zahlungen.
        </p>
      </div>
    </div>
  );
}

export default StripePayment;
