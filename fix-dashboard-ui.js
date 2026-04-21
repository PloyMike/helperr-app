const fs = require('fs');
let content = fs.readFileSync('src/ProviderDashboard.jsx', 'utf8');

// Remove emoji from welcome message
content = content.replace(
  /Welcome back, \{profile\.name\}! 👋/,
  'Welcome back, {profile.name}!'
);

fs.writeFileSync('src/ProviderDashboard.jsx', content);
console.log('✅ Step 1: Emoji removed');
