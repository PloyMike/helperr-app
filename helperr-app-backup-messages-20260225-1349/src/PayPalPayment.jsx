import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

function PayPalPayment({ booking, onSuccess, onCancel }) {
  // Calculate amounts
  const priceText = booking.total_price || '50€/Std';
  const priceMatch = priceText.match(/(\d+)/);
  const basePrice = priceMatch ? parseInt(priceMatch[0]) : 50;
  const helperrFee = Math.round(basePrice * 0.09);
  const totalAmount = basePrice + helperrFee;

  const initialOptions = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: "EUR",
    intent: "capture"
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: totalAmount.toString(),
          currency_code: "EUR",
          breakdown: {
            item_total: {
              currency_code: "EUR",
              value: basePrice.toString()
            },
            shipping: {
              currency_code: "EUR",
              value: helperrFee.toString()
            }
          }
        },
        description: `Service von ${booking.profile_name}`,
        items: [{
          name: `${booking.profile_name} - ${booking.time_slot}`,
          unit_amount: {
            currency_code: "EUR",
            value: basePrice.toString()
          },
          quantity: "1"
        }]
      }]
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      console.log('PayPal Payment successful:', details);
      onSuccess({
        ...booking,
        payment_status: 'paid',
        payment_method: 'paypal',
        payment_id: details.id,
        total_amount: totalAmount,
        helperr_fee: helperrFee
      });
    });
  };

  const onError = (err) => {
    console.error('PayPal Error:', err);
    alert('PayPal Zahlung fehlgeschlagen!');
  };

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
          💳 PayPal Zahlung
        </h2>
        <p style={{ textAlign: 'center', color: '#718096', marginBottom: 30, fontSize: 14 }}>
          Sichere Bezahlung über PayPal
        </p>

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
            🔒 Sichere PayPal Zahlung
          </p>
          <p style={{ margin: 0 }}>
            • Käuferschutz inklusive<br />
            • Geld-zurück-Garantie<br />
            • Verschlüsselte Übertragung
          </p>
        </div>

        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            style={{
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal'
            }}
          />
        </PayPalScriptProvider>

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
            marginTop: 16
          }}
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}

export default PayPalPayment;
