const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// Ersetze die fetchBookings Funktion mit besserem Error Handling
content = content.replace(
  /const fetchBookings = async \(\) => \{[\s\S]*?setLoading\(false\);[\s\S]*?\};/,
  `const fetchBookings = async () => {
    setLoading(true);
    try {
      // Check if user is a provider (might not have a profile)
      let providerProfile = null;
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle(); // Use maybeSingle instead of single to avoid 406 errors
      
      // Only set if no error and data exists
      if (!profileError && profileData) {
        providerProfile = profileData;
      }

      let bookingsQuery = supabase.from('bookings').select('*');
      
      // If user is a provider, show bookings for their profile
      // Otherwise show bookings made BY this user (customer)
      if (providerProfile) {
        console.log('Provider mode - showing bookings for profile:', providerProfile.id);
        bookingsQuery = bookingsQuery.eq('profile_id', providerProfile.id);
      } else {
        console.log('Customer mode - showing bookings by email:', user.email);
        bookingsQuery = bookingsQuery.eq('customer_email', user.email);
      }
      
      const { data: bookingsData, error: bookingsError } = await bookingsQuery
        .order('created_at', { ascending: false });
      
      if (bookingsError) throw bookingsError;

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;

      console.log('Loaded bookings:', bookingsData?.length || 0);
      setBookings(bookingsData || []);
      setProfiles(profilesData || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };`
);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ Fixed 406 error with maybeSingle!');
