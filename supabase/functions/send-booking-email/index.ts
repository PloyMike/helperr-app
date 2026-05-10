import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { template, to, variables } = await req.json()

    const html = getTemplateHtml(template, variables)
    const subject = getSubject(template, variables)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Helperr <bookings@helperr.co>',
        to: [to],
        subject: subject,
        html: html,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: res.ok ? 200 : 400,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

function getSubject(template: string, vars: any): string {
  const subjects: Record<string, string> = {
    'new-booking-request': `🔔 New Booking Request - ${vars.customer_name} | Helperr`,
    'booking-confirmation': `Booking Request Sent - ${vars.provider_name} | Helperr`,
    'welcome-email': 'Welcome to Helperr!',
    'booking-accepted': `✓ Booking Accepted - ${vars.provider_name} | Helperr`,
    'booking-cancelled-48h': 'Booking Cancelled - No Response | Helperr',
    'booking-declined': `Booking Declined - ${vars.provider_name} | Helperr`,
    'booking-cancelled-by-provider': `Booking Cancelled - ${vars.provider_name} | Helperr`,
    'booking-cancelled-by-customer': 'Booking Cancelled | Helperr',
    'booking-cancelled-notification-provider': 'Booking Cancelled by Customer | Helperr',
  }
  return subjects[template] || 'Helperr Notification'
}

function getTemplateHtml(template: string, vars: any): string {
  const templates: Record<string, string> = {
    'booking-confirmation': BOOKING_CONFIRMATION_TEMPLATE,
    'new-booking-request': NEW_BOOKING_REQUEST_TEMPLATE,
    'welcome-email': WELCOME_EMAIL_TEMPLATE,
    'booking-accepted': BOOKING_ACCEPTED_TEMPLATE,
    'booking-cancelled-48h': BOOKING_CANCELLED_48H_TEMPLATE,
    'booking-declined': BOOKING_DECLINED_TEMPLATE,
    'booking-cancelled-by-provider': BOOKING_CANCELLED_BY_PROVIDER_TEMPLATE,
    'booking-cancelled-by-customer': BOOKING_CANCELLED_BY_CUSTOMER_TEMPLATE,
    'booking-cancelled-notification-provider': BOOKING_CANCELLED_NOTIFICATION_PROVIDER,
    'customer-cancellation-confirmation': CUSTOMER_CANCELLATION_CONFIRMATION,
  }
  
  let html = templates[template] || ''
  
  // Replace all variables {{{variable_name}}}
  Object.keys(vars).forEach(key => {
    const regex = new RegExp(`{{{${key}}}}`, 'g')
    html = html.replace(regex, vars[key] || '')
  })
  
  return html
}

