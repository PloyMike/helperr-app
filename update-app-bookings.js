const fs = require('fs');
let content = fs.readFileSync('src/App.js', 'utf8');

// Add import
if (!content.includes("import MyBookings")) {
  content = content.replace(
    "import Favorites from './Favorites';",
    "import Favorites from './Favorites';\nimport MyBookings from './MyBookings';"
  );
}

// Add route before favorites
const favoritesRoute = /if \(page === 'favorites'\) \{[\s\S]*?return <Favorites \/>;[\s\S]*?\}/;

const bookingsRoute = `// Bookings page
  if (page === 'bookings') {
    return <MyBookings />;
  }

  $&`;

if (content.match(favoritesRoute)) {
  content = content.replace(favoritesRoute, bookingsRoute);
  fs.writeFileSync('src/App.js', content);
  console.log('✅ MyBookings route added to App.js!');
} else {
  console.log('❌ Could not find favorites route');
}
