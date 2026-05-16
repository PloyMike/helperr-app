const fs = require('fs');
let content = fs.readFileSync('src/MyBookings.jsx', 'utf8');

// fetchBookings erweitern - Provider-Profil prüfen
content = content.replace(
  /(const fetchBookings = async \(\) => \{\s*try \{)/,
  `$1
      // Check if user is a provider
      let providerProfile = null;
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .single();
        providerProfile = profileData;
      }`
);

// Bookings Filter - nur eigene wenn Provider
content = content.replace(
  /(const \{ data: bookingsData, error: bookingsError \} = await supabase[\s\S]*?\.from\('bookings'\)[\s\S]*?\.select\('\*'\))/,
  `let bookingsQuery = supabase.from('bookings').select('*');
      
      // If user is a provider, only show bookings for their profile
      if (providerProfile) {
        bookingsQuery = bookingsQuery.eq('profile_id', providerProfile.id);
      }
      
      const { data: bookingsData, error: bookingsError } = await bookingsQuery`
);

// Update Status Funktion hinzufügen - nach fetchBookings
content = content.replace(
  /(const fetchBookings = async[\s\S]*?\};)/,
  `$1

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      alert(\`✅ Buchung \${newStatus === 'confirmed' ? 'bestätigt' : 'abgelehnt'}!\`);
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Fehler beim Aktualisieren');
    }
  };`
);

// Annehmen/Ablehnen Buttons in der Booking Card hinzufügen - vor "Profil ansehen"
content = content.replace(
  /(<button onClick=\{\(\)=>window\.navigateTo\('profile',profile\)\} className="view-profile-btn">[\s\S]*?Profil ansehen[\s\S]*?<\/button>)/,
  `{booking.status === 'pending' && (
                      <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}>
                        <button onClick={(e)=>{e.stopPropagation();updateBookingStatus(booking.id,'confirmed');}} style={{flex:1,padding:12,background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif'}}>
                          ✅ Annehmen
                        </button>
                        <button onClick={(e)=>{e.stopPropagation();updateBookingStatus(booking.id,'cancelled');}} style={{flex:1,padding:12,background:'#EF4444',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif'}}>
                          ❌ Ablehnen
                        </button>
                      </div>
                    )}

                    $1`
);

fs.writeFileSync('src/MyBookings.jsx', content);
console.log('✅ MyBookings extended with provider functions!');
