const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

content = content.replace(
  "const [hasProviderProfile, setHasProviderProfile] = useState(false);",
  `const [hasProviderProfile, setHasProviderProfile] = useState(false);
  const [myBookingsBadge, setMyBookingsBadge] = useState(0);
  const [providerBookingsBadge, setProviderBookingsBadge] = useState(0);`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 1 done');
