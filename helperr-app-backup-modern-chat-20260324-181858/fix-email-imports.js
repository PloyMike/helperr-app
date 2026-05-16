const fs = require('fs');

// Fix ChatModal.jsx
let chatContent = fs.readFileSync('src/ChatModal.jsx', 'utf8');
chatContent = chatContent.replace(/import \{ sendMessageNotification \} from '\.\/emailService';\n?/g, '');
fs.writeFileSync('src/ChatModal.jsx', chatContent);

// Fix BookingModal.jsx
let bookingContent = fs.readFileSync('src/BookingModal.jsx', 'utf8');
bookingContent = bookingContent.replace(/import \{ sendBookingNotification \} from '\.\/emailService';\n?/g, '');
bookingContent = bookingContent.replace(/await sendBookingNotification\(newBooking, profile\);\n?\s*/g, '');
fs.writeFileSync('src/BookingModal.jsx', bookingContent);

console.log('✅ Email imports removed!');
