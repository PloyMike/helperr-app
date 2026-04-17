const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Remove all emojis from mobile menu items
content = content.replace(/🏠 Home/g, 'Home');
content = content.replace(/💬 Messages/g, 'Messages');
content = content.replace(/📅 My Bookings/g, 'My Bookings');
content = content.replace(/📊 Provider Bookings/g, 'Provider Bookings');
content = content.replace(/✏️ Edit Profile/g, 'Edit Profile');
content = content.replace(/⭐ Become a Provider/g, 'Become a Provider');
content = content.replace(/📊 Dashboard/g, 'Dashboard');
content = content.replace(/🚪 Logout/g, 'Logout');
content = content.replace(/🔑 Login/g, 'Login');
content = content.replace(/✨ Sign Up/g, 'Sign Up');

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ All emojis removed from mobile menu!');
