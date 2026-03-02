import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';
import Footer from './Footer';

function ProviderDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProviderData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchProviderData = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('profile_id', profileData.id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Header/>
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'90px 20px 40px'}}>
          <div style={{background:'white',padding:40,borderRadius:20,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',maxWidth:400,width:'100%',fontFamily:'"Outfit",sans-serif',textAlign:'center'}}>
            <h2 style={{fontSize:24,fontWeight:700,marginBottom:20,color:'#1F2937'}}>Login erforderlich</h2>
            <p style={{fontSize:15,color:'#6B7280',marginBottom:24}}>Bitte logge dich ein um dein Dashboard zu sehen.</p>
            <button onClick={()=>window.navigateTo('login')} style={{width:'100%',padding:16,background:'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer'}}>
              Zum Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#F9FAFB'}}>
        <p style={{fontSize:20,fontWeight:600,color:'#14B8A6',fontFamily:'"Outfit",sans-serif'}}>Lädt Dashboard...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Header/>
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'90px 20px 40px'}}>
          <div style={{background:'white',padding:40,borderRadius:20,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',maxWidth:400,width:'100%',fontFamily:'"Outfit",sans-serif',textAlign:'center'}}>
            <div style={{fontSize:64,marginBottom:20}}>🚀</div>
            <h2 style={{fontSize:24,fontWeight:700,marginBottom:12,color:'#1F2937'}}>Noch kein Provider</h2>
            <p style={{fontSize:15,color:'#6B7280',marginBottom:24}}>Erstelle zuerst ein Provider-Profil!</p>
            <button onClick={()=>window.navigateTo('register')} style={{width:'100%',padding:16,background:'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer'}}>
              Anbieter werden
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    revenue: bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => {
      const price = b.total_price?.match(/\d+/);
      return sum + (price ? parseInt(price[0]) : 0);
    }, 0)
  };

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div style={{paddingTop:70}}>
        <div style={{position:'relative',overflow:'hidden',padding:'60px 20px',background:'linear-gradient(135deg,rgba(20,184,166,0.1) 0%,rgba(13,148,136,0.1) 100%)'}}>
          <div style={{maxWidth:1200,margin:'0 auto',textAlign:'center'}}>
            <h1 style={{fontSize:48,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif',color:'#1F2937'}}>Provider Dashboard</h1>
            <p style={{fontSize:18,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>Willkommen zurück, {profile.name}!</p>
          </div>
        </div>

        <div style={{maxWidth:1200,margin:'40px auto',padding:'0 20px'}}>
          
          {/* STATISTIKEN */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:20,marginBottom:40}}>
            <div style={{background:'white',padding:24,borderRadius:16,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
              <div style={{fontSize:14,fontWeight:600,color:'#6B7280',marginBottom:8,fontFamily:'"Outfit",sans-serif'}}>Gesamt Buchungen</div>
              <div style={{fontSize:32,fontWeight:800,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>{stats.total}</div>
            </div>
            
            <div style={{background:'white',padding:24,borderRadius:16,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
              <div style={{fontSize:14,fontWeight:600,color:'#6B7280',marginBottom:8,fontFamily:'"Outfit",sans-serif'}}>Ausstehend</div>
              <div style={{fontSize:32,fontWeight:800,color:'#F59E0B',fontFamily:'"Outfit",sans-serif'}}>{stats.pending}</div>
            </div>
            
            <div style={{background:'white',padding:24,borderRadius:16,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
              <div style={{fontSize:14,fontWeight:600,color:'#6B7280',marginBottom:8,fontFamily:'"Outfit",sans-serif'}}>Bestätigt</div>
              <div style={{fontSize:32,fontWeight:800,color:'#14B8A6',fontFamily:'"Outfit",sans-serif'}}>{stats.confirmed}</div>
            </div>
            
            <div style={{background:'white',padding:24,borderRadius:16,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
              <div style={{fontSize:14,fontWeight:600,color:'#6B7280',marginBottom:8,fontFamily:'"Outfit",sans-serif'}}>Umsatz (bestätigt)</div>
              <div style={{fontSize:32,fontWeight:800,color:'#F97316',fontFamily:'"Outfit",sans-serif'}}>€{stats.revenue}</div>
            </div>
          </div>

          {/* LINK ZU BUCHUNGEN */}
          <div style={{background:'white',padding:40,borderRadius:20,boxShadow:'0 4px 20px rgba(0,0,0,0.08)',textAlign:'center'}}>
            <div style={{fontSize:48,marginBottom:20}}>📋</div>
            <h2 style={{fontSize:24,fontWeight:700,marginBottom:12,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Buchungen verwalten</h2>
            <p style={{fontSize:16,color:'#6B7280',marginBottom:24,fontFamily:'"Outfit",sans-serif'}}>Sieh alle deine Buchungen an und verwalte sie.</p>
            <button onClick={()=>window.navigateTo('bookings')} style={{padding:'16px 32px',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:16,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif',boxShadow:'0 4px 15px rgba(20,184,166,0.3)'}}>
              Zu meinen Buchungen →
            </button>
          </div>
        </div>
      </div>

      <Footer/>

      <style>{`
        @media (max-width: 768px) {
          h1 { font-size: 28px !important; }
          div[style*="gridTemplateColumns: repeat(auto-fit"] { grid-template-columns: 1fr 1fr !important; }
          div[style*="fontSize:32"] { font-size: 24px !important; }
        }
      `}</style>
    </div>
  );
}

export default ProviderDashboard;
