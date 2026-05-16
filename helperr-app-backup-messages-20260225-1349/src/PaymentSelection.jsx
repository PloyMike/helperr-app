import React, { useState } from 'react';
import StripePayment from './StripePayment';
import PayPalPayment from './PayPalPayment';

function PaymentSelection({ booking, onSuccess, onCancel }) {
  const [selectedMethod, setSelectedMethod] = useState(null);

  if (selectedMethod === 'stripe') {
    return <StripePayment booking={booking} onSuccess={onSuccess} onCancel={() => setSelectedMethod(null)} />;
  }

  if (selectedMethod === 'paypal') {
    return <PayPalPayment booking={booking} onSuccess={onSuccess} onCancel={() => setSelectedMethod(null)} />;
  }

  // Calculate amounts
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
          💳 Zahlungsmethode wählen
        </h2>
        <p style={{ textAlign: 'center', color: '#718096', marginBottom: 30, fontSize: 14 }}>
          Wähle deine bevorzugte Zahlungsmethode
        </p>

        <div style={{
          padding: 20,
          backgroundColor: '#f7fafc',
          borderRadius: 12,
          marginBottom: 30
        }}>
          <div style={{ fontSize: 14, color: '#4a5568', lineHeight: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Service von {booking.profile_name}:</span>
              <span style={{ fontWeight: 600 }}>{basePrice}€</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#667eea' }}>
              <span>Helperr Gebühr (9%):</span>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button
            onClick={() => setSelectedMethod('stripe')}
            style={{
              padding: 20,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <span style={{ fontSize: 24 }}>💳</span>
            <span>Mit Kreditkarte bezahlen (Stripe)</span>
          </button>

          <button
            onClick={() => setSelectedMethod('paypal')}
            style={{
              padding: 20,
              background: '#0070ba',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.background = '#005ea6';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.background = '#0070ba';
            }}
          >
            <span style={{ fontSize: 24 }}>💰</span>
            <span>Mit PayPal bezahlen</span>
          </button>
        </div>

        <button
          onClick={onCancel}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'white',
            color: '#718096',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 20
          }}
        >
          Abbrechen
        </button>

        <p style={{ 
          marginTop: 20, 
          fontSize: 12, 
          color: '#a0aec0', 
          textAlign: 'center',
          lineHeight: 1.6
        }}>
          🔒 Alle Zahlungen sind sicher und verschlüsselt
        </p>
      </div>
    </div>
  );
}

export default PaymentSelection;
