import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';
import Footer from './Footer';

function MyBookings() {
  const { user, signIn } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      // WICHTIG: State clearen wenn kein User
      setBookings([]);
      setProfiles([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchBookings = async () => {
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
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      alert(`✅ Buchung ${newStatus === 'confirmed' ? 'bestätigt' : 'abgelehnt'}!`);
      fetchBookings();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Fehler beim Aktualisieren');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    if (error) {
      alert('Login fehlgeschlagen: ' + error.message);
    }
    setLoginLoading(false);
  };

  const getProfile = (profileId) => {
    return profiles.find(p => p.id === profileId) || {};
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return '#14B8A6';
      case 'pending': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'confirmed': return 'Bestätigt';
      case 'pending': return 'Ausstehend';
      case 'cancelled': return 'Abgelehnt';
      default: return status;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const profile = getProfile(booking.profile_id);
    const matchesSearch = !searchQuery || 
      booking.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="bookings-container">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Header/>
        <div className="login-prompt">
          <div className="login-card">
            <h2 style={{fontSize:28,fontWeight:700,marginBottom:30,color:'#1F2937',textAlign:'center'}}>Login für Buchungen</h2>
            <form onSubmit={handleLogin}>
              <div style={{marginBottom:20}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:14,color:'#374151'}}>Email</label>
                <input required type="email" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} style={{width:'100%',padding:'12px 16px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div style={{marginBottom:24}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:14,color:'#374151'}}>Passwort</label>
                <input required type="password" value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} style={{width:'100%',padding:'12px 16px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <button type="submit" disabled={loginLoading} style={{width:'100%',padding:16,background:loginLoading?'#CBD5E0':'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:loginLoading?'not-allowed':'pointer'}}>
                {loginLoading?'Lädt...':'Einloggen'}
              </button>
            </form>
            <p style={{marginTop:20,textAlign:'center',fontSize:14,color:'#6B7280'}}>
              Noch kein Account? <button onClick={()=>window.navigateTo('signup')} style={{background:'none',border:'none',color:'#14B8A6',fontWeight:600,cursor:'pointer',textDecoration:'underline'}}>Registrieren</button>
            </p>
          </div>
        </div>
        <Footer/>
        <style>{`
          .bookings-container{min-height:100vh;background-color:#F9FAFB;font-family:"Outfit",sans-serif}
          .login-prompt{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:90px 20px 40px}
          .login-card{background:white;padding:40px;border-radius:20px;box-shadow:0 8px 30px rgba(0,0,0,0.1);max-width:400px;width:100%}
        `}</style>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-screen">Lädt Buchungen...</div>;
  }

  return (
    <div className="bookings-container">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Meine Buchungen</h1>
          <p className="hero-subtitle">Verwalte alle deine Buchungen an einem Ort</p>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="filters-bar">
          <input type="text" placeholder="Suche nach Name..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="search-input"/>
          <div className="status-filters">
            {['all','pending','confirmed','cancelled'].map(status=>(
              <button key={status} onClick={()=>setStatusFilter(status)} className={`filter-btn ${statusFilter===status?'active':''}`}>
                {status==='all'?'Alle':status==='pending'?'Ausstehend':status==='confirmed'?'Bestätigt':'Abgelehnt'}
              </button>
            ))}
          </div>
        </div>

        <div className="results-count">
          {filteredBookings.length} {filteredBookings.length===1?'Buchung':'Buchungen'} gefunden
        </div>

        {filteredBookings.length===0?(
          <div className="no-bookings">
            <h2>Keine Buchungen gefunden</h2>
            <p>Du hast noch keine Buchungen.</p>
          </div>
        ):(
          <div className="bookings-grid">
            {filteredBookings.map(booking=>{
              const profile=getProfile(booking.profile_id);
              return(
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div>
                      <h3 className="booking-name">{booking.customer_name}</h3>
                      <p className="booking-email">{booking.customer_email}</p>
                    </div>
                    <span className="status-badge" style={{backgroundColor:getStatusColor(booking.status)}}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="icon">👤</span>
                      <span className="text">Provider: {profile.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="icon">📅</span>
                      <span className="text">{new Date(booking.booking_date).toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</span>
                    </div>
                    <div className="detail-row">
                      <span className="icon">⏰</span>
                      <span className="text">{booking.time_slot==='morning'?'Vormittag (09:00-12:00)':booking.time_slot==='afternoon'?'Nachmittag (13:00-17:00)':'Ganztag (09:00-17:00)'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="icon">💰</span>
                      <span className="text price">{booking.total_price||profile.price}</span>
                    </div>
                    {booking.message&&(
                      <div className="message-box">
                        <strong>💬 Nachricht:</strong>
                        <p>{booking.message}</p>
                      </div>
                    )}
                  </div>

                  {booking.status === 'pending' && (
                    <div style={{display:'flex',gap:12,marginTop:16,flexWrap:'wrap'}}>
                      <button onClick={(e)=>{e.stopPropagation();updateBookingStatus(booking.id,'confirmed');}} style={{flex:1,padding:12,background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif'}}>
                        ✅ Annehmen
                      </button>
                      <button onClick={(e)=>{e.stopPropagation();updateBookingStatus(booking.id,'cancelled');}} style={{flex:1,padding:12,background:'#EF4444',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif'}}>
                        ❌ Ablehnen
                      </button>
                    </div>
                  )}

                  <button onClick={()=>window.navigateTo('profile',profile)} className="view-profile-btn">
                    Profil ansehen
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer/>

      <style>{`
        .bookings-container{min-height:100vh;background-color:#F9FAFB;font-family:"Outfit",sans-serif}
        .loading-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600;color:#14B8A6}
        .hero-section{position:relative;overflow:hidden;padding:100px 20px 60px;background:linear-gradient(135deg,rgba(20,184,166,0.1) 0%,rgba(13,148,136,0.1) 100%);text-align:center}
        .hero-title{font-size:48px;font-weight:800;color:#1F2937;margin-bottom:12px;letter-spacing:-1px}
        .hero-subtitle{font-size:18px;color:#6B7280}
        .content-wrapper{max-width:1200px;margin:40px auto;padding:0 20px}
        .filters-bar{background:white;padding:20px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.08);margin-bottom:24px;display:flex;gap:20px;flex-wrap:wrap;align-items:center}
        .search-input{flex:1;min-width:200px;padding:12px 18px;border:1px solid #E5E7EB;border-radius:12px;font-size:15px;outline:none}
        .search-input:focus{border-color:#14B8A6;box-shadow:0 0 0 3px rgba(20,184,166,0.1)}
        .status-filters{display:flex;gap:12px;flex-wrap:wrap}
        .filter-btn{padding:10px 20px;background:#F3F4F6;color:#374151;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s}
        .filter-btn:hover{background:#E5E7EB}
        .filter-btn.active{background:linear-gradient(135deg,#14B8A6 0%,#0D9488 100%);color:white}
        .results-count{margin-bottom:24px;font-size:16px;font-weight:600;color:#6B7280}
        .no-bookings{background:white;padding:60px 20px;border-radius:20px;box-shadow:0 4px 20px rgba(0,0,0,0.08);text-align:center}
        .no-bookings h2{font-size:24px;font-weight:700;color:#1F2937;margin-bottom:12px}
        .no-bookings p{font-size:16px;color:#6B7280}
        .bookings-grid{display:grid;gap:24px}
        .booking-card{background:white;padding:28px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.08);transition:all 0.3s}
        .booking-card:hover{transform:translateY(-4px);box-shadow:0 8px 30px rgba(0,0,0,0.12)}
        .booking-header{display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;gap:16px;flex-wrap:wrap}
        .booking-name{font-size:20px;font-weight:700;color:#1F2937;margin-bottom:4px}
        .booking-email{font-size:14px;color:#6B7280}
        .status-badge{padding:8px 16px;border-radius:12px;color:white;font-size:13px;font-weight:700;white-space:nowrap}
        .booking-details{margin-bottom:20px}
        .detail-row{display:flex;align-items:center;gap:12px;margin-bottom:12px}
        .icon{font-size:18px}
        .text{font-size:15px;color:#374151}
        .text.price{font-weight:700;color:#F97316;font-size:16px}
        .message-box{margin-top:16px;padding:16px;background:#FEF3C7;border-radius:12px;border-left:4px solid #F59E0B}
        .message-box p{margin-top:8px;font-size:14px;color:#374151}
        .view-profile-btn{width:100%;padding:14px;background:#F3F4F6;color:#374151;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.2s;margin-top:16px}
        .view-profile-btn:hover{background:#E5E7EB}
        @media (max-width:768px){
          .hero-title{font-size:28px}
          .hero-subtitle{font-size:15px}
          .filters-bar{flex-direction:column;align-items:stretch}
          .search-input{width:100%}
          .status-filters{justify-content:center}
        }
      `}</style>
    </div>
  );
}

export default MyBookings;
