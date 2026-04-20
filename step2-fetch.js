const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

const afterCheckUser = /(const checkUser = async \(\) => \{[\s\S]*?\n  \};)/;

content = content.replace(afterCheckUser, `$1

  const fetchBookingCounts = async () => {
    if (!user || !profile) return;

    try {
      const { count: myCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('customer_email', user.email)
        .eq('status', 'pending');
      
      setMyBookingsBadge(myCount || 0);

      if (hasProviderProfile && profile.id) {
        const { count: providerCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', profile.id)
          .eq('status', 'pending');
        
        setProviderBookingsBadge(providerCount || 0);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };`);

content = content.replace(
  /(const fetchBookingCounts[\s\S]*?\n  \};)/,
  `$1

  useEffect(() => {
    if (user && profile) {
      fetchBookingCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile, hasProviderProfile]);`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Step 2 done');
