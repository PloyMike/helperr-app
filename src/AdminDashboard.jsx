import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Header from './Header';
import Footer from './Footer';

const ADMIN_PASSWORD = 'helperr2026';

function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('stats');
  const [profiles, setProfiles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated]);

  const fetchData = async () => {
    try {
      const [profilesData, bookingsData, reviewsData] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('bookings').select('*'),
        supabase.from('reviews').select('*')
      ]);
      setProfiles(profilesData.data || []);
      setBookings(bookingsData.data || []);
      setReviews(reviewsData.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Falsches Passwort!');
    }
  };

  const deleteProfile = async (id) => {
    if (!window.confirm('Profil wirklich löschen?')) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      alert('Profil gelöscht!');
      fetchData();
    } catch (error) {
      alert('Fehler: ' + error.message);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      alert('Fehler: ' + error.message);
    }
  };

  if (!authenticated) {
    return (
      <div className="login-screen">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <form onSubmit={handleLogin} className="login-form">
          <h1 className="login-title">Admin Login</h1>
          <input type="password" placeholder="Passwort" value={password} onChange={(e)=>setPassword(e.target.value)} className="login-input"/>
          <button type="submit" className="login-button">Login</button>
        </form>

        <style>{`
          .login-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
            padding: 20px;
          }
          .login-form {
            background-color: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.2);
            max-width: 400px;
            width: 100%;
          }
          .login-title {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 24px;
            text-align: center;
            color: #1F2937;
            font-family: "Outfit", sans-serif;
          }
          .login-input {
            width: 100%;
            padding: 16px 20px;
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            font-size: 16px;
            margin-bottom: 20px;
            outline: none;
            font-family: "Outfit", sans-serif;
            box-sizing: border-box;
          }
          .login-button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            font-family: "Outfit", sans-serif;
          }

          @media (max-width: 768px) {
            .login-form {
              padding: 28px !important;
            }
            .login-title {
              font-size: 26px !important;
            }
            .login-input {
              padding: 14px 16px !important;
              font-size: 14px !important;
            }
            .login-button {
              padding: 14px !important;
              font-size: 14px !important;
            }
          }
        `}</style>
      </div>
    );
  }

  const stats = {
    totalProfiles: profiles.length,
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    totalReviews: reviews.length,
    totalViews: profiles.reduce((sum, p) => sum + (p.view_count || 0), 0)
  };

  const statsData = [
    {label:'Profile Gesamt',value:stats.totalProfiles,color:'#14B8A6'},
    {label:'Buchungen Gesamt',value:stats.totalBookings,color:'#F97316'},
    {label:'Ausstehend',value:stats.pendingBookings,color:'#F59E0B'},
    {label:'Bestätigt',value:stats.confirmedBookings,color:'#10B981'},
    {label:'Bewertungen',value:stats.totalReviews,color:'#8B5CF6'},
    {label:'Profilaufrufe',value:stats.totalViews,color:'#06B6D4'}
  ];

  return (
    <div className="admin-container">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div className="admin-wrapper">
        <div className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-gradient"></div>
          <div className="hero-content">
            <h1 className="hero-title">Admin Dashboard</h1>
            <p className="hero-subtitle">Verwaltung & Statistiken</p>
          </div>
        </div>

        <div className="admin-content">
          
          <div className="tabs-container">
            {['stats','profiles','bookings'].map(tab=>(
              <button key={tab} onClick={()=>setActiveTab(tab)} className={`tab-btn ${activeTab===tab?'active':''}`}>
                {tab==='stats'?'Statistiken':tab==='profiles'?'Profile':'Buchungen'}
              </button>
            ))}
          </div>

          {activeTab === 'stats' && (
            <div className="stats-grid">
              {statsData.map((stat,i)=>(
                <div key={i} className="stat-card">
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value" style={{color:stat.color}}>{stat.value}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'profiles' && (
            <div className="content-box">
              <h2 className="section-title">Profile verwalten</h2>
              <div className="items-list">
                {profiles.map(profile=>(
                  <div key={profile.id} className="profile-item">
                    {profile.image_url?
                      <img src={profile.image_url} alt={profile.name} className="profile-avatar"/>
                      :
                      <div className="profile-avatar-placeholder">{profile.name?.charAt(0)}</div>
                    }
                    <div className="profile-info">
                      <div className="profile-name">{profile.name}</div>
                      <div className="profile-details">{profile.job} • {profile.city}</div>
                      <div className="profile-views">{profile.view_count||0} Aufrufe</div>
                    </div>
                    <button onClick={()=>deleteProfile(profile.id)} className="delete-btn">Löschen</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="content-box">
              <h2 className="section-title">Buchungen verwalten</h2>
              <div className="items-list">
                {bookings.map(booking=>{
                  const profile = profiles.find(p=>p.id===booking.profile_id);
                  return(
                    <div key={booking.id} className="booking-item">
                      <div className="booking-header">
                        <div>
                          <div className="booking-name">{booking.customer_name}</div>
                          <div className="booking-helper">Helfer: {profile?.name || 'Unbekannt'}</div>
                          <div className="booking-date">{new Date(booking.booking_date).toLocaleDateString('de-DE')}</div>
                        </div>
                        <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
                      </div>
                      {booking.message&&<div className="booking-message">{booking.message}</div>}
                      <div className="booking-actions">
                        <button onClick={()=>updateBookingStatus(booking.id,'confirmed')} className="action-btn confirm">Bestätigen</button>
                        <button onClick={()=>updateBookingStatus(booking.id,'cancelled')} className="action-btn cancel">Absagen</button>
                        <button onClick={()=>updateBookingStatus(booking.id,'pending')} className="action-btn pending">Pending</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer/>

      <style>{`
        .admin-container {
          min-height: 100vh;
          background-color: #F9FAFB;
        }
        .admin-wrapper {
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
          background-image: url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80);
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
        }
        .hero-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 12px;
          font-family: "Outfit", sans-serif;
        }
        .hero-subtitle {
          font-size: 18px;
          opacity: 0.95;
          font-family: "Outfit", sans-serif;
        }
        .admin-content {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }
        .tabs-container {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          background-color: white;
          padding: 8px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .tab-btn {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background-color: transparent;
          color: #6B7280;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
        }
        .tab-btn.active {
          background-color: #14B8A6;
          color: white;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }
        .stat-card {
          background-color: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: all 0.3s;
          text-align: center;
        }
        .stat-card:hover {
          transform: translateY(-4px);
        }
        .stat-label {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 12px;
          font-family: "Outfit", sans-serif;
          font-weight: 500;
        }
        .stat-value {
          font-size: 42px;
          font-weight: 800;
          font-family: "Outfit", sans-serif;
        }
        .content-box {
          background-color: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        .section-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .items-list {
          display: grid;
          gap: 16px;
        }
        .profile-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background-color: #F9FAFB;
          border-radius: 12px;
        }
        .profile-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .profile-avatar-placeholder {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
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
          font-size: 16px;
          font-weight: 700;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .profile-details {
          font-size: 14px;
          color: #6B7280;
          font-family: "Outfit", sans-serif;
        }
        .profile-views {
          font-size: 13px;
          color: #9CA3AF;
          font-family: "Outfit", sans-serif;
        }
        .delete-btn {
          padding: 10px 20px;
          background-color: #EF4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .delete-btn:hover {
          background-color: #DC2626;
        }
        .booking-item {
          padding: 24px;
          background-color: #F9FAFB;
          border-radius: 12px;
        }
        .booking-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .booking-name {
          font-size: 16px;
          font-weight: 700;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .booking-helper {
          font-size: 14px;
          color: #6B7280;
          font-family: "Outfit", sans-serif;
        }
        .booking-date {
          font-size: 13px;
          color: #9CA3AF;
          font-family: "Outfit", sans-serif;
        }
        .status-badge {
          padding: 6px 12px;
          color: white;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          height: fit-content;
          font-family: "Outfit", sans-serif;
          text-transform: capitalize;
        }
        .status-confirmed { background-color: #10B981; }
        .status-pending { background-color: #F59E0B; }
        .status-cancelled { background-color: #EF4444; }
        .booking-message {
          font-size: 14px;
          color: #4B5563;
          margin-bottom: 16px;
          font-family: "Outfit", sans-serif;
        }
        .booking-actions {
          display: flex;
          gap: 8px;
        }
        .action-btn {
          flex: 1;
          padding: 10px;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
        }
        .action-btn:hover {
          transform: translateY(-2px);
        }
        .action-btn.confirm { background-color: #10B981; }
        .action-btn.confirm:hover { background-color: #059669; }
        .action-btn.cancel { background-color: #EF4444; }
        .action-btn.cancel:hover { background-color: #DC2626; }
        .action-btn.pending { background-color: #F59E0B; }
        .action-btn.pending:hover { background-color: #D97706; }

        /* MOBILE */
        @media (max-width: 768px) {
          .hero-section {
            padding: 40px 16px !important;
          }
          .hero-title {
            font-size: 28px !important;
          }
          .hero-subtitle {
            font-size: 15px !important;
          }
          .admin-content {
            margin: 24px auto !important;
            padding: 0 16px !important;
          }
          .tabs-container {
            flex-direction: column !important;
            gap: 8px !important;
            padding: 12px !important;
          }
          .tab-btn {
            padding: 12px !important;
            font-size: 14px !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .stat-card {
            padding: 24px !important;
          }
          .stat-value {
            font-size: 32px !important;
          }
          .content-box {
            padding: 20px !important;
          }
          .section-title {
            font-size: 20px !important;
            margin-bottom: 20px !important;
          }
          .items-list {
            gap: 12px !important;
          }
          .profile-item {
            flex-wrap: wrap !important;
            padding: 16px !important;
          }
          .profile-avatar, .profile-avatar-placeholder {
            width: 40px !important;
            height: 40px !important;
            font-size: 18px !important;
          }
          .profile-name {
            font-size: 15px !important;
          }
          .profile-details {
            font-size: 13px !important;
          }
          .profile-views {
            font-size: 12px !important;
          }
          .delete-btn {
            width: 100% !important;
            padding: 10px !important;
            font-size: 13px !important;
          }
          .booking-item {
            padding: 16px !important;
          }
          .booking-header {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .booking-name {
            font-size: 15px !important;
          }
          .booking-helper, .booking-date {
            font-size: 13px !important;
          }
          .status-badge {
            align-self: flex-start !important;
          }
          .booking-message {
            font-size: 13px !important;
          }
          .booking-actions {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .action-btn {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
