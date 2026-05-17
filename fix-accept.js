const fs = require('fs');
const file = 'src/ProviderBookingsPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Finde handleAccept und füge Logs hinzu
content = content.replace(
  /const handleAccept = async \(bookingId\) => {/,
  `const handleAccept = async (bookingId) => {
    console.log('🔵 ACCEPT CLICKED - Booking ID:', bookingId);`
);

content = content.replace(
  /if \(error\) throw error;[\s\S]*?const { data: { session } }/,
  `if (error) throw error;

      console.log('✅ DATABASE UPDATED');
      
      const { data: { session } }`
);

content = content.replace(
  /alert\('Booking confirmed!'\);[\s\S]*?fetchBookings\(\);/,
  `console.log('📧 EMAIL SENT');
      alert('Booking confirmed!');
      console.log('🔄 CALLING FETCHBOOKINGS...');
      await fetchBookings();
      console.log('✅ FETCHBOOKINGS COMPLETED');`
);

fs.writeFileSync(file, content);
console.log('✅ Debug logs added!');