// Email Templates
const BOOKING_CONFIRMATION_TEMPLATE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);overflow:hidden">
<tr><td style="background:linear-gradient(135deg,#14B8A6 0%,#0D9488 100%);padding:40px 30px;text-align:center">
<img src="https://helperr.co/logo.jpeg" alt="Helperr" style="height:60px;margin-bottom:15px">
<h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700">Booking Request Sent!</h1>
</td></tr>
<tr><td style="padding:40px 30px">
<p style="margin:0 0 20px;color:#374151;font-size:16px">Hi <strong>{{{customer_name}}}</strong>,</p>
<p style="margin:0 0 30px;color:#374151;font-size:16px">Your booking request has been sent to the expert. You will receive a confirmation email once they accept.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:8px;padding:20px;margin-bottom:30px">
<tr><td>
<p style="margin:0 0 12px;color:#6b7280;font-size:14px;font-weight:600">BOOKING DETAILS</p>
<p style="margin:0 0 10px;color:#111827;font-size:16px"><strong>Provider:</strong> {{{provider_name}}}</p>
<p style="margin:0 0 10px;color:#111827;font-size:16px"><strong>Service:</strong> {{{service}}}</p>
<p style="margin:0 0 10px;color:#111827;font-size:16px"><strong>Date:</strong> {{{booking_date}}}</p>
<p style="margin:0 0 10px;color:#111827;font-size:16px"><strong>Time:</strong> {{{time_slot}}}</p>
<p style="margin:0;color:#111827;font-size:16px"><strong>Location:</strong> {{{address}}}</p>
</td></tr></table>
<table width="100%"><tr><td align="center" style="padding:20px 0">
<a href="https://helperr.co/my-bookings" style="display:inline-block;background:linear-gradient(135deg,#14B8A6 0%,#0D9488 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px">View My Bookings</a>
</td></tr></table>
</td></tr>
<tr><td style="background-color:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb">
<p style="margin:0 0 10px;color:#6b7280;font-size:14px">Need help? Email <a href="mailto:support@helperr.co" style="color:#14B8A6">support@helperr.co</a></p>
<p style="margin:0;color:#9ca3af;font-size:12px">© 2025 Helperr</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`

const WELCOME_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6">
<table width="100%" style="background-color:#f3f4f6;padding:40px 20px"><tr><td align="center">
<table width="600" style="background-color:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:linear-gradient(135deg,#14B8A6 0%,#0D9488 100%);padding:40px 30px;text-align:center">
<img src="https://helperr.co/logo.jpeg" alt="Helperr" style="height:60px;margin-bottom:15px">
<h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700">Welcome to Helperr!</h1>
</td></tr>
<tr><td style="padding:40px 30px">
<p style="margin:0 0 20px;color:#374151;font-size:16px">Hi <strong>{{{user_name}}}</strong>,</p>
<p style="margin:0 0 30px;color:#374151;font-size:16px">Thanks for joining! Find trusted local service providers.</p>
<table width="100%"><tr><td align="center" style="padding:20px 0">
<a href="https://helperr.co" style="display:inline-block;background:linear-gradient(135deg,#14B8A6 0%,#0D9488 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600">Start Browsing</a>
</td></tr></table>
</td></tr>
</table>
</td></tr></table>
</body></html>`

const BOOKING_ACCEPTED_TEMPLATE = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:sans-serif;background-color:#f3f4f6">
<table width="100%" style="padding:40px 20px"><tr><td align="center">
<table width="600" style="background:#fff;border-radius:12px">
<tr><td style="background:linear-gradient(135deg,#059669 0%,#047857 100%);padding:40px 30px;text-align:center">
<img src="https://helperr.co/logo.jpeg" style="height:60px;margin-bottom:15px">
<h1 style="margin:0;color:#fff;font-size:28px">✓ Booking Accepted!</h1>
</td></tr>
<tr><td style="padding:40px 30px">
<p style="margin:0 0 20px;color:#374151">Great news, <strong>{{{customer_name}}}</strong>!</p>
<p style="margin:0 0 30px;color:#374151"><strong>{{{provider_name}}}</strong> has accepted your booking!</p>
<table width="100%" style="background:#f0fdf4;border-radius:8px;padding:20px;margin-bottom:30px;border-left:4px solid #059669">
<tr><td>
<p style="margin:0 0 10px"><strong>Customer:</strong> {{{customer_name}}}</p>
<p style="margin:0 0 10px"><strong>Date:</strong> {{{booking_date}}}</p>
<p style="margin:0 0 10px"><strong>Time:</strong> {{{time_slot}}}</p>
<p style="margin:0"><strong>Location:</strong> {{{address}}}</p>
</td></tr></table>
<table width="100%"><tr><td align="center" style="padding:20px 0">
<a href="https://helperr.co/my-bookings" style="display:inline-block;background:linear-gradient(135deg,#059669,#047857);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600">View Details</a>
</td></tr></table>
</td></tr>
</table>
</td></tr></table>
</body></html>`

const BOOKING_CANCELLED_48H_TEMPLATE = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:sans-serif;background:#f3f4f6">
<table width="100%" style="padding:40px 20px"><tr><td align="center">
<table width="600" style="background:#fff;border-radius:12px">
<tr><td style="background:linear-gradient(135deg,#DC2626,#B91C1C);padding:40px 30px;text-align:center">
<img src="https://helperr.co/logo.jpeg" style="height:60px;margin-bottom:15px">
<h1 style="margin:0;color:#fff;font-size:28px">❌ Booking Cancelled - No Response</h1>
</td></tr>
<tr><td style="padding:40px 30px">
<p style="margin:0 0 20px">Hi <strong>{{{customer_name}}}</strong>,</p>
<p style="margin:0 0 30px">Your booking was automatically cancelled (no response within 48h).</p>
<table width="100%" style="background:#fef2f2;border-radius:8px;padding:20px;margin-bottom:30px;border-left:4px solid #DC2626">
<tr><td>
<p style="margin:0 0 10px"><strong>Customer:</strong> {{{customer_name}}}</p>
<p style="margin:0 0 10px"><strong>Date:</strong> {{{booking_date}}}</p>
<p style="margin:0"><strong>Time:</strong> {{{time_slot}}}</p>
</td></tr></table>
<table width="100%"><tr><td align="center" style="padding:20px 0">
<a href="https://helperr.co" style="display:inline-block;background:linear-gradient(135deg,#14B8A6,#0D9488);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600">Find Another Provider</a>
</td></tr></table>
</td></tr>
</table>
</td></tr></table>
</body></html>`

