const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Replace StripePayment import with PaymentSelection
content = content.replace(
  "import StripePayment from './StripePayment';",
  "import PaymentSelection from './PaymentSelection';"
);

// Replace StripePayment component with PaymentSelection
content = content.replace(
  /<StripePayment/g,
  '<PaymentSelection'
);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ BookingCalendar updated with PaymentSelection!');
