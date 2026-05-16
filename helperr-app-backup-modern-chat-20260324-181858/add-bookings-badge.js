const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Neuen State für pending bookings hinzufügen
content = content.replace(
  /const \[unreadCount, setUnreadCount\] = useState\(0\);/,
  `const [unreadCount, setUnreadCount] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);`
);

// Funktion zum Fetchen von pending bookings hinzufügen - nach fetchUnreadCount
content = content.replace(
  /(fetchUnreadCount\(\);[\s\S]*?const msgInterval = setInterval\(fetchUnreadCount, 5000\);)/,
  `$1

    const fetchPendingBookings = async () => {
      if (user) {
        // Check if user is a provider
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user.email)
          .single();

        if (profileData) {
          // Count pending bookings for this provider
          const { data: bookingsData } = await supabase
            .from('bookings')
            .select('id', { count: 'exact' })
            .eq('profile_id', profileData.id)
            .eq('status', 'pending');
          
          setPendingBookings(bookingsData?.length || 0);
        } else {
          setPendingBookings(0);
        }
      } else {
        setPendingBookings(0);
      }
    };
    fetchPendingBookings();
    const bookingsInterval = setInterval(fetchPendingBookings, 5000);`
);

// Cleanup interval hinzufügen
content = content.replace(
  /(clearInterval\(msgInterval\);)/,
  `$1
      clearInterval(bookingsInterval);`
);

// Badge zu Desktop Buchungen Button hinzufügen
content = content.replace(
  /(\{user&&<button onClick=\{\(\)=>window\.navigateTo\('bookings'\)\} style=\{\{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0\.2s'\}\}[^>]*>[\s\S]*?Buchungen[\s\S]*?<\/button>\})/,
  `{user&&<button onClick={()=>window.navigateTo('bookings')} style={{position:'relative',background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Buchungen
            {pendingBookings>0&&<span style={{position:'absolute',top:-8,right:-12,background:'#F97316',color:'white',fontSize:11,fontWeight:700,padding:'2px 6px',borderRadius:10,minWidth:18,textAlign:'center'}}>{pendingBookings}</span>}
          </button>}`
);

// Badge zu Mobile Buchungen Button hinzufügen
content = content.replace(
  /(\{user&&<button onClick=\{\(\)=>\{window\.navigateTo\('bookings'\);setMobileMenuOpen\(false\);\}\} style=\{\{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba\(255,255,255,0\.1\)'\}\}>[\s\S]*?Buchungen[\s\S]*?<\/button>\})/,
  `{user&&<button onClick={()=>{window.navigateTo('bookings');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)',position:'relative'}}>
              Buchungen
              {pendingBookings>0&&<span style={{position:'absolute',right:20,top:'50%',transform:'translateY(-50%)',background:'#F97316',color:'white',fontSize:11,fontWeight:700,padding:'4px 8px',borderRadius:10}}>{pendingBookings}</span>}
            </button>}`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Bookings badge added to header!');
