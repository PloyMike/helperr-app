const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// Add state for tracking which bookings have reviews
content = content.replace(
  /const \[submittingReview, setSubmittingReview\] = useState\(false\);/,
  `const [submittingReview, setSubmittingReview] = useState(false);
  const [bookingsWithReviews, setBookingsWithReviews] = useState([]);`
);

// Add function to check for existing reviews
content = content.replace(
  /const fetchBookings = useCallback\(async \(\) => \{/,
  `const checkExistingReviews = useCallback(async (bookingIds) => {
    try {
      const { data } = await supabase
        .from('reviews')
        .select('booking_id')
        .in('booking_id', bookingIds)
        .eq('author_email', user.email);
      
      setBookingsWithReviews(data?.map(r => r.booking_id) || []);
    } catch (error) {
      console.error('Error checking reviews:', error);
    }
  }, [user]);

  const fetchBookings = useCallback(async () => {`
);

// Call checkExistingReviews after fetching bookings
content = content.replace(
  /setBookings\(data \|\| \[\]\);/,
  `setBookings(data || []);
      
      // Check which bookings already have reviews
      const bookingIds = data?.map(b => b.id).filter(Boolean) || [];
      if (bookingIds.length > 0) {
        await checkExistingReviews(bookingIds);
      }`
);

// Update canReview function to check if review already exists
content = content.replace(
  /const canReview = \(booking\) => \{[\s\S]*?return bookingDate < today;[\s\S]*?\};/,
  `const canReview = (booking) => {
    if (viewMode !== 'customer') return false;
    if (booking.status !== 'confirmed') return false;
    if (bookingsWithReviews.includes(booking.id)) return false;
    
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return bookingDate < today;
  };`
);

// Add booking_id to review submission
content = content.replace(
  /const reviewData = \{[\s\S]*?profile_id: selectedBooking\.profile_id,/,
  `const reviewData = {
        booking_id: selectedBooking.id,
        profile_id: selectedBooking.profile_id,`
);

// Refresh bookings after review to update the list
content = content.replace(
  /alert\('✅ Review submitted successfully!'\);/,
  `alert('✅ Review submitted successfully!');
      fetchBookings(); // Refresh to hide the review button`
);

// Add checkExistingReviews to dependencies
content = content.replace(
  /\}, \[user, viewMode, userProfile\]\);/,
  `}, [user, viewMode, userProfile, checkExistingReviews]);`
);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ One review per booking protection added!');
