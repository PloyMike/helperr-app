import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Header from './Header';
import Footer from './Footer';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchQuery || 
      booking.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer_email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#F9FAFB',fontFamily:'"Outfit",sans-serif',fontSize:24,fontWeight:600,color:'#14B8A6'}}>Lädt Buchungen...</div>;
  }

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div style={{paddingTop:70}}>
        <div style={{position:'relative',overflow:'hidden',padding:'60px 20px'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.7,zIndex:0}}/>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(250,250,250,0.9) 100%)',zIndex:1}}/>
          <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2,color:'#1F2937'}}>
            <h1 style={{fontSize:48,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}}>📋 Meine Buchungen</h1>
            <p style={{fontSize:18,opacity:0.95,fontFamily:'"Outfit",sans-serif',fontWeight:400}}>Verwalte alle deine Buchungen an einem Ort</p>
          </div>
        </div>

        <div style={{maxWidth:1200,margin:'40px auto',padding:'0 20px'}}>
          
          <div style={{backgroundColor:'white',borderRadius:20,padding:32,marginBottom:32,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:20,marginBottom:24}}>
              <div>
                <input
                  type="text"
                  placeholder="Suche nach Name oder Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{width:'100%',padding:'14px 20px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}}
                  onFocus={(e)=>{e.target.style.borderColor='#14B8A6';e.target.style.boxShadow='0 0 0 3px rgba(20,184,166,0.1)';}}
                  onBlur={(e)=>{e.target.style.borderColor='#E5E7EB';e.target.style.boxShadow='none';}}
                />
              </div>
              
              <div style={{display:'flex',gap:12}}>
                {['all','pending','confirmed','cancelled'].map(status=>(
                  <button
                    key={status}
                    onClick={()=>setStatusFilter(status)}
                    style={{flex:1,padding:'14px',border:'none',borderRadius:12,backgroundColor:statusFilter===status?'#14B8A6':'#F3F4F6',color:statusFilter===status?'white':'#6B7280',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}}
                  >
                    {status==='all'?'Alle':status==='pending'?'Ausstehend':status==='confirmed'?'Bestätigt':'Abgesagt'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{fontSize:16,fontWeight:600,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>
              {filteredBookings.length} {filteredBookings.length===1?'Buchung':'Buchungen'} gefunden
            </div>
          </div>

          {filteredBookings.length===0?(
            <div style={{textAlign:'center',padding:80,backgroundColor:'white',borderRadius:20,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
              <div style={{fontSize:64,marginBottom:20}}>📋</div>
              <h2 style={{fontSize:24,fontWeight:700,marginBottom:12,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Keine Buchungen gefunden</h2>
              <p style={{fontSize:16,color:'#6B7280',marginBottom:32,fontFamily:'"Outfit",sans-serif'}}>Starte jetzt und buche deinen ersten Service!</p>
              <button onClick={()=>window.navigateTo('home')} style={{padding:'16px 32px',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:16,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif',boxShadow:'0 4px 15px rgba(20,184,166,0.3)'}}>Profile durchsuchen</button>
            </div>
          ):(
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(350px,1fr))',gap:24}}>
              {filteredBookings.map(booking=>{
                const profile=getProfile(booking.profile_id);
                return(
                  <div key={booking.id} style={{backgroundColor:'white',borderRadius:20,padding:28,boxShadow:'0 4px 20px rgba(0,0,0,0.08)',transition:'all 0.3s'}} onMouseOver={(e)=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 35px rgba(0,0,0,0.12)';}} onMouseOut={(e)=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)';}}>
                    
                    <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
                      {profile.image_url?<img src={profile.image_url} alt={profile.name} style={{width:60,height:60,borderRadius:'50%',objectFit:'cover',border:'3px solid #14B8A6'}}/>:<div style={{width:60,height:60,borderRadius:'50%',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:700,color:'white',fontFamily:'"Outfit",sans-serif'}}>{profile.name?profile.name.charAt(0).toUpperCase():'?'}</div>}
                      <div style={{flex:1}}>
                        <h3 style={{fontSize:18,fontWeight:700,marginBottom:4,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>{profile.name||'Unbekannt'}</h3>
                        <p style={{fontSize:14,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>{profile.job||'Keine Angabe'}</p>
                      </div>
                      <span style={{padding:'6px 14px',backgroundColor:getStatusColor(booking.status),color:'white',borderRadius:12,fontSize:12,fontWeight:700,fontFamily:'"Outfit",sans-serif'}}>{getStatusText(booking.status)}</span>
                    </div>

                    <div style={{borderTop:'1px solid #F3F4F6',paddingTop:20,marginBottom:20}}>
                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:13,color:'#9CA3AF',marginBottom:4,fontFamily:'"Outfit",sans-serif',fontWeight:500}}>Kunde</div>
                        <div style={{fontSize:15,fontWeight:600,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>{booking.customer_name}</div>
                        <div style={{fontSize:14,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>{booking.customer_email}</div>
                        {booking.customer_phone&&<div style={{fontSize:14,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>{booking.customer_phone}</div>}
                      </div>

                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:13,color:'#9CA3AF',marginBottom:4,fontFamily:'"Outfit",sans-serif',fontWeight:500}}>Datum & Zeit</div>
                        <div style={{fontSize:15,fontWeight:600,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>📅 {new Date(booking.booking_date).toLocaleDateString('de-DE',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</div>
                        <div style={{fontSize:14,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>⏰ {getTimeSlotLabel(booking.time_slot)}</div>
                      </div>

                      <div style={{marginBottom:12}}>
                        <div style={{fontSize:13,color:'#9CA3AF',marginBottom:4,fontFamily:'"Outfit",sans-serif',fontWeight:500}}>Preis</div>
                        <div style={{fontSize:18,fontWeight:800,color:'#F97316',fontFamily:'"Outfit",sans-serif'}}>{booking.total_price||profile.price||'Auf Anfrage'}</div>
                      </div>

                      {booking.message&&<div style={{marginBottom:12}}>
                        <div style={{fontSize:13,color:'#9CA3AF',marginBottom:4,fontFamily:'"Outfit",sans-serif',fontWeight:500}}>Nachricht</div>
                        <div style={{fontSize:14,color:'#4B5563',lineHeight:1.6,fontFamily:'"Outfit",sans-serif'}}>{booking.message}</div>
                      </div>}

                      <div>
                        <div style={{fontSize:13,color:'#9CA3AF',marginBottom:4,fontFamily:'"Outfit",sans-serif',fontWeight:500}}>Buchungs-ID</div>
                        <div style={{fontSize:12,fontFamily:'monospace',color:'#6B7280',backgroundColor:'#F9FAFB',padding:'6px 10px',borderRadius:8}}>{booking.id.substring(0,8)}</div>
                      </div>
                    </div>

                    <button onClick={()=>window.navigateTo('profile',profile)} style={{width:'100%',padding:'14px',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif',boxShadow:'0 4px 12px rgba(20,184,166,0.3)',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 6px 20px rgba(20,184,166,0.4)';}} onMouseOut={(e)=>{e.target.style.transform='translateY(0)';e.target.style.boxShadow='0 4px 12px rgba(20,184,166,0.3)';}}>Profil ansehen</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default MyBookings;
