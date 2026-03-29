const fs = require('fs');
let content = fs.readFileSync('src/App.js', 'utf8');

// Add import
content = content.replace(
  /import MyBookings from '.\/MyBookings';/,
  `import MyBookings from './MyBookings';
import ProviderBookingsPage from './ProviderBookingsPage';`
);

// Add route
content = content.replace(
  /\) : currentView === 'bookings' \? \(/,
  `) : currentView === 'bookings' ? (
          <MyBookings />
        ) : currentView === 'provider-bookings' ? (`
);

// Fix the closing
content = content.replace(
  /<MyBookings \/>\s+\) : currentView === 'provider-bookings'/,
  `<MyBookings />
        ) : currentView === 'provider-bookings' ? (
          <ProviderBookingsPage />`
);

fs.writeFileSync('src/App.js', content);
console.log('✅ Provider Bookings route added!');
