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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated]);

  const fetchData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('❌ Falsches Passwort!');
    }
  };

  const deleteProfile = async (id) => {
    if (!window.confirm('Profil wirklich löschen?')) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      alert('✅ Profil gelöscht!');
      fetchData();
    } catch (error) {
      alert('❌ Fehler: ' + error.message);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      alert('❌ Fehler: ' + error.message);
    }
  };

  if (!authenticated) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)'}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <form onSubmit={handleLogin} style={{backgroundColor:'white',borderRadius:20,padding:40,boxShadow:'0 8px 30px rgba(0,0,0,0.2)',maxWidth:400,width:'100%',margin:20}}>
          <h1 style={{fontSize:32,fontWeight:800,marginBottom:24,textAlign:'center',color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>🔐 Admin Login</h1>
          <input type="password" placeholder="Passwort" value={password} onChange={(e)=>setPassword(e.target.value)} style={{width:'100%',padding:'16px 20px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:16,marginBottom:20,outline:'none',fontFamily:'"Outfit",sans-serif'}}/>
          <button type="submit" style={{width:'100%',padding:'16px',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif'}}>Login</button>
        </form>
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

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div style={{paddingTop:70}}>
        <div style={{position:'relative',overflow:'hidden',padding:'60px 20px',color:'white'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.12,zIndex:0}}/>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(20,184,166,0.92) 0%,rgba(13,148,136,0.95) 100%)',zIndex:1}}/>
          <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2}}>
            <h1 style={{fontSize:48,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif'}}>👑 Admin Dashboard</h1>
            <p style={{fontSize:18,opacity:0.95,fontFamily:'"Outfit",sans-serif'}}>Verwaltung & Statistiken</p>
          </div>
        </div>

        <div style={{maxWidth:1200,margin:'40px auto',padding:'0 20px'}}>
          
          <div style={{display:'flex',gap:12,marginBottom:32,backgroundColor:'white',padding:8,borderRadius:16,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
            {['stats','profiles','bookings'].map(tab=>(
              <button key={tab} onClick={()=>setActiveTab(tab)} style={{flex:1,padding:'14px',border:'none',borderRadius:12,backgroundColor:activeTab===tab?'#14B8A6':'transparent',color:activeTab===tab?'white':'#6B7280',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}}>
                {tab==='stats'?'📊 Statistiken':tab==='profiles'?'👤 Profile':'📅 Buchungen'}
              </button>
            ))}
          </div>

          {activeTab === 'stats' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:24}}>
              {[
                {label:'Profile Gesamt',value:stats.totalProfiles,color:'#14B8A6',icon:'👤'},
                {label:'Buchungen Gesamt',value:stats.totalBookings,color:'#F97316',icon:'📅'},
                {label:'Ausstehend',value:stats.pendingBookings,color:'#F59E0B',icon:'⏳'},
                {label:'Bestätigt',value:stats.confirmedBookings,color:'#10B981',icon:'✅'},
                {label:'Bewertungen',value:stats.totalReviews,color:'#8B5CF6',icon:'⭐'},
                {label:'Profilaufrufe',value:stats.totalViews,color:'#06B6D4',icon:'👁️'}
              ].map((stat,i)=>(
                <div key={i} style={{backgroundColor:'white',borderRadius:20,padding:32,boxShadow:'0 4px 20px rgba(0,0,0,0.08)',transition:'all 0.3s'}} onMouseOver={(e)=>e.currentTarget.style.transform='translateY(-4px)'} onMouseOut={(e)=>e.currentTarget.style.transform='translateY(0)'}>
                  <div style={{fontSize:40,marginBottom:12}}>{stat.icon}</div>
                  <div style={{fontSize:14,color:'#6B7280',marginBottom:8,fontFamily:'"Outfit",sans-serif',fontWeight:500}}>{stat.label}</div>
                  <div style={{fontSize:36,fontWeight:800,color:stat.color,fontFamily:'"Outfit",sans-serif'}}>{stat.value}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'profiles' && (
            <div style={{backgroundColor:'white',borderRadius:20,padding:32,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
              <h2 style={{fontSize:24,fontWeight:700,marginBottom:24,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Profile verwalten</h2>
              <div style={{display:'grid',gap:16}}>
                {profiles.map(profile=>(
                  <div key={profile.id} style={{display:'flex',alignItems:'center',gap:16,padding:20,backgroundColor:'#F9FAFB',borderRadius:12}}>
                    {profile.image_url?<img src={profile.image_url} alt={profile.name} style={{width:50,height:50,borderRadius:'50%',objectFit:'cover'}}/>:<div style={{width:50,height:50,borderRadius:'50%',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,fontWeight:700,color:'white',fontFamily:'"Outfit",sans-serif'}}>{profile.name?.charAt(0)}</div>}
                    <div style={{flex:1}}>
                      <div style={{fontSize:16,fontWeight:700,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>{profile.name}</div>
                      <div style={{fontSize:14,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>{profile.job} • {profile.city}</div>
                      <div style={{fontSize:13,color:'#9CA3AF',fontFamily:'"Outfit",sans-serif'}}>👁️ {profile.view_count||0} Aufrufe</div>
                    </div>
                    <button onClick={()=>deleteProfile(profile.id)} style={{padding:'10px 20px',backgroundColor:'#EF4444',color:'white',border:'none',borderRadius:8,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif'}}>🗑️ Löschen</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div style={{backgroundColor:'white',borderRadius:20,padding:32,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
              <h2 style={{fontSize:24,fontWeight:700,marginBottom:24,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Buchungen verwalten</h2>
              <div style={{display:'grid',gap:20}}>
                {bookings.map(booking=>{
                  const profile = profiles.find(p=>p.id===booking.profile_id);
                  return(
                    <div key={booking.id} style={{padding:24,backgroundColor:'#F9FAFB',borderRadius:12}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
                        <div>
                          <div style={{fontSize:16,fontWeight:700,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>{booking.customer_name}</div>
                          <div style={{fontSize:14,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>Helfer: {profile?.name || 'Unbekannt'}</div>
                          <div style={{fontSize:13,color:'#9CA3AF',fontFamily:'"Outfit",sans-serif'}}>📅 {new Date(booking.booking_date).toLocaleDateString('de-DE')}</div>
                        </div>
                        <span style={{padding:'6px 12px',backgroundColor:booking.status==='confirmed'?'#10B981':booking.status==='pending'?'#F59E0B':'#EF4444',color:'white',borderRadius:8,fontSize:12,fontWeight:700,height:'fit-content',fontFamily:'"Outfit",sans-serif'}}>{booking.status}</span>
                      </div>
                      {booking.message&&<div style={{fontSize:14,color:'#4B5563',marginBottom:16,fontFamily:'"Outfit",sans-serif'}}>💬 {booking.message}</div>}
                      <div style={{display:'flex',gap:8}}>
                        <button onClick={()=>updateBookingStatus(booking.id,'confirmed')} style={{flex:1,padding:'10px',backgroundColor:'#10B981',color:'white',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif'}}>✅ Bestätigen</button>
                        <button onClick={()=>updateBookingStatus(booking.id,'cancelled')} style={{flex:1,padding:'10px',backgroundColor:'#EF4444',color:'white',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif'}}>❌ Absagen</button>
                        <button onClick={()=>updateBookingStatus(booking.id,'pending')} style={{flex:1,padding:'10px',backgroundColor:'#F59E0B',color:'white',border:'none',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif'}}>⏳ Pending</button>
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
    </div>
  );
}

export default AdminDashboard;
