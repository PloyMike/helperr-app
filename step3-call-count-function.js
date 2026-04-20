const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add useEffect to call fetchBookingCounts when user/profile changes
const afterFetchFunction = /(const fetchBookingCounts[\s\S]*?\n  \};)/;

const newUseEffect = `$1

  useEffect(() => {
    if (user && profile) {
      fetchBookingCounts();
    }
  }, [user, profile, hasProviderProfile]);`;

content = content.replace(afterFetchFunction, newUseEffect);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 3: useEffect added to call count function!');
