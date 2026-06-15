import React from 'react';
import { getCurrencyCode, getCurrencySymbol } from './currency';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { supabase } from './supabase';

function PayPalPayment({ booking, onSuccess, onCancel }) {
  // Calculate amounts
  const priceText = booking.total_price || '50€/Std';
  const priceMatch = priceText.match(/(\d+)/);
  const fallbackPrice = priceMatch ? parseInt(priceMatch[0]) : 50;
  // Use calculated service_price (hourly x duration) when available
  const basePrice = booking.service_price ? Number(booking.service_price) : fallbackPrice;
  const helperrFee = Math.round(basePrice * 0.09);
  const totalAmount = basePrice + helperrFee;
  // PayPal unterstuetzt nicht jede Waehrung -> Fallback USD
  const PAYPAL_OK = ['EUR','USD','GBP','AUD','CAD','CHF','CNY','CZK','DKK','HKD','HUF','ILS','JPY','MYR','NOK','NZD','PHP','PLN','SEK','SGD','THB','TWD'];
  const rawCode = getCurrencyCode(priceText);
  const payCode = PAYPAL_OK.includes(rawCode) ? rawCode : 'USD';
  const curSym = getCurrencySymbol(rawCode);

  const initialOptions = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: payCode,
    intent: "authorize"
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: totalAmount.toString(),
          currency_code: payCode,
          breakdown: {
            item_total: {
              currency_code: payCode,
              value: basePrice.toString()
            },
            shipping: {
              currency_code: payCode,
              value: helperrFee.toString()
            }
          }
        },
        description: `Service by ${booking.profiles?.name || 'Provider'}`,
        items: [{
          name: `${booking.profiles?.name || 'Provider'} - ${booking.time_slot}`,
          unit_amount: {
            currency_code: payCode,
            value: basePrice.toString()
          },
          quantity: "1"
        }]
      }]
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.authorize().then(async (details) => {
      console.log('PayPal Authorization successful:', details);
      // Authorization-ID (NICHT Order-ID) speichern - brauchen wir spaeter zum Capturen
      const authId = details?.purchase_units?.[0]?.payments?.authorizations?.[0]?.id || details.id;

      // Buchung in DB updaten - wie bei Stripe/Omise
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'authorized',
          payment_intent_id: authId,
          payment_method: 'paypal',
          total_amount: totalAmount,
        })
        .eq('id', booking.id);

      if (updateError) {
        console.error('PayPal DB update error:', updateError);
        alert('Payment authorized, but failed to save. Please contact support.');
        return;
      }

      // Send payment authorized email (wie bei Omise/Stripe)
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
              end_date: booking.end_date,
              time_slot: booking.time_slot,
              address: booking.service_address || 'N/A',
              amount: `${curSym}${totalAmount}`,
            },
          }),
        });
      } catch (emailError) {
        console.error('PayPal email error:', emailError);
      }

      onSuccess({
        ...booking,
        payment_status: 'authorized',
        payment_method: 'paypal',
        payment_intent_id: authId,
        total_amount: totalAmount,
        helperr_fee: helperrFee
      });
    });
  };

  const onError = (err) => {
    console.error('PayPal Error:', err);
    alert('PayPal payment failed!');
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
          💳 PayPal Payment
        </h2>
        <p style={{ textAlign: 'center', color: '#718096', marginBottom: 30, fontSize: 14 }}>
          Secure payment via PayPal
        </p>

        <div style={{
          padding: 20,
          backgroundColor: '#f7fafc',
          borderRadius: 12,
          marginBottom: 24
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#2d3748' }}>
            Booking Details
          </h3>
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
            🔒 Secure PayPal Payment
          </p>
          <p style={{ margin: 0 }}>
            • Buyer protection included<br />
            • Money-back guarantee<br />
            • Encrypted transmission
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
          Cancel
        </button>
      </div>
    </div>
  );
}

export default PayPalPayment;
