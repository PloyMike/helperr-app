const fs = require('fs');
let content = fs.readFileSync('src/BookingModal.jsx', 'utf8');

// Import hinzufügen
if (!content.includes('emailService')) {
  content = content.replace(
    /import { supabase } from '\.\/supabase';/,
    `import { supabase } from './supabase';\nimport { sendBookingNotification } from './emailService';`
  );
}

// Email senden nach erfolgreicher Buchung
content = content.replace(
  /setSuccess\(true\);/,
  `setSuccess(true);
      
      // Email an Provider senden
      await sendBookingNotification(newBooking, profile);`
);

fs.writeFileSync('src/BookingModal.jsx', content);
console.log('✅ Booking email integration added!');
