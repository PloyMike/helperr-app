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
          Choose Payment Method
        </h2>
        <p style={{ textAlign: 'center', color: '#718096', marginBottom: 30, fontSize: 14 }}>
          Select your preferred payment method
        </p>

        <div style={{
          padding: 20,
          backgroundColor: '#f7fafc',
          borderRadius: 12,
          marginBottom: 30
        }}>
          <div style={{ fontSize: 14, color: '#4a5568', lineHeight: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Service by {booking.profiles?.name || 'Provider'}:</span>
              <span style={{ fontWeight: 600 }}>{curSym}{basePrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#667eea' }}>
              <span>Helperr Fee (9%):</span>
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
              <span>Total:</span>
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
            <svg width="28" height="20" viewBox="0 0 24 18" xmlns="http://www.w3.org/2000/svg" aria-label="Card">
              <rect x="1" y="1" width="22" height="16" rx="2.5" fill="none" stroke="#FFFFFF" stroke-width="1.8"/>
              <rect x="1" y="5" width="22" height="3" fill="#FFFFFF"/>
              <rect x="4" y="11" width="6" height="2" rx="0.5" fill="#FFFFFF"/>
            </svg>
            <span>Pay with Stripe</span>
          </button>

          <button
            disabled
            style={{
              padding: 20,
              background: '#e5e7eb',
              color: '#9ca3af',
              border: 'none',
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              position: 'relative',
              opacity: 0.7
            }}
          >
            <svg width="28" height="20" viewBox="0 0 24 18" xmlns="http://www.w3.org/2000/svg" aria-label="Card">
              <rect x="1" y="1" width="22" height="16" rx="2.5" fill="none" stroke="#9ca3af" stroke-width="1.8"/>
              <rect x="1" y="5" width="22" height="3" fill="#9ca3af"/>
              <rect x="4" y="11" width="6" height="2" rx="0.5" fill="#9ca3af"/>
            </svg>
            <span>Pay with Omise</span>
            <span style={{ position: 'absolute', top: 6, right: 10, fontSize: 11, fontWeight: 600, background: '#6b7280', color: 'white', padding: '2px 8px', borderRadius: 6 }}>Coming soon</span>
          </button>

          <button
            disabled
            style={{
              padding: 20,
              background: '#e5e7eb',
              color: '#9ca3af',
              border: 'none',
              borderRadius: 12,
              fontSize: 18,
              fontWeight: 700,
              cursor: 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              position: 'relative',
              opacity: 0.7
            }}
          >
            <span style={{ position: 'absolute', top: 6, right: 10, fontSize: 11, fontWeight: 600, background: '#6b7280', color: 'white', padding: '2px 8px', borderRadius: 6 }}>Coming soon</span>
            <svg width="72" height="22" viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal">
              <path fill="#FFFFFF" d="M12.2 4.2H5.8c-.5 0-.9.3-1 .8L2.3 22c0 .3.2.6.6.6h3.1c.5 0 .9-.3 1-.8l.7-4.6c.1-.5.5-.8 1-.8h2c4.3 0 6.8-2.1 7.4-6.2.3-1.8 0-3.2-.8-4.2-.9-1.2-2.5-1.8-4.6-1.8h-.5zm.6 6.1c-.4 2.4-2.2 2.4-4 2.4h-1l.7-4.6c0-.3.3-.5.5-.5h.5c1.2 0 2.4 0 3 .7.3.5.4 1.1.3 2zM30.3 10.2H27c-.3 0-.5.2-.5.5l-.1.9-.2-.3c-.7-1-2.3-1.4-3.9-1.4-3.7 0-6.8 2.8-7.4 6.7-.3 2 .1 3.9 1.3 5.2 1 1.2 2.5 1.7 4.3 1.7 3 0 4.6-1.9 4.6-1.9l-.1.9c0 .3.2.6.5.6h3c.5 0 .9-.3 1-.8l1.8-11.4c0-.3-.2-.7-.5-.7zm-4.5 6.5c-.3 1.9-1.8 3.2-3.8 3.2-1 0-1.8-.3-2.3-.9-.5-.6-.7-1.5-.6-2.4.3-1.9 1.9-3.2 3.8-3.2 1 0 1.8.3 2.3.9.5.6.7 1.5.6 2.4zM48 10.2h-3.3c-.3 0-.6.2-.8.4l-4.5 6.6-1.9-6.4c-.1-.4-.5-.7-.9-.7h-3.2c-.3 0-.6.3-.5.7l3.6 10.6-3.4 4.8c-.2.3 0 .8.4.8h3.3c.3 0 .6-.1.8-.4l10.8-15.6c.2-.4 0-.8-.4-.8z"/>
              <path fill="#FFFFFF" d="M58.9 4.2h-6.4c-.5 0-.9.3-1 .8L49 22c0 .3.2.6.6.6h3.3c.3 0 .6-.2.7-.5l.7-4.7c.1-.5.5-.8 1-.8h2c4.3 0 6.8-2.1 7.4-6.2.3-1.8 0-3.2-.8-4.2-.9-1.4-2.6-2-4.7-2zm.7 6.1c-.4 2.4-2.2 2.4-4 2.4h-1l.7-4.6c0-.3.3-.5.5-.5h.5c1.2 0 2.4 0 3 .7.3.5.4 1.1.3 2zM77 10.2h-3.3c-.3 0-.5.2-.5.5l-.1.9-.2-.3c-.7-1-2.3-1.4-3.9-1.4-3.7 0-6.8 2.8-7.4 6.7-.3 2 .1 3.9 1.3 5.2 1 1.2 2.5 1.7 4.3 1.7 3 0 4.6-1.9 4.6-1.9l-.1.9c0 .3.2.6.5.6h3c.5 0 .9-.3 1-.8l1.8-11.4c0-.3-.2-.7-.5-.7zm-4.5 6.5c-.3 1.9-1.8 3.2-3.8 3.2-1 0-1.8-.3-2.3-.9-.5-.6-.7-1.5-.6-2.4.3-1.9 1.9-3.2 3.8-3.2 1 0 1.8.3 2.3.9.5.6.7 1.5.6 2.4zM80.9 4.7L78.3 22c0 .3.2.6.6.6h2.9c.5 0 .9-.3 1-.8l2.5-17c0-.3-.2-.6-.6-.6h-3.2c-.3 0-.5.2-.6.5z"/>
            </svg>
            
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
          Cancel
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