const BOOKING_DECLINED_TEMPLATE = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:sans-serif;background:#f3f4f6">
<table width="100%" style="padding:40px 20px"><tr><td align="center">
<table width="600" style="background:#fff;border-radius:12px">
<tr><td style="background:linear-gradient(135deg,#F59E0B,#D97706);padding:40px 30px;text-align:center">
<img src="https://helperr.co/logo.jpeg" style="height:60px;margin-bottom:15px">
<h1 style="margin:0;color:#fff;font-size:28px">Booking Declined</h1>
</td></tr>
<tr><td style="padding:40px 30px">
<p style="margin:0 0 20px">Hi <strong>{{{provider_name}}}</strong>,</p>
<p style="margin:0 0 30px"><strong>{{{provider_name}}}</strong> was unable to accept your booking.</p>
<table width="100%" style="background:#fffbeb;border-radius:8px;padding:20px;margin-bottom:30px;border-left:4px solid #F59E0B">
<tr><td>
<p style="margin:0 0 10px"><strong>Customer:</strong> {{{customer_name}}}</p>
<p style="margin:0 0 10px"><strong>Date:</strong> {{{booking_date}}}</p>
<p style="margin:0"><strong>Time:</strong> {{{time_slot}}}</p>
</td></tr></table>
<table width="100%"><tr><td align="center" style="padding:20px 0">
<a href="https://helperr.co" style="display:inline-block;background:linear-gradient(135deg,#14B8A6,#0D9488);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600">Browse Providers</a>
</td></tr></table>
</td></tr>
</table>
</td></tr></table>
</body></html>`

const BOOKING_CANCELLED_BY_PROVIDER_TEMPLATE = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:sans-serif;background:#f3f4f6">
<table width="100%" style="padding:40px 20px"><tr><td align="center">
<table width="600" style="background:#fff;border-radius:12px">
<tr><td style="background:linear-gradient(135deg,#DC2626,#B91C1C);padding:40px 30px;text-align:center">
<img src="https://helperr.co/logo.jpeg" style="height:60px;margin-bottom:15px">
<h1 style="margin:0;color:#fff;font-size:28px">❌ Booking Cancelled by Provider</h1>
</td></tr>
<tr><td style="padding:40px 30px">
<p style="margin:0 0 20px">Hi <strong>{{{customer_name}}}</strong>,</p>
<p style="margin:0 0 30px"><strong>{{{provider_name}}}</strong> had to cancel your booking.</p>
<table width="100%" style="background:#fef2f2;border-radius:8px;padding:20px;margin-bottom:30px;border-left:4px solid #DC2626">
<tr><td>
<p style="margin:0 0 10px"><strong>Customer:</strong> {{{customer_name}}}</p>
<p style="margin:0 0 10px"><strong>Date:</strong> {{{booking_date}}}</p>
<p style="margin:0"><strong>Time:</strong> {{{time_slot}}}</p>
</td></tr></table>
<table width="100%"><tr><td align="center" style="padding:20px 0">
<a href="https://helperr.co" style="display:inline-block;background:linear-gradient(135deg,#14B8A6,#0D9488);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600">Find Another Provider</a>
</td></tr></table>
</td></tr>
</table>
</td></tr></table>
</body></html>`

