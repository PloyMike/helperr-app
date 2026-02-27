const fs = require('fs');
let content = fs.readFileSync('src/App.js', 'utf8');

// Add import
if (!content.includes("import AdminDashboard")) {
  content = content.replace(
    "import MyBookings from './MyBookings';",
    "import MyBookings from './MyBookings';\nimport AdminDashboard from './AdminDashboard';"
  );
}

// Add route before bookings
const bookingsRoute = /if \(page === 'bookings'\) \{[\s\S]*?return <MyBookings \/>;[\s\S]*?\}/;

const adminRoute = `// Admin page
  if (page === 'admin') {
    return <AdminDashboard />;
  }

  $&`;

if (content.match(bookingsRoute)) {
  content = content.replace(bookingsRoute, adminRoute);
  fs.writeFileSync('src/App.js', content);
  console.log('✅ AdminDashboard route added to App.js!');
} else {
  console.log('❌ Could not find bookings route');
}
