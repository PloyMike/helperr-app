const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Add fetchBookingCounts function after checkUser function
const afterCheckUser = /(const checkUser = async \(\) => \{[\s\S]*?\n  \};)/;

const newFunction = `$1

  const fetchBookingCounts = async () => {
    if (!user || !profile) return;

    // Count MY bookings (as customer) - pending only
    const { count: myCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('customer_email', user.email)
      .eq('status', 'pending');
    
    setMyBookingsBadge(myCount || 0);

    // Count PROVIDER bookings - pending only
    if (hasProviderProfile && profile.id) {
      const { count: providerCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id)
        .eq('status', 'pending');
      
      setProviderBookingsBadge(providerCount || 0);
    }
  };`;

content = content.replace(afterCheckUser, newFunction);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 2: Count function added!');
