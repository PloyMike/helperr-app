import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from './supabase';

function Header() {
  const { user, signOut } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
      clearInterval(msgInterval);
    };
  }, [user]);

  return (
    <header style={{position:'fixed',top:0,left:0,right:0,background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',padding:'16px 20px',boxShadow:'0 4px 20px rgba(0,0,0,0.1)',zIndex:1000}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{maxWidth:1400,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        
        <div onClick={()=>window.navigateTo('home')} style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
          <div style={{fontSize:32}}>🤝</div>
          <h1 style={{fontSize:28,fontWeight:800,color:'white',margin:0,fontFamily:'"Outfit",sans-serif',letterSpacing:'-0.5px'}}>Helperr</h1>
        </div>

        {/* Desktop Navigation */}
        <nav style={{display:'flex',alignItems:'center',gap:24}} className="desktop-nav">
          <button onClick={()=>window.navigateTo('home')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Startseite
          </button>
          
          <button onClick={()=>window.navigateTo('bookings')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Buchungen
          </button>

          <button onClick={()=>window.navigateTo('messages')} style={{position:'relative',background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Nachrichten
            {unreadCount>0&&<span style={{position:'absolute',top:-8,right:-12,backgroundColor:'#F97316',color:'white',borderRadius:'50%',width:20,height:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700}}>{unreadCount}</span>}
          </button>

          <button onClick={()=>{const mapSection=document.getElementById('map-section');if(mapSection)mapSection.scrollIntoView({behavior:'smooth'});}} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Karte
          </button>

          <button onClick={()=>window.navigateTo('favorites')} style={{position:'relative',background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Favoriten
            {favorites.length>0&&<span style={{position:'absolute',top:-8,right:-12,backgroundColor:'#F97316',color:'white',borderRadius:'50%',width:20,height:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700}}>{favorites.length}</span>}
          </button>

          <button onClick={()=>window.navigateTo('register')} style={{background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            + Anbieter werden
          </button>

          
          {user&&<button onClick={()=>{window.navigateTo('edit-profile');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            Mein Profil
          </button>}
          {user ? (
            <div style={{display:'flex',alignItems:'center',gap:16}}>
              <span style={{fontSize:14,fontWeight:600,color:'white',fontFamily:'"Outfit",sans-serif'}}>{user.user_metadata?.name || user.email}</span>
              <button onClick={async()=>{await signOut();window.navigateTo('home');}} style={{padding:'10px 20px',backgroundColor:'rgba(255,255,255,0.2)',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}}>Logout</button>
            </div>
          ) : (
            <button onClick={()=>window.navigateTo('login')} style={{padding:'10px 20px',backgroundColor:'#F97316',color:'white',border:'none',borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer',boxShadow:'0 4px 12px rgba(249,115,22,0.3)',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}}>Login</button>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button onClick={()=>setMobileMenuOpen(!mobileMenuOpen)} style={{display:'none',background:'none',border:'none',color:'white',fontSize:28,cursor:'pointer',padding:8}} className="mobile-menu-btn">
          {mobileMenuOpen?'✕':'☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen&&(
        <div style={{position:'absolute',top:70,left:0,right:0,backgroundColor:'#0D9488',padding:20,boxShadow:'0 8px 20px rgba(0,0,0,0.2)'}} className="mobile-menu">
          <button onClick={()=>{window.navigateTo('home');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            Startseite
          </button>
          <button onClick={()=>{window.navigateTo('register');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            Anbieter werden
          </button>
          {user&&<button onClick={()=>{window.navigateTo('bookings');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            Buchungen
          </button>}
          {user&&<button onClick={()=>{window.navigateTo('messages');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)',position:'relative'}}>
            Nachrichten {unreadCount>0&&<span style={{marginLeft:8,padding:'2px 8px',backgroundColor:'#F97316',borderRadius:12,fontSize:12}}>({unreadCount})</span>}
          </button>}
          
          {user&&<button onClick={()=>{window.navigateTo('favorites');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            Favoriten {favorites.length>0&&<span style={{marginLeft:8,padding:'2px 8px',backgroundColor:'#F97316',borderRadius:12,fontSize:12}}>({favorites.length})</span>}
          </button>}
          {user&&<button onClick={()=>{window.navigateTo('edit-profile');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'none',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
            Mein Profil
          </button>}
          
          {user ? (
            <>
              <div style={{padding:16,color:'white',fontSize:14,fontFamily:'"Outfit",sans-serif',borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                {user.user_metadata?.name || user.email}
              </div>
              <button onClick={async()=>{await signOut();setMobileMenuOpen(false);window.navigateTo('home');}} style={{width:'100%',padding:16,background:'rgba(255,255,255,0.2)',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderRadius:8,marginTop:8}}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={()=>{window.navigateTo('login');setMobileMenuOpen(false);}} style={{width:'100%',padding:16,background:'#F97316',border:'none',color:'white',fontSize:16,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',textAlign:'left',borderRadius:8,marginTop:8}}>
              Login
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}

export default Header;
