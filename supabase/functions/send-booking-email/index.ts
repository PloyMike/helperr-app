import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #065f46 0%, #047857 100%); padding: 32px 24px; text-align: center; }
    .logo { width: 120px; height: auto; margin-bottom: 12px; }
    .header-title { color: white; font-size: 28px; font-weight: 800; margin: 0; }
    .content { padding: 32px 24px; }
    .info-box { background: #f0fdf4; border-left: 4px solid #065f46; padding: 16px; margin: 20px 0; border-radius: 8px; }
    .info-item { margin: 12px 0; }
    .info-label { font-weight: 600; color: #065f46; }
    .amount { font-size: 32px; font-weight: 800; color: #065f46; text-align: center; margin: 24px 0; }
    .footer { background: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://helperr.co/logo.jpeg" alt="Helperr" class="logo" />
      <h1 class="header-title">Helperr</h1>
    </div>
    ${content}
    <div class="footer">
      <p>&copy; 2026 Helperr. All rights reserved.</p>
      <p>Questions? Contact us at <a href="mailto:support@helperr.co" style="color: #065f46;">support@helperr.co</a></p>
    </div>
  </div>
</body>
</html>
`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { template, to, variables } = await req.json()

    let subject = ''
    let content = ''

    switch (template) {
      case 'booking-request':
        subject = `New Booking Request from ${variables.customer_name}`
        content = `
          <div class="content">
            <h2 style="color: #065f46; margin-top: 0;">New Booking Request</h2>
            <p>You have received a new booking request:</p>
            <div class="info-box">
              <div class="info-item"><span class="info-label">Customer:</span> ${variables.customer_name}</div>
              <div class="info-item"><span class="info-label">Date:</span> ${variables.booking_date}</div>
              <div class="info-item"><span class="info-label">Time:</span> ${variables.time_slot}</div>
              <div class="info-item"><span class="info-label">Service:</span> ${variables.service}</div>
              <div class="info-item"><span class="info-label">Address:</span> ${variables.address}</div>
            </div>
            <p>Please log in to accept or decline this booking.</p>
          </div>
        `
        break

      case 'booking-request-sent':
        subject = `Booking Request Sent - ${variables.service}`
        content = `
          <div class="content">
            <h2 style="color: #065f46; margin-top: 0;">Booking Request Sent!</h2>
            <p>Hi ${variables.customer_name},</p>
            <p>Your booking request has been sent to ${variables.provider_name}.</p>
            <div class="info-box">
              <div class="info-item"><span class="info-label">Expert:</span> ${variables.provider_name}</div>
              <div class="info-item"><span class="info-label">Service:</span> ${variables.service}</div>
              <div class="info-item"><span class="info-label">Date:</span> ${variables.booking_date}</div>
              <div class="info-item"><span class="info-label">Time:</span> ${variables.time_slot}</div>
              <div class="info-item"><span class="info-label">Address:</span> ${variables.address}</div>
            </div>
            <p style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <strong>Waiting for confirmation...</strong><br/>
              You will receive another email once the expert accepts your booking.
            </p>
          </div>
        `
        break

      case 'booking-accepted':
        subject = `Booking Confirmed - ${variables.provider_name}`
        content = `
          <div class="content">
            <h2 style="color: #065f46; margin-top: 0;">Your Booking is Confirmed!</h2>
            <p>Great news! ${variables.provider_name} has accepted your booking.</p>
            <div class="info-box">
              <div class="info-item"><span class="info-label">Date:</span> ${variables.booking_date}</div>
              <div class="info-item"><span class="info-label">Time:</span> ${variables.time_slot}</div>
              <div class="info-item"><span class="info-label">Service:</span> ${variables.service}</div>
              <div class="info-item"><span class="info-label">Address:</span> ${variables.address}</div>
            </div>
            <p style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #065f46;"><strong>Payment note:</strong> Your payment is already authorized. The amount will be charged automatically after your service is completed.</p>
          </div>
        `
        break

      case 'booking-declined':
        subject = `Booking Declined - ${variables.provider_name}`
        content = `
          <div class="content">
            <h2 style="color: #dc2626; margin-top: 0;">Booking Not Available</h2>
            <p>Unfortunately, ${variables.provider_name} is not available for your requested time.</p>
            <div class="info-box">
              <div class="info-item"><span class="info-label">Date:</span> ${variables.booking_date}</div>
              <div class="info-item"><span class="info-label">Time:</span> ${variables.time_slot}</div>
              <div class="info-item"><span class="info-label">Service:</span> ${variables.service}</div>
            </div>
            <p>Please try booking another provider or different time slot.</p>
          </div>
        `
        break

      case 'payment-authorized':
        subject = `Payment Authorized & Booking Request Sent - ${variables.service}`
        content = `
          <div class="content">
            <h2 style="color: #065f46; margin-top: 0;">Payment Authorized & Request Sent!</h2>
            <p>Hi ${variables.customer_name},</p>
            <p>Your payment has been pre-authorized and your booking request has been sent to ${variables.provider_name}.</p>
            <div class="amount">${variables.amount}</div>
            <div class="info-box">
              <div class="info-item"><span class="info-label">Expert:</span> ${variables.provider_name}</div>
              <div class="info-item"><span class="info-label">Service:</span> ${variables.service}</div>
              <div class="info-item"><span class="info-label">Date:</span> ${variables.booking_date}</div>
              <div class="info-item"><span class="info-label">Time:</span> ${variables.time_slot}</div>
              <div class="info-item"><span class="info-label">Address:</span> ${variables.address}</div>
            </div>
            <p style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <strong>Waiting for confirmation...</strong><br/>
              You will receive another email once the expert accepts your booking.
            </p>
            <p style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #065f46;">
              <strong>Payment note:</strong> Your card is authorized but <strong>NOT charged yet</strong>. Payment is only processed after the service is completed.
            </p>
          </div>
        `
        break

      case 'payment-captured':
        subject = `Payment Received - ${variables.service}`
        content = `
          <div class="content">
            <h2 style="color: #065f46; margin-top: 0;">Payment Processed!</h2>
            <p>Hi ${variables.customer_name},</p>
            <p>Your payment has been successfully processed for your completed service.</p>
            <div class="amount">${variables.amount}</div>
            <div class="info-box">
              <div class="info-item"><span class="info-label">Expert:</span> ${variables.provider_name}</div>
              <div class="info-item"><span class="info-label">Service:</span> ${variables.service}</div>
              <div class="info-item"><span class="info-label">Date:</span> ${variables.booking_date}</div>
            </div>
            <p style="text-align: center; margin-top: 32px;">
              <strong>Thank you for using Helperr!</strong><br/>
              We hope you had a great experience.
            </p>
          </div>
        `
        break

      case 'provider-payment-received':
        subject = `Payment Received - ${variables.service}`
        content = `
          <div class="content">
            <h2 style="color: #065f46; margin-top: 0;">Payment Received!</h2>
            <p>Hi ${variables.provider_name},</p>
            <p>Great news! Payment has been successfully processed for your completed service.</p>
            <div class="amount">${variables.amount}</div>
            <div class="info-box">
              <div class="info-item"><span class="info-label">Customer:</span> ${variables.customer_name}</div>
              <div class="info-item"><span class="info-label">Service:</span> ${variables.service}</div>
              <div class="info-item"><span class="info-label">Date:</span> ${variables.booking_date}</div>
            </div>
            <p style="text-align: center; margin-top: 32px;">
              <strong>The payment will be transferred to your account soon.</strong><br/>
              Thank you for providing excellent service!
            </p>
          </div>
        `
        break

      case 'capture-failed':
        subject = `[Helperr Admin] Capture FAILED - Booking ${variables.booking_id}`
        content = `
          <div class="content">
            <h2 style="color: #dc2626; margin-top: 0;">Auto-Capture Failed</h2>
            <p>A scheduled payment capture has failed and needs your attention.</p>
            <div class="info-box" style="background: #fee2e2; border-left-color: #dc2626;">
              <div class="info-item"><span class="info-label">Booking ID:</span> ${variables.booking_id}</div>
              <div class="info-item"><span class="info-label">Customer:</span> ${variables.customer_name} (${variables.customer_email})</div>
              <div class="info-item"><span class="info-label">Expert:</span> ${variables.provider_name}</div>
              <div class="info-item"><span class="info-label">Service:</span> ${variables.service}</div>
              <div class="info-item"><span class="info-label">Date:</span> ${variables.booking_date} ${variables.time_slot}</div>
              <div class="info-item"><span class="info-label">Amount:</span> ${variables.amount}</div>
              <div class="info-item"><span class="info-label">Payment Provider:</span> ${variables.payment_method}</div>
              <div class="info-item"><span class="info-label">Error:</span> ${variables.error}</div>
            </div>
            <p><strong>Action needed:</strong> Check the provider dashboard (Stripe / Omise / PayPal) for this booking, contact the customer if necessary, and resolve manually.</p>
          </div>
        `
        break

      case 'booking-cancelled-no-response':
        subject = `Booking Cancelled - No Response`
        content = `
          <div class="content">
            <h2 style="color: #dc2626; margin-top: 0;">Booking Cancelled</h2>
            <p>Hi ${variables.customer_name},</p>
            <p>Unfortunately, ${variables.provider_name} didn't respond to your booking request within 48 hours.</p>
            <div class="info-box" style="background: #fee2e2; border-left-color: #dc2626;">
              <div class="info-item"><span class="info-label" style="color: #dc2626;">Service:</span> ${variables.service}</div>
              <div class="info-item"><span class="info-label" style="color: #dc2626;">Date:</span> ${variables.booking_date}</div>
              <div class="info-item"><span class="info-label" style="color: #dc2626;">Time:</span> ${variables.time_slot}</div>
            </div>
            <p style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #065f46; margin-top: 24px;">
              <strong>Good news:</strong> Your payment authorization has been released. You were not charged for this booking.
            </p>
            <p style="text-align: center; margin-top: 24px;">
              Why not try another provider? There are many great helpers waiting to assist you on Helperr.
            </p>
          </div>
        `
        break

      case 'booking-cancelled-by-customer':
        subject = `Booking Cancelled - ${variables.booking_date}`
        content = `
          <div class="content">
            <h2 style="color: #dc2626; margin-top: 0;">Booking Cancelled</h2>
            <p>Hi ${variables.recipient_name},</p>
            <p>${variables.canceller_name} has cancelled their booking with you.</p>
            <div class="info-box" style="background: #fee2e2; border-left-color: #dc2626;">
              <div class="info-item"><span class="info-label" style="color: #dc2626;">Service:</span> ${variables.service}</div>
              <div class="info-item"><span class="info-label" style="color: #dc2626;">Date:</span> ${variables.booking_date}</div>
              <div class="info-item"><span class="info-label" style="color: #dc2626;">Time:</span> ${variables.time_slot}</div>
            </div>
            <p style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #065f46; margin-top: 24px;">
              <strong>Good to know:</strong> The customer's payment authorization has been released. No charges were made.
            </p>
            <p style="text-align: center; margin-top: 24px; color: #6b7280; font-size: 13px;">
              This time slot is now available for new bookings.
            </p>
          </div>
        `
        break

      case 'booking-cancelled-by-provider':
        subject = `Booking Cancelled - ${variables.booking_date}`
        content = `
          <div class="content">
            <h2 style="color: #dc2626; margin-top: 0;">Booking Cancelled</h2>
            <p>Hi ${variables.recipient_name},</p>
            <p>Unfortunately, ${variables.canceller_name} had to cancel your booking.</p>
            <div class="info-box" style="background: #fee2e2; border-left-color: #dc2626;">
              <div class="info-item"><span class="info-label" style="color: #dc2626;">Service:</span> ${variables.service}</div>
              <div class="info-item"><span class="info-label" style="color: #dc2626;">Date:</span> ${variables.booking_date}</div>
              <div class="info-item"><span class="info-label" style="color: #dc2626;">Time:</span> ${variables.time_slot}</div>
            </div>
            <p style="background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #065f46; margin-top: 24px;">
              <strong>Good news:</strong> Your payment authorization has been released. You were not charged for this booking.
            </p>
            <p style="text-align: center; margin-top: 24px;">
              You can browse other providers and book again anytime.
            </p>
          </div>
        `
        break

      case 'payout-sent':
        subject = `Payout Sent - ${variables.amount} on its way`
        content = `
          <div class="content">
            <h2 style="color: #065f46; margin-top: 0;">Your Payout is on its way!</h2>
            <p>Hi ${variables.provider_name},</p>
            <p>Great news — your payout for a completed booking has been sent to your bank account.</p>
            <div class="amount">${variables.amount}</div>
            <div class="info-box">
              <div class="info-item"><span class="info-label">Service:</span> ${variables.service}</div>
              <div class="info-item"><span class="info-label">Booking Date:</span> ${variables.booking_date}</div>
              <div class="info-item"><span class="info-label">Bank:</span> ${variables.bank}</div>
              <div class="info-item"><span class="info-label">Transfer ID:</span> ${variables.transfer_id}</div>
            </div>
            <p style="background: #fef3c7; padding: 16px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <strong>Heads up:</strong> The funds should arrive in your bank account within <strong>1-2 business days</strong>, depending on your bank.
            </p>
            <p style="text-align: center; margin-top: 32px;">
              <strong>Thank you for being part of Helperr!</strong>
            </p>
          </div>
        `
        break

      default:
        throw new Error(`Unknown template: ${template}`)
    }

    const html = emailTemplate(content)

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Helperr <noreply@helperr.co>',
        to: [to],
        subject: subject,
        html: html,
      }),
    })

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.ok ? 200 : 400,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
