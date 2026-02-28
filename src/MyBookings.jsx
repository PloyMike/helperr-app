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
      setLoading(false);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (bookingsError) throw bookingsError;

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;

      setBookings(bookingsData || []);
      setProfiles(profilesData || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
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
      case 'cancelled': return 'Abgesagt';
      default: return status;
    }
  };

  const getTimeSlotLabel = (slot) => {
    switch(slot) {
      case 'morning': return 'Vormittag (09:00-12:00)';
      case 'afternoon': return 'Nachmittag (13:00-17:00)';
      case 'fullday': return 'Ganztag (09:00-17:00)';
      default: return slot;
    }
  };

  if (!user) {
    return (
      <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Header/>
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'90px 20px 40px'}}>
          <div style={{background:'white',padding:40,borderRadius:20,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',maxWidth:400,width:'100%',fontFamily:'"Outfit",sans-serif'}}>
            <h2 style={{fontSize:28,fontWeight:700,marginBottom:30,color:'#1F2937',textAlign:'center'}}>Login für Buchungen</h2>
            <form onSubmit={handleLogin}>
              <div style={{marginBottom:20}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:14,color:'#1F2937'}}>Email</label>
                <input type="email" required value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} placeholder="deine@email.com" style={{width:'100%',padding:'12px 16px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div style={{marginBottom:24}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:14,color:'#1F2937'}}>Passwort</label>
                <input type="password" required value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} placeholder="Passwort" style={{width:'100%',padding:'12px 16px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',boxSizing:'border-box'}}/>
              </div>
              <button type="submit" disabled={loginLoading} style={{width:'100%',padding:16,background:loginLoading?'#CBD5E0':'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:loginLoading?'not-allowed':'pointer'}}>
                {loginLoading ? 'Lädt...' : 'Einloggen'}
              </button>
              <p style={{textAlign:'center',marginTop:20,fontSize:14,color:'#6B7280'}}>Noch kein Account? <span onClick={()=>window.navigateTo('signup')} style={{color:'#14B8A6',fontWeight:600,cursor:'pointer',textDecoration:'underline'}}>Registrieren</span></p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchQuery || 
      booking.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer_email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading-screen">Lädt Buchungen...</div>;
  }

  return (
    <div className="bookings-container">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div className="bookings-wrapper">
        <div className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-gradient"></div>
          <div className="hero-content">
            <h1 className="hero-title">Meine Buchungen</h1>
            <p className="hero-subtitle">Verwalte alle deine Buchungen an einem Ort</p>
          </div>
        </div>

        <div className="bookings-content">
          
          <div className="filters-box">
            <div className="filters-grid">
              <div className="search-wrapper">
                <input
                  type="text"
                  placeholder="Suche nach Name oder Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="status-filters">
                {['all','pending','confirmed','cancelled'].map(status=>(
                  <button
                    key={status}
                    onClick={()=>setStatusFilter(status)}
                    className={`status-btn ${statusFilter===status?'active':''}`}
                  >
                    {status==='all'?'Alle':status==='pending'?'Ausstehend':status==='confirmed'?'Bestätigt':'Abgesagt'}
                  </button>
                ))}
              </div>
            </div>

            <div className="results-count">
              {filteredBookings.length} {filteredBookings.length===1?'Buchung':'Buchungen'} gefunden
            </div>
          </div>

          {filteredBookings.length===0?(
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h2>Keine Buchungen gefunden</h2>
              <p>Starte jetzt und buche deinen ersten Service!</p>
              <button onClick={()=>window.navigateTo('home')} className="browse-button">Profile durchsuchen</button>
            </div>
          ):(
            <div className="bookings-grid">
              {filteredBookings.map(booking=>{
                const profile=getProfile(booking.profile_id);
                return(
                  <div key={booking.id} className="booking-card">
                    
                    <div className="booking-header">
                      {profile.image_url?<img src={profile.image_url} alt={profile.name} className="profile-avatar"/>:<div className="profile-avatar-placeholder">{profile.name?profile.name.charAt(0).toUpperCase():'?'}</div>}
                      <div className="profile-info">
                        <h3 className="profile-name">{profile.name||'Unbekannt'}</h3>
                        <p className="profile-job">{profile.job||'Keine Angabe'}</p>
                      </div>
                      <span className="status-badge" style={{backgroundColor:getStatusColor(booking.status)}}>{getStatusText(booking.status)}</span>
                    </div>

                    <div className="booking-details">
                      <div className="detail-group">
                        <div className="detail-label">Kunde</div>
                        <div className="detail-value">{booking.customer_name}</div>
                        <div className="detail-subvalue">{booking.customer_email}</div>
                        {booking.customer_phone&&<div className="detail-subvalue">{booking.customer_phone}</div>}
                      </div>

                      <div className="detail-group">
                        <div className="detail-label">Datum & Zeit</div>
                        <div className="detail-value">📅 {new Date(booking.booking_date).toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</div>
                        <div className="detail-subvalue">⏰ {getTimeSlotLabel(booking.time_slot)}</div>
                      </div>

                      <div className="detail-group">
                        <div className="detail-label">Preis</div>
                        <div className="price-value">{booking.total_price||profile.price||'Auf Anfrage'}</div>
                      </div>

                      {booking.message&&<div className="detail-group">
                        <div className="detail-label">Nachricht</div>
                        <div className="message-text">{booking.message}</div>
                      </div>}

                      <div className="detail-group">
                        <div className="detail-label">Buchungs-ID</div>
                        <div className="booking-id">{booking.id.substring(0,8)}</div>
                      </div>
                    </div>

                    <button onClick={()=>window.navigateTo('profile',profile)} className="view-profile-btn">
                      Profil ansehen
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer/>

      <style>{`
        .bookings-container {
          min-height: 100vh;
          background-color: #F9FAFB;
        }
        .loading-screen {
          min-height: 100vh;
          display: flex;
          alignItems: center;
          justify-content: center;
          background-color: #F9FAFB;
          font-family: "Outfit", sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #14B8A6;
        }
        .bookings-wrapper {
          padding-top: 70px;
        }
        .hero-section {
          position: relative;
          overflow: hidden;
          padding: 60px 20px;
        }
        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80);
          background-size: cover;
          background-position: center;
          opacity: 0.7;
          z-index: 0;
        }
        .hero-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(250,250,250,0.9) 100%);
          z-index: 1;
        }
        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          color: #1F2937;
          text-align: center;
        }
        .hero-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 12px;
          font-family: "Outfit", sans-serif;
          letter-spacing: -1px;
        }
        .hero-subtitle {
          font-size: 18px;
          opacity: 0.95;
          font-family: "Outfit", sans-serif;
          font-weight: 400;
        }
        .bookings-content {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }
        .filters-box {
          background-color: white;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        .search-input {
          width: 100%;
          padding: 14px 20px;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
          box-sizing: border-box;
        }
        .search-input:focus {
          border-color: #14B8A6;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
        }
        .status-filters {
          display: flex;
          gap: 12px;
        }
        .status-btn {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background-color: #F3F4F6;
          color: #6B7280;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
        }
        .status-btn.active {
          background-color: #14B8A6;
          color: white;
        }
        .results-count {
          font-size: 16px;
          font-weight: 600;
          color: #6B7280;
          font-family: "Outfit", sans-serif;
        }
        .empty-state {
          text-align: center;
          padding: 80px;
          background-color: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        .empty-state h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .empty-state p {
          font-size: 16px;
          color: #6B7280;
          margin-bottom: 32px;
          font-family: "Outfit", sans-serif;
        }
        .browse-button {
          padding: 16px 32px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          box-shadow: 0 4px 15px rgba(20,184,166,0.3);
        }
        .browse-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(20,184,166,0.4);
        }
        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }
        .booking-card {
          background-color: white;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s;
        }
        .booking-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(0,0,0,0.12);
        }
        .booking-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }
        .profile-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #14B8A6;
          flex-shrink: 0;
        }
        .profile-avatar-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          color: white;
          font-family: "Outfit", sans-serif;
          flex-shrink: 0;
        }
        .profile-info {
          flex: 1;
          min-width: 0;
        }
        .profile-name {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
          margin: 0 0 4px 0;
        }
        .profile-job {
          font-size: 14px;
          color: #6B7280;
          font-family: "Outfit", sans-serif;
          margin: 0;
        }
        .status-badge {
          padding: 6px 14px;
          color: white;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          font-family: "Outfit", sans-serif;
          flex-shrink: 0;
        }
        .booking-details {
          border-top: 1px solid #F3F4F6;
          padding-top: 20px;
          margin-bottom: 20px;
        }
        .detail-group {
          margin-bottom: 12px;
        }
        .detail-label {
          font-size: 13px;
          color: #9CA3AF;
          margin-bottom: 4px;
          font-family: "Outfit", sans-serif;
          font-weight: 500;
        }
        .detail-value {
          font-size: 15px;
          font-weight: 600;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .detail-subvalue {
          font-size: 14px;
          color: #6B7280;
          font-family: "Outfit", sans-serif;
        }
        .price-value {
          font-size: 18px;
          font-weight: 800;
          color: #F97316;
          font-family: "Outfit", sans-serif;
        }
        .message-text {
          font-size: 14px;
          color: #4B5563;
          line-height: 1.6;
          font-family: "Outfit", sans-serif;
        }
        .booking-id {
          font-size: 12px;
          font-family: monospace;
          color: #6B7280;
          background-color: #F9FAFB;
          padding: 6px 10px;
          border-radius: 8px;
          display: inline-block;
        }
        .view-profile-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          box-shadow: 0 4px 12px rgba(20,184,166,0.3);
          transition: all 0.3s;
        }
        .view-profile-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(20,184,166,0.4);
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 16px !important;
          }
          .hero-title {
            font-size: 28px !important;
            margin-bottom: 8px !important;
          }
          .hero-subtitle {
            font-size: 15px !important;
          }
          .bookings-content {
            margin: 24px auto !important;
            padding: 0 16px !important;
          }
          .filters-box {
            padding: 20px !important;
            margin-bottom: 24px !important;
          }
          .filters-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .status-filters {
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
          .status-btn {
            padding: 10px !important;
            font-size: 13px !important;
            flex: 1 1 calc(50% - 4px) !important;
          }
          .results-count {
            font-size: 14px !important;
          }
          .empty-state {
            padding: 60px 20px !important;
          }
          .empty-icon {
            font-size: 48px !important;
          }
          .empty-state h2 {
            font-size: 20px !important;
          }
          .empty-state p {
            font-size: 14px !important;
            margin-bottom: 24px !important;
          }
          .browse-button {
            padding: 14px 24px !important;
            font-size: 14px !important;
          }
          .bookings-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .booking-card {
            padding: 20px !important;
          }
          .booking-header {
            gap: 12px !important;
            margin-bottom: 16px !important;
          }
          .profile-avatar, .profile-avatar-placeholder {
            width: 50px !important;
            height: 50px !important;
            font-size: 20px !important;
            border-width: 2px !important;
          }
          .profile-name {
            font-size: 16px !important;
          }
          .profile-job {
            font-size: 13px !important;
          }
          .status-badge {
            padding: 4px 10px !important;
            font-size: 11px !important;
          }
          .booking-details {
            padding-top: 16px !important;
            margin-bottom: 16px !important;
          }
          .detail-group {
            margin-bottom: 10px !important;
          }
          .detail-label {
            font-size: 12px !important;
          }
          .detail-value {
            font-size: 14px !important;
          }
          .detail-subvalue {
            font-size: 13px !important;
          }
          .price-value {
            font-size: 16px !important;
          }
          .message-text {
            font-size: 13px !important;
          }
          .booking-id {
            font-size: 11px !important;
          }
          .view-profile-btn {
            padding: 12px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default MyBookings;
