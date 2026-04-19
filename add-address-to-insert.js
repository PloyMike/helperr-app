const fs = require('fs');
let content = fs.readFileSync('src/BookingCalendar.jsx', 'utf8');

// Find the insert statement and add address fields
const oldInsert = /const \{ error \} = await supabase\.from\('bookings'\)\.insert\(\[\{\s*profile_id: profile\.id,\s*customer_name: customerName,\s*customer_email: user\.email,\s*customer_phone: '',\s*booking_date: selectedDate,\s*time_slot: selectedTimeSlot,\s*message: message,\s*total_price: profile\.price,\s*status: 'pending'/;

const newInsert = `const { error } = await supabase.from('bookings').insert([{
        profile_id: profile.id,
        customer_name: customerName,
        customer_email: user.email,
        customer_phone: '',
        booking_date: selectedDate,
        time_slot: selectedTimeSlot,
        service_address: \`\${address.street} \${address.houseNumber}, \${address.postalCode} \${address.city}\`,
        address_notes: address.notes,
        message: message,
        total_price: profile.price,
        status: 'pending'`;

content = content.replace(oldInsert, newInsert);

fs.writeFileSync('src/BookingCalendar.jsx', content);
console.log('✅ Step 1: Address fields added to booking insert!');