const BOOKING_CANCELLED_BY_CUSTOMER_TEMPLATE = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:sans-serif;background:#f3f4f6">
<table width="100%" style="padding:40px 20px"><tr><td align="center">
<table width="600" style="background:#fff;border-radius:12px">
<tr><td style="background:linear-gradient(135deg,#DC2626,#991B1B);padding:40px 30px;text-align:center">
<img src="https://helperr.co/logo.jpeg" style="height:60px;margin-bottom:15px">
<h1 style="margin:0;color:#fff;font-size:28px">❌ Booking Cancelled by Customer</h1>
</td></tr>
<tr><td style="padding:40px 30px">
<p style="margin:0 0 20px">Hi <strong>{{{provider_name}}}</strong>,</p>
<p style="margin:0 0 30px"><strong>{{{customer_name}}}</strong> has cancelled their booking with you.</p>
<table width="100%" style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:30px;border-left:4px solid #DC2626">
<tr><td>
<p style="margin:0 0 10px"><strong>Customer:</strong> {{{customer_name}}}</p>
<p style="margin:0 0 10px"><strong>Date:</strong> {{{booking_date}}}</p>
<p style="margin:0"><strong>Time:</strong> {{{time_slot}}}</p>
</td></tr></table>
<table width="100%"><tr><td align="center" style="padding:20px 0">
<a href="https://helperr.co" style="display:inline-block;background:linear-gradient(135deg,#14B8A6,#0D9488);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600">Browse Providers</a>
</td></tr></table>
</td></tr>
</table>
</td></tr></table>
</body></html>`

const NEW_BOOKING_REQUEST_TEMPLATE = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);overflow:hidden">
<tr><td style="background:linear-gradient(135deg,#14B8A6 0%,#0D9488 100%);padding:40px 30px;text-align:center">
<img src="https://helperr.co/logo.jpeg" alt="Helperr" style="height:60px;margin-bottom:15px">
<h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700">🔔 New Booking Request!</h1>
</td></tr>
<tr><td style="padding:40px 30px">
<p style="margin:0 0 20px;color:#374151;font-size:16px">Hi <strong>{{{provider_name}}}</strong>,</p>
<p style="margin:0 0 30px;color:#374151;font-size:16px">You have a new booking request from <strong>{{{customer_name}}}</strong>!</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border-radius:8px;padding:20px;margin-bottom:30px">
<tr><td>
<p style="margin:0 0 12px;color:#6b7280;font-size:14px;font-weight:600">BOOKING DETAILS</p>
<p style="margin:0 0 10px;color:#111827;font-size:16px"><strong>Customer:</strong> {{{customer_name}}}</p>
<p style="margin:0 0 10px;color:#111827;font-size:16px"><strong>Service:</strong> {{{service}}}</p>
<p style="margin:0 0 10px;color:#111827;font-size:16px"><strong>Date:</strong> {{{booking_date}}}</p>
<p style="margin:0 0 10px;color:#111827;font-size:16px"><strong>Time:</strong> {{{time_slot}}}</p>
<p style="margin:0;color:#111827;font-size:16px"><strong>Location:</strong> {{{address}}}</p>
</td></tr></table>
<p style="margin:0 0 30px;color:#374151;font-size:16px">Please review and respond within 48 hours or the booking will be automatically cancelled.</p>
<table width="100%"><tr><td align="center" style="padding:20px 0">
<a href="https://helperr.co/provider-bookings" style="display:inline-block;background:linear-gradient(135deg,#14B8A6 0%,#0D9488 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px">View Booking Request</a>
</td></tr></table>
</td></tr>
<tr><td style="background-color:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb">
<p style="margin:0 0 10px;color:#6b7280;font-size:14px">Need help? Email <a href="mailto:support@helperr.co" style="color:#14B8A6">support@helperr.co</a></p>
<p style="margin:0;color:#9ca3af;font-size:12px">© 2025 Helperr</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`

