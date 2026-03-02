import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabase';

function Header() {
  const { user, signOut } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('helperr_favorites');
    if (saved) setFavorites(JSON.parse(saved));

    const handleStorageChange = () => {
      const updated = localStorage.getItem('helperr_favorites');
      if (updated) setFavorites(JSON.parse(updated));
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    const fetchUnreadCount = async () => {
      if (user) {
        const { data } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('receiver_email', user.email)
          .eq('read', false);
        setUnreadCount(data?.length || 0);
      } else {
        setUnreadCount(0);
      }
    };
    fetchUnreadCount();
    const msgInterval = setInterval(fetchUnreadCount, 5000);

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
    const bookingsInterval = setInterval(fetchPendingBookings, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
      clearInterval(msgInterval);
      clearInterval(bookingsInterval);
    };
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    window.navigateTo('home');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{position:'fixed',top:0,left:0,right:0,background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',padding:'16px 20px',boxShadow:'0 4px 20px rgba(0,0,0,0.1)',zIndex:1000}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{maxWidth:1400,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        
        {/* LOGO */}
        <div onClick={()=>window.navigateTo('home')} style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
          <div style={{fontSize:32,fontWeight:800,color:'white',fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}}>Helperr</div>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav style={{display:'flex',alignItems:'center',gap:32}}className="desktop-nav">
          <button onClick={()=>window.navigateTo('home')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Startseite
          </button>

          {user&&<button onClick={()=>window.navigateTo('bookings')} style={{position:'relative',background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Buchungen
            {pendingBookings>0&&<span style={{position:'absolute',top:-8,right:-12,background:'#F97316',color:'white',fontSize:11,fontWeight:700,padding:'2px 6px',borderRadius:10,minWidth:18,textAlign:'center'}}>{pendingBookings}</span>}
          </button>}

          {user&&<button onClick={()=>window.navigateTo('messages')} style={{position:'relative',background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Nachrichten
            {unreadCount>0&&<span style={{position:'absolute',top:-8,right:-12,background:'#F97316',color:'white',fontSize:11,fontWeight:700,padding:'2px 6px',borderRadius:10,minWidth:18,textAlign:'center'}}>{unreadCount}</span>}
          </button>}

          {/* ZAHNRAD DROPDOWN FÜR EINGELOGGTE */}
          {user ? (
            <div style={{position:'relative'}}>
              <button onClick={()=>setDropdownOpen(!dropdownOpen)} style={{background:'white',border:'none',color:'#14B8A6',fontSize:20,fontWeight:700,cursor:'pointer',width:40,height:40,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px rgba(0,0,0,0.15)',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.transform='rotate(90deg)'} onMouseOut={(e)=>e.target.style.transform='rotate(0deg)'}>
                ⚙️
              </button>

              {dropdownOpen && (
                <>
                  <div onClick={()=>setDropdownOpen(false)} style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:999}}/>
                  <div style={{position:'absolute',top:50,right:0,background:'white',borderRadius:12,boxShadow:'0 8px 30px rgba(0,0,0,0.2)',minWidth:200,overflow:'hidden',zIndex:1000}}>
                    <button onClick={()=>{window.navigateTo('edit-profile');setDropdownOpen(false);}} style={{width:'100%',padding:'14px 20px',background:'none',border:'none',textAlign:'left',fontSize:15,fontWeight:600,color:'#1F2937',cursor:'pointer',fontFamily:'"Outfit",sans-serif',borderBottom:'1px solid #F3F4F6',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.background='#F9FAFB'} onMouseOut={(e)=>e.target.style.background='none'}>
                      Profil bearbeiten
                    </button>
                    <button onClick={()=>{window.navigateTo('register');setDropdownOpen(false);}} style={{width:'100%',padding:'14px 20px',background:'none',border:'none',textAlign:'left',fontSize:15,fontWeight:600,color:'#1F2937',cursor:'pointer',fontFamily:'"Outfit",sans-serif',borderBottom:'1px solid #F3F4F6',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.background='#F9FAFB'} onMouseOut={(e)=>e.target.style.background='none'}>
                      Anbieter werden
                    </button>
                    <button onClick={()=>{window.navigateTo('favorites');setDropdownOpen(false);}} style={{width:'100%',padding:'14px 20px',background:'none',border:'none',textAlign:'left',fontSize:15,fontWeight:600,color:'#1F2937',cursor:'pointer',fontFamily:'"Outfit",sans-serif',borderBottom:'1px solid #F3F4F6',transition:'all 0.2s',position:'relative'}} onMouseOver={(e)=>e.target.style.background='#F9FAFB'} onMouseOut={(e)=>e.target.style.background='none'}>
                      Favoriten
                      {favorites.length>0&&<span style={{position:'absolute',right:20,top:'50%',transform:'translateY(-50%)',background:'#F97316',color:'white',fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:10}}>{favorites.length}</span>}
                    </button>
                    <button onClick={()=>{window.navigateTo('provider-dashboard');setDropdownOpen(false);}} style={{width:'100%',padding:'14px 20px',background:'none',border:'none',textAlign:'left',fontSize:15,fontWeight:600,color:'#1F2937',cursor:'pointer',fontFamily:'"Outfit",sans-serif',borderBottom:'1px solid #F3F4F6',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.background='#F9FAFB'} onMouseOut={(e)=>e.target.style.background='none'}>
                      Info & Statistik
                    </button>
                    <button onClick={handleLogout} style={{width:'100%',padding:'14px 20px',background:'none',border:'none',textAlign:'left',fontSize:15,fontWeight:700,color:'#EF4444',cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.background='#FEE2E2'} onMouseOut={(e)=>e.target.style.background='none'}>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button onClick={()=>window.navigateTo('register')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
                + Anbieter werden
              </button>
              <button onClick={()=>window.navigateTo('login')} style={{padding:'10px 20px',backgroundColor:'#F97316',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer',boxShadow:'0 4px 12px rgba(249,115,22,0.3)',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}}>
                Login
              </button>
            </>
          )}
        </nav>

        {/* MOBILE HAMBURGER */}
        <button onClick={()=>setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-btn" style={{display:'none',background:'none',border:'none',color:'white',fontSize:28,cursor:'pointer',padding:8}}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div style={{position:'fixed',top:70,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:999}} onClick={()=>setMobileMenuOpen(false)}>
          <div onClick={(e)=>e.stopPropagation()} style={{background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',padding:'20px 0',boxShadow:'0 8px 30px rgba(0,0,0,0.3)'}}>
            
            <button onClick={()=>{window.navigateTo('home');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
              Startseite
            </button>

            {user&&<button onClick={()=>{window.navigateTo('bookings');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)',position:'relative'}}>
              Buchungen
              {pendingBookings>0&&<span style={{position:'absolute',right:20,top:'50%',transform:'translateY(-50%)',background:'#F97316',color:'white',fontSize:11,fontWeight:700,padding:'4px 8px',borderRadius:10}}>{pendingBookings}</span>}
            </button>}

            {user&&<button onClick={()=>{window.navigateTo('messages');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)',position:'relative'}}>
              Nachrichten
              {unreadCount>0&&<span style={{position:'absolute',right:20,top:'50%',transform:'translateY(-50%)',background:'#F97316',color:'white',fontSize:11,fontWeight:700,padding:'4px 8px',borderRadius:10}}>{unreadCount}</span>}
            </button>}

            {user&&<button onClick={()=>{window.navigateTo('edit-profile');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
              Profil bearbeiten
            </button>}

            {user&&<button onClick={()=>{window.navigateTo('favorites');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)',position:'relative'}}>
              Favoriten
              {favorites.length>0&&<span style={{position:'absolute',right:20,top:'50%',transform:'translateY(-50%)',background:'#F97316',color:'white',fontSize:11,fontWeight:700,padding:'4px 8px',borderRadius:10}}>{favorites.length}</span>}
            </button>}

            {user&&<button onClick={()=>{window.navigateTo('provider-dashboard');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
              Info & Statistik
            </button>}

            <button onClick={()=>{window.navigateTo('register');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
              + Anbieter werden
            </button>

            {user ? (
              <button onClick={handleLogout} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left'}}>
                Logout
              </button>
            ) : (
              <button onClick={()=>{window.navigateTo('login');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left'}}>
                Login
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}

export default Header;
