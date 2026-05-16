const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// Finde und ersetze die Bookings Query Logic
content = content.replace(
  /let bookingsQuery = supabase\.from\('bookings'\)\.select\('\*'\);[\s\S]*?\/\/ If user is a provider, only show bookings for their profile[\s\S]*?if \(providerProfile\) \{[\s\S]*?bookingsQuery = bookingsQuery\.eq\('profile_id', providerProfile\.id\);[\s\S]*?\}[\s\S]*?const \{ data: bookingsData, error: bookingsError \} = await bookingsQuery/,
  `let bookingsQuery = supabase.from('bookings').select('*');
      
      // If user is a provider, show bookings for their profile
      // Otherwise show bookings made BY this user (customer)
      if (providerProfile) {
        bookingsQuery = bookingsQuery.eq('profile_id', providerProfile.id);
      } else {
        bookingsQuery = bookingsQuery.eq('customer_email', user.email);
      }
      
      const { data: bookingsData, error: bookingsError } = await bookingsQuery`
);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ MyBookings fixed - users only see their own bookings!');