const BOOKING_CANCELLED_NOTIFICATION_PROVIDER = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background-color:#f3f4f6">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);overflow:hidden">
<tr><td style="background:linear-gradient(135deg,#DC2626 0%,#991B1B 100%);padding:40px 30px;text-align:center">
<img src="https://helperr.co/logo.jpeg" alt="Helperr" style="height:60px;margin-bottom:15px">
<h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700">❌ Booking Cancelled</h1>
</td></tr>
<tr><td style="padding:40px 30px">
<p style="margin:0 0 20px;color:#374151;font-size:16px">Hi <strong>{{{provider_name}}}</strong>,</p>
<p style="margin:0 0 30px;color:#374151;font-size:16px"><strong>{{{customer_name}}}</strong> has cancelled their booking.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FEE2E2;border-radius:8px;padding:20px;margin-bottom:30px">
<tr><td>
<p style="margin:0 0 12px;color:#991B1B;font-size:14px;font-weight:600">CANCELLED BOOKING</p>
<p style="margin:0 0 10px;color:#111827;font-size:16px"><strong>Customer:</strong> {{{customer_name}}}</p>
<p style="margin:0 0 10px;color:#111827;font-size:16px"><strong>Date:</strong> {{{booking_date}}}</p>
<p style="margin:0;color:#111827;font-size:16px"><strong>Time:</strong> {{{time_slot}}}</p>
</td></tr></table>
<table width="100%"><tr><td align="center" style="padding:20px 0">
<a href="https://helperr.co/provider-bookings" style="display:inline-block;background:linear-gradient(135deg,#14B8A6 0%,#0D9488 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:16px">View My Bookings</a>
</td></tr></table>
</td></tr>
<tr><td style="background-color:#f9fafb;padding:30px;text-align:center;border-top:1px solid #e5e7eb">
<p style="margin:0 0 10px;color:#6b7280;font-size:14px">Need help? Email <a href="mailto:support@helperr.co" style="color:#14B8A6">support@helperr.co</a></p>
<p style="margin:0;color:#9ca3af;font-size:12px">© 2025 Helperr</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`

const CUSTOMER_CANCELLATION_CONFIRMATION = `<!DOCTYPE html>
<html><body style="margin:0;padding:0;font-family:sans-serif;background:#f3f4f6">
<table width="100%" style="padding:40px 20px"><tr><td align="center">
<table width="600" style="background:#fff;border-radius:12px">
<tr><td style="background:linear-gradient(135deg,#14B8A6,#0D9488);padding:40px 30px;text-align:center">
<img src="https://helperr.co/logo.jpeg" style="height:60px;margin-bottom:15px">
<h1 style="margin:0;color:#fff;font-size:28px">✓ Cancellation Confirmed</h1>
</td></tr>
<tr><td style="padding:40px 30px">
<p style="margin:0 0 20px">Hi <strong>{{{customer_name}}}</strong>,</p>
<p style="margin:0 0 30px">Your booking has been successfully cancelled.</p>
<table width="100%" style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:30px;border-left:4px solid #14B8A6">
<tr><td>
<p style="margin:0 0 10px"><strong>Provider:</strong> {{{provider_name}}}</p>
<p style="margin:0 0 10px"><strong>Date:</strong> {{{booking_date}}}</p>
<p style="margin:0"><strong>Time:</strong> {{{time_slot}}}</p>
</td></tr></table>
<table width="100%"><tr><td align="center" style="padding:20px 0">
<a href="https://helperr.co" style="display:inline-block;background:linear-gradient(135deg,#14B8A6,#0D9488);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600">Browse Providers</a>
</td></tr></table>
</td></tr>
</table>
</td></tr></table>
</body></html>`
