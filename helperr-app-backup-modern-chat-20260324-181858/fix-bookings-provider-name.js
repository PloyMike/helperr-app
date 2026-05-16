const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// Ändere fetchBookings um Profile-Daten zu joinen
content = content.replace(
  /const \{ data, error \} = await supabase[\s\S]*?\.from\('bookings'\)[\s\S]*?\.select\('.*?'\)/,
  `const { data, error } = await supabase
        .from('bookings')
        .select(\`
          *,
          provider:profiles!bookings_profile_id_fkey(name, image_url, city, subcategory)
        \`)`
);

// Ändere die Anzeige von customer_name zu provider.name
content = content.replace(
  /<h3 style=\{styles\.bookingName\}>\{b\.customer_name\}<\/h3>/g,
  '<h3 style={styles.bookingName}>{b.provider?.name || "Provider"}</h3>'
);

// Ändere auch die Details - zeige Subcategory
content = content.replace(
  /<p style=\{styles\.bookingDetail\}>📅 \{new Date\(b\.booking_date\)\.toLocaleDateString\(\)\}<\/p>/,
  `<p style={styles.bookingDetail}>{b.provider?.subcategory || b.provider?.category || "Service"}</p>
                      <p style={styles.bookingDetail}>📅 {new Date(b.booking_date).toLocaleDateString()}</p>`
);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ Bookings now show provider name!');
