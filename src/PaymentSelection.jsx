import React, { useState } from 'react';
import { getCurrencyCode, getCurrencySymbol } from './currency';
import StripePayment from './StripePayment';
import PayPalPayment from './PayPalPayment';
import OmisePayment from './OmisePayment';

function PaymentSelection({ booking, onSuccess, onCancel }) {
  const [selectedMethod, setSelectedMethod] = useState(null);

  if (selectedMethod === 'stripe') {
    return <StripePayment booking={booking} onSuccess={onSuccess} onCancel={() => setSelectedMethod(null)} />;
  }

  if (selectedMethod === 'paypal') {
    return <PayPalPayment booking={booking} onSuccess={onSuccess} onCancel={() => setSelectedMethod(null)} />;
  }
  if (selectedMethod === 'omise') {
    return <OmisePayment booking={booking} onSuccess={onSuccess} onCancel={() => setSelectedMethod(null)} />;
  }


  // Calculate amounts
  const priceText = booking.total_price || '50€/Std';
  const priceMatch = priceText.match(/(\d+)/);
  const fallbackPrice = priceMatch ? parseInt(priceMatch[0]) : 50;
  // Use calculated service_price (hourly x duration) when available
  const basePrice = booking.service_price ? Number(booking.service_price) : fallbackPrice;
  const curSym = getCurrencySymbol(getCurrencyCode(priceText));
  const currencyCode = getCurrencyCode(priceText);
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
        padding: window.innerWidth <= 640 ? 20 : 40,
        maxWidth: 500,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxSizing: 'border-box',
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
              <span style={{ fontWeight: 600 }}>{curSym}{basePrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#667eea' }}>
              <span>Helperr Gebühr (9%):</span>
              <span style={{ fontWeight: 600 }}>+{curSym}{helperrFee}</span>
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
              <span>{curSym}{totalAmount}</span>
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
            <svg width="60" height="25" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" aria-label="Stripe">
              <path fill="#FFFFFF" d="M59.5 12.9c0-4.26-2.06-7.62-6-7.62s-6.35 3.36-6.35 7.58c0 5 2.82 7.55 6.87 7.55 1.98 0 3.47-.45 4.6-1.08v-3.32c-1.13.57-2.43.92-4.08.92-1.62 0-3.05-.57-3.23-2.53h8.14c0-.22.05-1.1.05-1.5zm-8.22-1.58c0-1.88 1.15-2.66 2.2-2.66 1.02 0 2.1.78 2.1 2.66h-4.3zM41.5 5.28c-1.63 0-2.68.77-3.26 1.3l-.22-1.04h-3.65v19.4l4.15-.88V19.3c.6.43 1.48 1.05 2.95 1.05 2.98 0 5.7-2.4 5.7-7.7-.02-4.85-2.77-7.37-5.67-7.37zm-1 11.3c-.98 0-1.57-.35-1.97-.78l-.03-6.2c.43-.48 1.03-.82 2-.82 1.53 0 2.6 1.72 2.6 3.9 0 2.23-1.05 3.9-2.6 3.9zM33.04 4.3l4.17-.9V0l-4.17.88V4.3zM33.04 5.56h4.17v14.6h-4.17V5.56zM28.57 6.8L28.3 5.56h-3.58v14.6h4.15v-9.9c.98-1.28 2.64-1.05 3.15-.87V5.56c-.53-.2-2.47-.57-3.45 1.24zM20.23 1.95l-4.05.86-.02 13.3c0 2.45 1.85 4.27 4.3 4.27 1.37 0 2.36-.25 2.92-.55v-3.36c-.53.2-3.13.96-3.13-1.5V9.1h3.13V5.56h-3.13l-.02-3.6zM4.2 9.86c0-.65.53-.9 1.4-.9 1.27 0 2.87.38 4.13 1.06V6.1c-1.37-.55-2.73-.77-4.13-.77C2.2 5.33 0 7.1 0 10.04c0 4.58 6.32 3.85 6.32 5.83 0 .77-.67 1.02-1.6 1.02-1.38 0-3.15-.57-4.55-1.33v3.95c1.55.67 3.13.95 4.55.95 3.48 0 5.8-1.72 5.8-4.7-.02-4.95-6.35-4.07-6.35-5.9z"/>
            </svg>
            <span>Pay with Stripe</span>
          </button>

{currencyCode === 'THB' && (
          <button
            onClick={() => setSelectedMethod('omise')}
            style={{
              padding: 20,
              background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
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
            <svg width="28" height="20" viewBox="0 0 24 18" xmlns="http://www.w3.org/2000/svg" aria-label="Card">
              <rect x="1" y="1" width="22" height="16" rx="2.5" fill="none" stroke="#FFFFFF" stroke-width="1.8"/>
              <rect x="1" y="5" width="22" height="3" fill="#FFFFFF"/>
              <rect x="4" y="11" width="6" height="2" rx="0.5" fill="#FFFFFF"/>
            </svg>
            <span>Pay with Omise</span>
          </button>
          )}

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
            <svg width="72" height="22" viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal">
              <path fill="#FFFFFF" d="M12.2 4.2H5.8c-.5 0-.9.3-1 .8L2.3 22c0 .3.2.6.6.6h3.1c.5 0 .9-.3 1-.8l.7-4.6c.1-.5.5-.8 1-.8h2c4.3 0 6.8-2.1 7.4-6.2.3-1.8 0-3.2-.8-4.2-.9-1.2-2.5-1.8-4.6-1.8h-.5zm.6 6.1c-.4 2.4-2.2 2.4-4 2.4h-1l.7-4.6c0-.3.3-.5.5-.5h.5c1.2 0 2.4 0 3 .7.3.5.4 1.1.3 2zM30.3 10.2H27c-.3 0-.5.2-.5.5l-.1.9-.2-.3c-.7-1-2.3-1.4-3.9-1.4-3.7 0-6.8 2.8-7.4 6.7-.3 2 .1 3.9 1.3 5.2 1 1.2 2.5 1.7 4.3 1.7 3 0 4.6-1.9 4.6-1.9l-.1.9c0 .3.2.6.5.6h3c.5 0 .9-.3 1-.8l1.8-11.4c0-.3-.2-.7-.5-.7zm-4.5 6.5c-.3 1.9-1.8 3.2-3.8 3.2-1 0-1.8-.3-2.3-.9-.5-.6-.7-1.5-.6-2.4.3-1.9 1.9-3.2 3.8-3.2 1 0 1.8.3 2.3.9.5.6.7 1.5.6 2.4zM48 10.2h-3.3c-.3 0-.6.2-.8.4l-4.5 6.6-1.9-6.4c-.1-.4-.5-.7-.9-.7h-3.2c-.3 0-.6.3-.5.7l3.6 10.6-3.4 4.8c-.2.3 0 .8.4.8h3.3c.3 0 .6-.1.8-.4l10.8-15.6c.2-.4 0-.8-.4-.8z"/>
              <path fill="#FFFFFF" d="M58.9 4.2h-6.4c-.5 0-.9.3-1 .8L49 22c0 .3.2.6.6.6h3.3c.3 0 .6-.2.7-.5l.7-4.7c.1-.5.5-.8 1-.8h2c4.3 0 6.8-2.1 7.4-6.2.3-1.8 0-3.2-.8-4.2-.9-1.4-2.6-2-4.7-2zm.7 6.1c-.4 2.4-2.2 2.4-4 2.4h-1l.7-4.6c0-.3.3-.5.5-.5h.5c1.2 0 2.4 0 3 .7.3.5.4 1.1.3 2zM77 10.2h-3.3c-.3 0-.5.2-.5.5l-.1.9-.2-.3c-.7-1-2.3-1.4-3.9-1.4-3.7 0-6.8 2.8-7.4 6.7-.3 2 .1 3.9 1.3 5.2 1 1.2 2.5 1.7 4.3 1.7 3 0 4.6-1.9 4.6-1.9l-.1.9c0 .3.2.6.5.6h3c.5 0 .9-.3 1-.8l1.8-11.4c0-.3-.2-.7-.5-.7zm-4.5 6.5c-.3 1.9-1.8 3.2-3.8 3.2-1 0-1.8-.3-2.3-.9-.5-.6-.7-1.5-.6-2.4.3-1.9 1.9-3.2 3.8-3.2 1 0 1.8.3 2.3.9.5.6.7 1.5.6 2.4zM80.9 4.7L78.3 22c0 .3.2.6.6.6h2.9c.5 0 .9-.3 1-.8l2.5-17c0-.3-.2-.6-.6-.6h-3.2c-.3 0-.5.2-.6.5z"/>
            </svg>
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
