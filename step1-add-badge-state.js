const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add state for badge counts after hasProviderProfile
const oldState = /const \[hasProviderProfile, setHasProviderProfile\] = useState\(false\);/;
const newState = `const [hasProviderProfile, setHasProviderProfile] = useState(false);
  const [myBookingsBadge, setMyBookingsBadge] = useState(0);
  const [providerBookingsBadge, setProviderBookingsBadge] = useState(0);`;

content = content.replace(oldState, newState);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 1: Badge state added!');
